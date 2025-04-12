import { NextRequest, NextResponse } from 'next/server';
import { generateStory, generateImage } from '@/utils/gemini';
import { createEmptyStoryData } from '@/utils/storyModel';
import { saveStoryToFirestore } from '@/utils/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * ストーリー生成APIエンドポイント
 * テーマに基づいてAIでストーリーを生成し、Firestoreに保存します
 */
export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await req.json();
    const { inputType, inputText, options = {}, generateImages = false } = body;

    if (!inputText) {
      return NextResponse.json(
        { error: '入力テキストを指定してください' },
        { status: 400 }
      );
    }

    // セッションからユーザー情報を取得
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    let prompt;
    
    // 入力タイプに基づいてプロンプトを生成
    switch (inputType) {
      case 'theme':
        prompt = inputText; // テーマはそのまま使用
        break;
      case 'article':
        // 記事内容を基にストーリーを生成
        prompt = `次の記事に基づいてストーリーを作成してください: ${inputText}`;
        break;
      case 'custom':
        // カスタムプロンプトはそのまま使用
        prompt = inputText;
        break;
      default:
        prompt = inputText;
    }

    // ストーリーを生成
    const storyData = await generateStory(prompt, options);

    // 画像生成が有効な場合
    if (generateImages && storyData.scenes) {
      // シーン画像を生成（最初の3シーンのみ、リソース節約のため）
      const processScenes = storyData.scenes.slice(0, 3);
      
      await Promise.all(processScenes.map(async (scene) => {
        try {
          // 英語のテキストと背景を使って画像プロンプトを作成
          const characterDescriptions = scene.characters && scene.characters.length > 0
            ? scene.characters.map(c => c.id).join('、')
            : '';
          
          const scenePrompt = `A scene of ${scene.background}. ${characterDescriptions ? `Characters: ${characterDescriptions}. ` : ''}${scene.text_en}`;
          
          const enhancedPrompt = `
            Japanese anime style image for an educational simulation game scene.
            Please make the characters animals.
            No speech bubbles or dialogue text.
            In widescreen format, showing a complete scene with background and characters.
            
            Scene description:
            ${scenePrompt}
            
            Please include the following elements:
            - An integrated image with harmonious background and characters
            - Appropriate expression suitable for educational themes
            - No speech bubbles or dialogue text
            - Natural composition with vibrant colors
          `;
          
          // 画像を生成し、Firebase Storageに保存
          scene.sceneImageUrl = await generateImage(enhancedPrompt);
          scene.useGeneratedImage = true;
        } catch (error) {
          console.error(`Error generating scene image: ${error}`);
          scene.useGeneratedImage = false;
        }
      }));
    }

    // サムネイルを生成（最初のシーンの画像を使用）
    if (generateImages && storyData.scenes && storyData.scenes.length > 0 && storyData.scenes[0].sceneImageUrl) {
      storyData.thumbnailURL = storyData.scenes[0].sceneImageUrl;
    }

    // メタデータを設定
    storyData.metadata = {
      ...storyData.metadata,
      creator: {
        userId,
        username: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: 'private',
      category: options.category || '',
      tags: options.tags || [],
      difficulty: options.difficulty || '通常',
    };

    // Firestoreにストーリーを保存
    let storyId;
    try {
      storyId = await saveStoryToFirestore(userId, storyData);
      console.log(`Story saved to Firestore with ID: ${storyId}`);
    } catch (error) {
      console.error('Firestore保存エラー:', error);
      // エラーが発生しても続行（保存失敗でもストーリーは返す）
    }

    // レスポンスを返す
    return NextResponse.json({
      success: true,
      story: storyData,
      storyId,
    });
  } catch (error: any) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: error.message || 'ストーリー生成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
