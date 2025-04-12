/**
 * Google Gemini APIとの連携コード
 */
import { Story, Options, Scene, LearningPoint } from './storyModel';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";
import { exec } from 'child_process';
import util from 'util';
import { uploadImageToStorage } from './firebase';

// 環境変数のチェック
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY環境変数が設定されていません。');
}

// Gemini APIの初期化
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Gemini APIを使ってストーリーを生成する
 * @param theme ユーザーが入力したテーマ
 * @param options 生成オプション
 * @returns 生成されたストーリーデータ
 */
export async function generateStory(theme: string, options: Options = {}): Promise<Story> {
  // オプションのデフォルト値設定
  const { difficulty = '通常', length = '中' } = options;
  
  // プロンプト作成
  const prompt = `
テーマ「${theme}」に基づいて対話型のシミュレーションゲームを作成してください。
難易度: ${difficulty}
長さ: ${length}

以下の要素を必ず含めてください:
1. タイトル
2. 説明文（プレイヤー特定の役割を持ち、目標を達成するためのゲームの概要）
3. ストーリー展開（少なくとも5つ、多くとも10つのシーン）
4. 各ストーリー展開の最後以外、各シーンに必ず選択肢（2〜3つ）を含め、プレイヤーの選択によってストーリーが変化する
5. 教育的内容を含む結末

以下のJSONフォーマットで出力してください,途中で切れないようにしてください:
{
  "title": "ゲームタイトル",
  "description": "ゲームの説明",
  "initialScene": "start",
  "scenes": [
    {
      "id": "start",
      "type": "scene",
      "background": "シーンに合わせて背景のプロンプトを英語で一言で記述 変わらない場合は同じにしてください",
      "characters": [
        {"id": "キャラクターを英語で簡潔に記述。名前もあり。", "position": {"x": 50, "y": 20}}
      ],
      "text": "シーンのテキスト内容（日本語）（シーンの説明とキャラクターのセリフを含む、ナレーションや対話形式で、ナレーションなら（ナレーション）、キャラクターなら（キャラクター名）を先頭につける）",
      "text_en": "シーンのテキスト内容（英語）",
      "choices": [
        {
          "text": "選択肢1のテキスト（日本語）",
          "nextScene": "scene_id_1"
        },
        {
          "text": "選択肢2のテキスト（日本語）",
          "nextScene": "scene_id_2"
        }
      ]
    }
  ]
}
`;

  try {
    // ログ保存ディレクトリを作成
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Geminiモデルを使用
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        responseModalities: ["text"],
        temperature: 0.8,
        maxOutputTokens: 8192,
        topP: 0.95,
        topK: 40
      }
    });

    console.log('Executing story generation request...');
    if (!result.candidates || result.candidates.length === 0) {
      throw new Error('No candidates were returned by the Gemini API');
    }
    const response = result.candidates[0];
    let allScenes = [] as Scene[];
    let baseStoryData;

    if (!response.content || !response.content.parts) {
      throw new Error('Invalid response format from Gemini API');
    }
    // 各パートを処理
    for (const part of response.content.parts) {
      const text = part.text;
      if (!text) {
        continue;
      }
      // JSON形式の部分を抽出
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      // ファイルに保存
      const filePath = path.join(logDir, `story-generation-${Date.now()}.txt`);
      // JSON部分をファイルに保存
      fs.writeFileSync(filePath, text);
      console.log('JSON match:', jsonMatch);
      if (jsonMatch) {
        console.log('JSON:', jsonMatch[0]);
        // 前処理：一般的な問題を修正
        const jsonText = jsonMatch[0].trim()
        // 引用符の周りの空白を除去（誤ったエスケープを防ぐ）
        .replace(/"\\s+/g, '"')
        .replace(/\\s+"/g, '"')
        // 不要な制御文字を削除
        .replace(/[\u0000-\u001F]/g, ' ')
        // コメントを削除（簡易的な対応）
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // 末尾のカンマを修正
        .replace(/,(\s*[\]}])/g, '$1');
        const storyData = JSON.parse(jsonText) as Story;
        if (!baseStoryData) {
          // 最初のJSONをベースとして使用
          baseStoryData = {
            ...storyData,
          }
        }
        // シーンを追加
        if (storyData.scenes && Array.isArray(storyData.scenes)) {
          allScenes = [...allScenes, ...storyData.scenes];
        }
      }
    }

    if (!baseStoryData) {
      throw new Error('有効なJSONが生成されませんでした');
    }
    console.log('Base game data:', baseStoryData);

    // 学習ポイントの追加（オプション）
    try {
      const chat = await genAI.chats.create({
        model: "gemini-2.0-flash-exp",
        history: [
          {
            role: "user",
            parts: [{ text: theme }],
          },
          {
            role: "model",
            parts: [{ text: JSON.stringify(baseStoryData, null, 2), }],
          }
        ],
      });
      const chatPrompt = `
        各シーンで学びがある場合、学びポイントを以下のJSONフォーマットで別途出力してください
        先ほどのJSONは返却不要です
        そのシーンでの学びがない場合は、学びポイントを記述しないでください
        {
          "learningPoints": [
            {
              "sceneId": "start",
              "title": "この場面での学びのタイトル",
              "content": "この場面で学べる教育的内容の詳細な解説",
            },
            {
              "sceneId": "scene_id_1",
              "title": "この場面での学びのタイトル",
              "content": "この場面で学べる教育的内容の詳細な解説",
            }
            // 他のシーンも学びがある場合は同様に追加
          ]
        }
      `;
    
      const responseChat = await chat.sendMessage({
        message: chatPrompt,
        config: {
          responseModalities: ["Text"],
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
        }
      });
      if (!responseChat || !responseChat.candidates || responseChat.candidates.length === 0) {
        throw new Error('No candidates were returned by the Gemini API for learning points');
      }
      if (!responseChat.candidates[0].content || !responseChat.candidates[0].content.parts) {
        throw new Error('Invalid response format from Gemini API for learning points');
      }
      const responseText = responseChat.candidates[0].content.parts[0].text;
      if (!responseText) {
        throw new Error('No text content in the response for learning points');
      }
      // JSON形式の部分を抽出
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        // console.log('JSON:', jsonMatch[0]);
        const supplyData = JSON.parse(jsonMatch[0].trim());
  
        // シーンに学びポイントを追加
        for (const scene of allScenes) {
          const learningPoint = supplyData.learningPoints.find(point => point.sceneId === scene.id);
          if (learningPoint) {
            scene.learningPoint = learningPoint;
          }
        }
      }

      // 全シーンを統合したゲームデータを作成
      const mergedStoryData = {
        ...baseStoryData,
        scenes: allScenes
      };
      return mergedStoryData;
    } catch (e) {
      console.warn('学習ポイントの追加に失敗しました:', e.message);
      // 失敗しても続行
    }
  } catch (error: any) {
    console.error('Error generating story:', error);
    throw new Error(`ストーリーの生成に失敗しました: ${error.message}`);
  }
}

