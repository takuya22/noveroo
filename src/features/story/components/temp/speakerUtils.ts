// テキスト内の話者情報と対応するテキストを解析する関数
const parseTextWithSpeakers = (text: string) => {
  // 複数の話者パターンを抽出するための正規表現
  const speakerSegmentPattern = /(\([^)]+\))([^(]*)/g;
  
  // 結果を格納する配列
  const segments: Array<{speaker: string, text: string}> = [];
  let match;
  
  // すべての話者セグメントを抽出
  while ((match = speakerSegmentPattern.exec(text)) !== null) {
    const speakerWithBrackets = match[1]; // (話者名)
    const speaker = speakerWithBrackets.substring(1, speakerWithBrackets.length - 1); // 括弧を取り除く
    const segmentText = match[2].trim(); // 対応するテキスト
    
    if (segmentText) {
      segments.push({ speaker, text: segmentText });
    }
  }
  
  // 話者が見つからなかった場合は、テキスト全体を無名のセグメントとして追加
  if (segments.length === 0 && text.trim()) {
    segments.push({ speaker: '', text: text.trim() });
  }
  
  return segments;
};

// 現在表示されているテキストの位置に基づいて、話者を取得する関数
const getCurrentSpeaker = (fullText: string, displayedText: string) => {
  // テキスト内のすべての話者セグメントを解析
  const segments = parseTextWithSpeakers(fullText);
  
  // 表示されているテキストの長さ
  const currentLength = displayedText.length;
  
  // 表示されているテキストの範囲に基づいて、現在の話者を特定
  let accumulatedLength = 0;
  let currentSpeaker = '';
  
  for (const segment of segments) {
    // 各セグメントの表示用テキスト（話者名なし）の長さ
    const segmentTextLength = segment.text.length;
    
    // セグメントの開始位置が現在の表示位置より前で、
    // 終了位置が現在の表示位置以降の場合、このセグメントが現在表示されている
    if (accumulatedLength <= currentLength && 
        accumulatedLength + segmentTextLength >= currentLength) {
      currentSpeaker = segment.speaker;
      break;
    }
    
    accumulatedLength += segmentTextLength;
  }
  
  return currentSpeaker;
};

// テキストを分割してレンダリングする
const renderSegmentedText = (fullText: string, displayedText: string) => {
  // テキスト内のすべての話者セグメントを解析
  const segments = parseTextWithSpeakers(fullText);
  
  if (segments.length <= 1) {
    // 話者が1人または話者がない場合は単純に表示
    return displayedText;
  }
  
  // 複数の話者がいる場合、それぞれのセグメントを別々のスタイルでレンダリング
  let result = [];
  let processedLength = 0;
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const segmentLength = segment.text.length;
    
    // まだ表示されていないセグメントはスキップ
    if (processedLength + segmentLength <= displayedText.length) {
      // セグメント全体が表示されている場合
      result.push(
        <span key={i} className={`segment ${segment.speaker.toLowerCase()}`}>
          {segment.text}
        </span>
      );
    } else if (processedLength < displayedText.length) {
      // セグメントの一部が表示されている場合
      const visiblePart = segment.text.substring(0, displayedText.length - processedLength);
      
      result.push(
        <span key={i} className={`segment ${segment.speaker.toLowerCase()}`}>
          {visiblePart}
        </span>
      );
      
      // それ以降のセグメントは表示されていないので、ループを終了
      break;
    } else {
      // まだ表示されていないセグメントはスキップ
      break;
    }
    
    processedLength += segmentLength;
  }
  
  return result;
};
