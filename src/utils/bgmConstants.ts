/**
 * BGMの種類を定義する定数ファイル
 * 
 * 各BGMは以下の情報を持ちます：
 * - id: 一意の識別子
 * - name: ユーザーに表示するBGM名
 * - url: 実際のBGMファイルへのURL
 * - category: BGMのカテゴリ（雰囲気や用途）
 * - description: 簡単な説明（どのようなシーンに合うかなど）
 */

export interface BgmDefinition {
  id: string;
  name: string;
  url: string;
  category: 'peaceful' | 'dramatic' | 'action' | 'mysterious' | 'happy' | 'sad' | 'tense';
  description: string;
}

// BGMのカテゴリーごとの日本語名
export const BGM_CATEGORY_NAMES = {
  'peaceful': '穏やか',
  'dramatic': 'ドラマチック',
  'action': 'アクション',
  'mysterious': '神秘的',
  'happy': '明るい',
  'sad': '悲しい',
  'tense': '緊迫'
};

/**
 * 利用可能なBGM一覧
 * 
 * 注: URLは実際の音楽ファイルへのパスに置き換える必要があります
 * 全てのBGMは魔王魂 (https://maoudamashii.jokersounds.com/) から提供されています
 */
export const AVAILABLE_BGMS: BgmDefinition[] = [
  // 穏やかなBGM
  {
    id: 'peaceful_1',
    name: '平和な日常',
    url: '/bgm/maoudamashii_healing01.mp3',
    category: 'peaceful',
    description: '日常の穏やかなシーンに最適なBGM'
  },
  {
    id: 'peaceful_2',
    name: '朝の光',
    url: '/bgm/maoudamashii_healing02.mp3',
    category: 'peaceful',
    description: '朝の光が差し込むような明るく穏やかなBGM'
  },
  {
    id: 'peaceful_3',
    name: '優しい風',
    url: '/bgm/maoudamashii_healing03.mp3',
    category: 'peaceful',
    description: '優しい風が吹くような穏やかなメロディのBGM'
  },
  
  // ドラマチックなBGM
  {
    id: 'dramatic_1',
    name: '感動の瞬間',
    url: '/bgm/maoudamashii_orchestra01.mp3',
    category: 'dramatic',
    description: '感動的なシーンや重要な展開に合うBGM'
  },
  {
    id: 'dramatic_2',
    name: '壮大な物語',
    url: '/bgm/maoudamashii_orchestra02.mp3',
    category: 'dramatic',
    description: '壮大な物語の展開に合うオーケストラBGM'
  },
  {
    id: 'dramatic_3',
    name: '運命の交差点',
    url: '/bgm/maoudamashii_orchestra03.mp3',
    category: 'dramatic',
    description: '運命の分かれ道や重要な決断シーンに合うBGM'
  },
  
  // アクションBGM
  {
    id: 'action_1',
    name: '冒険の始まり',
    url: '/bgm/maoudamashii_battle01.mp3',
    category: 'action',
    description: '冒険が始まるようなワクワク感のあるBGM'
  },
  {
    id: 'action_2',
    name: '激しい戦い',
    url: '/bgm/maoudamashii_battle02.mp3',
    category: 'action',
    description: '激しい戦闘シーンに合うエネルギッシュなBGM'
  },
  {
    id: 'action_3',
    name: '迫りくる危機',
    url: '/bgm/maoudamashii_battle03.mp3',
    category: 'action',
    description: '危機が迫るような緊張感のあるBGM'
  },
  
  // 神秘的なBGM
  {
    id: 'mysterious_1',
    name: '未知の世界',
    url: '/bgm/maoudamashii_ambient01.mp3',
    category: 'mysterious',
    description: '未知の世界を探索するような神秘的なBGM'
  },
  {
    id: 'mysterious_2',
    name: '古代の秘密',
    url: '/bgm/maoudamashii_ambient02.mp3',
    category: 'mysterious',
    description: '古代の遺跡や秘密を探るようなBGM'
  },
  {
    id: 'mysterious_3',
    name: '宇宙の神秘',
    url: '/bgm/maoudamashii_ambient03.mp3',
    category: 'mysterious',
    description: '宇宙や異世界の神秘的な雰囲気のBGM'
  },
  
  // 明るいBGM
  {
    id: 'happy_1',
    name: '陽気な日々',
    url: '/bgm/maoudamashii_happy01.mp3',
    category: 'happy',
    description: '明るく陽気なシーンに合うポップなBGM'
  },
  {
    id: 'happy_2',
    name: 'お祭り気分',
    url: '/bgm/maoudamashii_happy02.mp3',
    category: 'happy',
    description: 'お祭りや楽しいイベントシーンに合うBGM'
  },
  {
    id: 'happy_3',
    name: '明るい未来',
    url: '/bgm/maoudamashii_happy03.mp3',
    category: 'happy',
    description: '希望に満ちた明るい未来を描くシーンに合うBGM'
  },
  
  // 悲しいBGM
  {
    id: 'sad_1',
    name: '別れの時',
    url: '/bgm/maoudamashii_sad01.mp3',
    category: 'sad',
    description: '別れや悲しい場面に合う感傷的なBGM'
  },
  {
    id: 'sad_2',
    name: '哀愁の雨',
    url: '/bgm/maoudamashii_sad02.mp3',
    category: 'sad',
    description: '雨の日のような物悲しい雰囲気のBGM'
  },
  {
    id: 'sad_3',
    name: '心の傷',
    url: '/bgm/maoudamashii_sad03.mp3',
    category: 'sad',
    description: '心の痛みや悲しみを表現するBGM'
  },
  
  // 緊迫したBGM
  {
    id: 'tense_1',
    name: '緊迫した状況',
    url: '/bgm/maoudamashii_tense01.mp3',
    category: 'tense',
    description: '緊迫した状況や重要な局面に合うBGM'
  },
  {
    id: 'tense_2',
    name: '追跡',
    url: '/bgm/maoudamashii_tense02.mp3',
    category: 'tense',
    description: '追いかけられるシーンなど緊張感のあるBGM'
  },
  {
    id: 'tense_3',
    name: '陰謀',
    url: '/bgm/maoudamashii_tense03.mp3',
    category: 'tense',
    description: '陰謀や謎が渦巻くシーンに合う不気味なBGM'
  }
];

/**
 * 指定されたカテゴリのBGMのみを取得する
 */
export function getBgmsByCategory(category: string): BgmDefinition[] {
  return AVAILABLE_BGMS.filter(bgm => bgm.category === category);
}

/**
 * BGMのIDからBGM情報を取得する
 */
export function getBgmById(id: string): BgmDefinition | undefined {
  return AVAILABLE_BGMS.find(bgm => bgm.id === id);
}

/**
 * BGMのURLからBGM情報を取得する
 */
export function getBgmByUrl(url: string): BgmDefinition | undefined {
  return AVAILABLE_BGMS.find(bgm => bgm.url === url);
}