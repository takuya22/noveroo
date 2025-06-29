import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { uploadAudioToStorage } from './firebase';
import { Quote } from './storyModel';

const credentials = JSON.parse(
  Buffer.from(process.env.GCP_VERTEX_AI_CREDENTIALS_KEY_BASE64!, 'base64').toString('utf8')
);

// クライアントの初期化
const ttsClient = new TextToSpeechClient({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: credentials,
});

/**
 * テキストを音声に変換
 */
export async function generateSpeech(
  text: Quote[], 
  options: {
    languageCode?: string;
    voiceName?: string;
    gender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
    audioEncoding?: 'MP3' | 'LINEAR16' | 'OGG_OPUS';
    speakingRate?: number;
    pitch?: number;
  } = {}
): Promise<string[]> {
  if (!text || text.length === 0) {
    throw new Error('テキストが提供されていません');
  }

  try {
    const result: string[] = [];
    for (const quote of text) {
      if (!quote.text || quote.text.trim() === '') {
        throw new Error('テキストが空です');
      }

      const inputText = quote.text || '';
      const {
        languageCode = 'ja-JP',
        audioEncoding = 'MP3',
        speakingRate = 1.0,
        pitch = 0.0
      } = options;

      const voiceOptions = getVoiceForCharacter(quote.speaker_type);

      const request = {
          input: { text: inputText },
          voice: {
            languageCode,
            name: voiceOptions.voiceName,
          },
          audioConfig: {
            audioEncoding,
            speakingRate: voiceOptions.speakingRate || speakingRate,
            pitch: voiceOptions.pitch || pitch,
          },
        };

        const [response] = await ttsClient.synthesizeSpeech(request);
        
        if (!response.audioContent) {
          throw new Error('音声データが生成されませんでした');
        }
        
        // セリフの短縮版を作成 (ファイル名用)
        const shortPrompt = inputText.length > 30 ? inputText.substring(0, 30) + "..." : inputText;

        // Firebase Storageにアップロード
        const audioUrl = await uploadAudioToStorage(response.audioContent, 'speech', shortPrompt);

        result.push(audioUrl);
      }
    return result;
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw error;
  }
}

interface VoiceOptions {
  voiceName?: string;
  speakingRate?: number;
  pitch?: number;
}

// キャラクターごとに異なる音声設定
const getVoiceForCharacter = (speaker_type: string | undefined) => {
  if (!speaker_type) {
    return {
      voiceName: 'ja-JP-Neural2-C',
      speakingRate: 1.2,
      pitch: 0,
    };
  }
  const voiceMap: Record<string, VoiceOptions> = {
    'NARRATOR': {
      voiceName: 'ja-JP-Neural2-C',
      speakingRate: 1.2,
      pitch: 0,
    },
    'FEMALE': {
      voiceName: 'ja-JP-Neural-B',
      speakingRate: 1.0,
      pitch: 2
    },
    'MALE': {
      voiceName: 'ja-JP-Neural2-D',
      speakingRate: 1.0,
      pitch: -1
    },
  };

  return voiceMap[speaker_type] || voiceMap['ナレーション'];
};

