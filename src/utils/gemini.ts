/**
 * Google Gemini APIとの連携コード + Stability AI APIによる画像生成
 */
import { Story, Options, Scene, LearningPoint } from './storyModel';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";
import { exec } from 'child_process';
import util from 'util';
import { uploadImageToStorage } from './firebase';
import fetch from 'node-fetch';

// 環境変数のチェック
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY環境変数が設定されていません。');
}

if (!process.env.STABILITY_API_KEY) {
  console.warn('STABILITY_API_KEY環境変数が設定されていません。');
}

// Gemini APIの初期化
const genAI = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GEMINI_API_KEY,
});

// Stability AI APIの設定
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_ENDPOINT = 'https://api.stability.ai/v1/generation';

/**
 * Gemini APIを使ってストーリーを生成する
 * @param theme ユーザーが入力したテーマ
 * @param options 生成オプション
 * @param quizMode クイズモードかどうか
 * @returns 生成されたストーリーデータ
 */
export async function generateStory(theme: string, options: Options = {}, quizMode: boolean = true): Promise<Story | void> {
  // オプションのデフォルト値設定
  const { difficulty = '通常', length = '中' } = options;
  
  // プロンプト作成（クイズモードか通常モードかで分岐）
  let prompt;
  
  if (quizMode) {
    // クイズモード用のプロンプト
    prompt = `
テーマ「${theme}」に基づいて学習用のシミュレーションゲームを作成してください。
難易度: ${difficulty}
長さ: ${length}

以下の要素を必ず含めてください:
1. タイトル
2. 説明文（ゲームの概要と学習目標）
3. ストーリー展開
4. 各シーンには問題（クイズ）を含め、選択肢から正解を選ぶ形式にする
5. 各問題には正解の選択肢と、1〜3つの不正解の選択肢を含める
6. 各問題に関する解説を含める
7. ストーリーは一本道で、選択肢によって分岐しない

以下のJSONフォーマットで出力してください（途中で切れないように）:
{
  "title": "ゲームタイトル",
  "description": "ゲームの説明と学習目標",
  "initialScene": "scene1",
  "isQuizMode": true,
  "scenes": [
    {
      "id": "scene1",
      "type": "scene",
      "background": "シーンに合わせて背景のプロンプトを英語で一言で記述",
      "characters": [
        {"id": "キャラクターを英語で簡潔に記述。名前もあり。", "position": {"x": 50, "y": 20}}
      ],
      "text": "シーンのテキスト内容（日本語）（シーンの説明とキャラクターのセリフを含む、ナレーションや対話形式で、ナレーションなら（ナレーション）、キャラクターなら（キャラクター名）を先頭につける）",
      "text_en": "シーンのテキスト内容（英語）",
      "quiz": {
        "question": "このシーンに関連する問題文",
        "options": [
          {
            "text": "選択肢1のテキスト",
            "isCorrect": true,
            "explanation": "この選択肢が正解である理由または追加説明"
          },
          {
            "text": "選択肢2のテキスト",
            "isCorrect": false,
            "explanation": "この選択肢が不正解である理由"
          },
          {
            "text": "選択肢3のテキスト",
            "isCorrect": false,
            "explanation": "この選択肢が不正解である理由"
          }
        ],
        "explanation": "問題全体に関する詳しい解説"
      },
      "nextScene": "scene2"
    }
  ]
}
`;
  } else {
    // 通常モード（分岐ストーリー）用のプロンプト
    prompt = `
テーマ「${theme}」に基づいて対話型のシミュレーションゲームを作成してください。
難易度: ${difficulty}
長さ: ${length}

以下の要素を必ず含めてください:
1. タイトル
2. 説明文（プレイヤー特定の役割を持ち、目標を達成するためのゲームの概要）
3. ストーリー展開（少なくとも5つ、多くとも10つのシーン）
4. 各ストーリー展開の最後以外、各シーンに必ず選択肢（2〜3つ）を含め、プレイヤーの選択によってストーリーが変化する
5. 教育的内容を含む結末

以下のJSONフォーマットで出力してください（途中で切れないように）:
{
  "title": "ゲームタイトル",
  "description": "ゲームの説明",
  "initialScene": "start",
  "isQuizMode": false,
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
}`;
  }


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
          const learningPoint = supplyData.learningPoints.find((point: LearningPoint) => point.sceneId === scene.id);
          if (learningPoint) {
            scene.learningPoint = learningPoint;
          }
        }
      }

      // 全シーンを統合したゲームデータを作成
      const mergedStoryData = {
        ...baseStoryData,
        scenes: allScenes
      } as Story
      return mergedStoryData;
    } catch (e: unknown) {
      console.warn('学習ポイントの追加に失敗しました:', (e as Error).message);
      // 失敗しても続行
    }
  } catch (error: unknown) {
    console.error('Error generating story:', error);
    throw new Error(`ストーリーの生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

/**
 * Stability AI APIを使用して画像を生成する
 * @param prompt 画像生成のプロンプト
 * @returns 生成された画像のURL
 */
export async function generateImage(prompt: string): Promise<string> {
  try {
    console.log("Generating image with Stability AI using prompt:", prompt);
    
    // ログ保存ディレクトリを作成（デバッグ用）
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // 使用するモデルとエンドポイントを設定
    const modelId = 'stable-diffusion-xl-1024-v1-0'; // SDXL 1.0 モデル
    const apiEndpoint = `${STABILITY_API_ENDPOINT}/${modelId}/text-to-image`;
    
    // リクエストデータを作成
    const requestData = {
      text_prompts: [
        {
          text: prompt,
          weight: 1.0
        }
      ],
      cfg_scale: 7, // プロンプトの厳密さ（デフォルト: 7）
      height: 1024, // 画像の高さ（SDXL 1.0 用）
      width: 1024,  // 画像の幅（SDXL 1.0 用）
      samples: 1,   // 生成する画像数
      steps: 30     // 生成ステップ数（標準的な値: 30）
    };

    console.log("Sending request to Stability AI API...");
    
    // API リクエストを送信
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`
      },
      body: JSON.stringify(requestData)
    });

    // レスポンスをJSONとして解析
    const responseData = await response.json();
    
    // デバッグ用にレスポンスをログに保存
    const timestamp = Date.now();
    const logFilePath = path.join(logDir, `stability-response-${timestamp}.json`);
    fs.writeFileSync(logFilePath, JSON.stringify(responseData, null, 2));
    
    // レスポンスが正常でない場合はエラーを投げる
    if (!response.ok) {
      console.error("API Error:", responseData);
      throw new Error(`Stability AI API エラー: ${responseData.message || '不明なエラー'}`);
    }

    // 画像データの取得（Base64形式）
    if (!responseData.artifacts || !Array.isArray(responseData.artifacts) || responseData.artifacts.length === 0) {
      throw new Error('レスポンスに有効な画像データが含まれていません');
    }

    // 最初の画像を使用
    const image = responseData.artifacts[0];
    const base64Image = image.base64;
    
    if (!base64Image) {
      throw new Error('生成された画像のBase64データが見つかりません');
    }
    
    console.log("Successfully generated image with Stability AI");
    
    // プロンプトの短縮版を作成 (ファイル名用)
    const shortPrompt = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    
    // Firebase Storageに画像をアップロード
    const imageUrl = await uploadImageToStorage(base64Image, 'generated', shortPrompt);
    console.log("Image uploaded to storage:", imageUrl);
    
    return imageUrl;
  } catch (error: unknown) {
    console.error('Error generating image with Stability AI:', error instanceof Error ? error.message : '不明なエラー');
    
    // エラーが発生した場合はプレースホルダー画像のBase64を返す
    const placeholderImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAMAAAD8CC+4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1zbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1zbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1zbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1zbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5NkU4OENBRTk3NDExRUJBMEI1OEQ0QkRBQjk2QjlEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5NkU4OENCRTk3NDExRUJBMEI1OEQ0QkRBQjk2QjlEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTk2RTg4QzhFOTc0MTFFQkEwQjU4RDRCREFCOTZCOUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTk2RTg4QzlFOTc0MTFFQkEwQjU4RDRCREFCOTZCOUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQAAAAAACwAAAAAyADIAAAI/wD/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKnTp1CjSp1KtarVq1izat3KtavXr2DDih1LtqzZs2jTql3Ltq3bt3Djyp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/Ovbv37+DDi/8fT768+fPo06tfz769+/fw48ufT7++/fv48+vfz7+///8ABijggAQWaOCBCCao4IIMNujggxBGKOGEFFZo4YUYZqjhhhx26OGHIIYo4ogklmjiiSimqOKKLLbo4oswxijjjDTWaOONOOao44489ujjj0AGKeSQRBZp5JFIJqnkkkw26eSTUEYp5ZRUVmnllVhmqeWWXHbp5ZdghinmmGSWaeaZaKap5ppstunmm3DGKeecdNZp55145qnnnnz26eefgAYq6KCEFmrooYgmquiijDbq6KOQRirppJRWaumlmGaq6aacdurpp6CGKuqopJZq6qmopqrqqqy26uqrsMb/KuustNZq66245qrrrrz26uuvwAYr7LDEFmvsscgmq+yyzDbr7LPQRivttNRWa+212Gar7bbcduvtt+CGK+645JZr7rnopqvuuuy26+678MYr77z01mvvvfjmq+++/Pbr778AByzwwAQXbPDBCCes8MIMN+zwwxBHLPHEFFds8cUYZ6zxxhx37PHHIIcs8sgkl2zyySinrPLKLLfs8sswxyzzzDTXbPPNOOes88489+zzz0AHLfTQRBdt9NFIJ6300kw37fTTUEct9dRUV2311VhnrfXWXHft9ddghy322GSXbfbZaKet9tpst+3223DHLffcdNdt99145633/933DTwpAIDA4hBHLPHEFFds8UXXzqJBACaY8PLLL+cQQw0+1CDEEEbs0MMML7TQwgkkmGBC6Ci07vrrJpieAussrI7CCScw0TvvPfTQRBA//PBDEUEIH7wQQgQPfPDBB9FDD00ssbz78Mcv//z012///fjnr//+/Pfv//8ADKAAB0jAAhrwgAhMoAIXyMAGOvCBEIygBCdIwQpa8IIYzKAGN8jBDnrwgyAMoQhHSMISmvCEKEyhClfIwha68IUwjKEMZ0jDGtrwhjjMoQ53yMMe+vCHQAyiEIdIxCIa8YhITKISl8jEJjrxiVCMohSnSMUqWvGKWMyiFrfIxS568YtgDKMY83jFNVqxjWbER9va+MY2CiSNeMSjHPOYxz/ScY93xCMb42jHQrZRkG5kJB4V+UhEBgQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEACH5BAAAAAAAAAAh+QQAAAAAACwAAAAAAQABAAAIBAABBAQAIfkEAAAAAAAsAAAAAAEAAQAACAQAAQQEADs=';
    
    return `data:image/gif;base64,${placeholderImageBase64}`;
  }
}