/**
 * Vertex AI Imagen APIを使用して画像を生成する
 * @param prompt 画像生成のプロンプト
 * @returns 生成された画像のBase64データ
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log("Generating image with prompt:", prompt);

    // 一時ファイルのパスを生成
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const requestFileName = path.join(tempDir, `request-${timestamp}-${randomNum}.json`);
    const responseFileName = path.join(tempDir, `response-${timestamp}-${randomNum}.json`);

    // 生成用の JSON データを作成 (Imagen API のフォーマット)
    const requestData = {
      "instances": {
        "prompt": prompt
      },
      "parameters": {
        "sampleCount": 1,
        "aspectRatio": "16:9"
      }
    };

    // リクエストデータをファイルに書き込む
    fs.writeFileSync(requestFileName, JSON.stringify(requestData));

    // curl コマンドを実行して画像を取得
    const curlCommand = `curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${process.env.GEMINI_PAID_API_KEY}" \
      -H "Content-Type: application/json" \
      -d @${requestFileName} > ${responseFileName}`;

    console.log("Executing API request...");

    // curl コマンドを同期的に実行
    await util.promisify(exec)(curlCommand, { maxBuffer: 50 * 1024 * 1024 }); // 50MB のバッファサイズを指定

    // レスポンスファイルを読み込んでパース
    const responseText = fs.readFileSync(responseFileName, 'utf8');
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("API response received and parsed");
    } catch (e) {
      console.error("JSON parse error:", e.message);
      console.error("Response text (first 100 chars):", responseText.substring(0, 100));
      throw new Error("APIレスポンスのパースに失敗しました");
    }

    // テンポラリファイルの削除
    try {
      fs.unlinkSync(requestFileName);
      fs.unlinkSync(responseFileName);
    } catch (err) {
      console.warn("Failed to clean up temporary files:", err.message);
    }

    // エラーチェック
    if (responseData.error) {
      throw new Error(`API エラー: ${responseData.error.message}`);
    }

    // 実際のレスポンス構造に合わせて画像データを抽出
    if (!responseData.predictions || !Array.isArray(responseData.predictions) || responseData.predictions.length === 0) {
      console.error("Invalid response structure:", JSON.stringify(responseData).substring(0, 200) + "...");
      throw new Error('レスポンスに有効な画像データが含まれていません');
    }

    // 画像データを取得
    const prediction = responseData.predictions[0];
    if (!prediction.bytesBase64Encoded) {
      console.error("No base64 image data in prediction:", JSON.stringify(prediction).substring(0, 100) + "...");
      throw new Error('レスポンスに画像データが見つかりません');
    }
    
    const base64Image = prediction.bytesBase64Encoded;
    console.log("Found image data of length:", base64Image.length);
    
    // プロンプトの短縮版を作成 (ファイル名用)
    const shortPrompt = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    
    // 画像をアップロード
    const result = await uploadImageToStorage(base64Image, 'generated', shortPrompt);
    console.log('Generated image uploaded successfully');
    return result;
  } catch (error: any) {
    console.error('Error generating image:', error.message);
    
    // エラーが発生した場合はプレースホルダー画像のBase64を返す
    const placeholderImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAMAAAD8CC+4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1zbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1zbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1zbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1zbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5NkU4OENBRTk3NDExRUJBMEI1OEQ0QkRBQjk2QjlEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5NkU4OENCRTk3NDExRUJBMEI1OEQ0QkRBQjk2QjlEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk2RTg4QzhFOTc0MTFFQkEwQjU4RDRCREFCOTZCOUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk2RTg4QzlFOTc0MTFFQkEwQjU4RDRCREFCOTZCOUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAyADIAAAI/wD/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDi/8fT768+fPo06tfz769+/fw48ufT7++/fv48+vfz7+///8ABijggAQWaOCBCCao4IIMNujggxBGKOGEFFZo4YUYZqjhhhx26OGHIIYo4ogklmjiiSimqOKKLLbo4oswxijjjDTWaOONOOao44489ujjj0AGKeSQRBZp5JFIJqnkkkw26eSTUEYp5ZRUVmnllVhmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145qnnnnz26eefgAYq6KCEFmrooYgmquiijDbq6KOQRirppJRWaumlmGaq6aacdurpp6CGKuqopJZq6qmopqrqqqy26uqrsMb/KuustNZq66245qrrrrz26uuvwAYr7LDEFmvsscgmq+yyzDbr7LPQRivttNRWa+212Gar7bbcduvtt+CGK+645JZr7rnopqvuuuy26+678MYr77z01mvvvfjmq+++/Pbr778AByzwwAQXbPDBCCes8MIMN+zwwxBHLPHEFFds8cUYZ6zxxhx37PHHIIcs8sgkl2zyySinrPLKLLfs8sswxyzzzDTXbPPNOOes88489+zzz0AHLfTQRBdt9NFIJ6300kw37fTTUEct9dRUV2311VhnrfXWXHft9ddghy322GSXbfbZaKet9tpst+3223DHLffcdNdt99145633/933DTwpAIDA4hBHLPHEFFds8UXXzqJBACaY8PLLL+cQQw0+1CDEEEbs0MMML7TQwgkkmGBC6Ci07vrrJpieAussrI7CCScw0TvvPfTQRBA//PBDEUEIH7wQQgQPfPDBB9FDD00ssbz78Mcv//z012///fjnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDnrwgyAMoQhHSMISmvCEKEyhClfIwha68IUwjKEMZ0jDGtrwhjjMoQ53yMMe+vCHQAyiEIdIxCIa8YhITKISl8jEJjrxiVCMohSnSMUqWvGKWMyiFrfIxS568YtgDKMY83jFNVqxjWbER9va+MY2CiSNeMSjHPOYxz/ScY93xCMb42jHQrZRkG5kJB4V+UhEBgQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEADs=';
    
    return `data:image/gif;base64,${placeholderImageBase64}`;
  }
}
