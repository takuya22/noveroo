"use client";

import { useState, useEffect, useRef, ReactNode } from 'react';
import { Story, Scene, Choice, isSceneBgmCategory } from '@/utils/storyModel';

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

interface StoryPlayerProps {
  story: Story;
  onClose?: () => void;
  standalone?: boolean; // スタンドアロンモードかどうか
  onComplete?: (results: unknown) => void; // 完了時のコールバック
  language?: 'ja' | 'en'; // 言語設定
}

export default function StoryPlayer({ 
  story, 
  onClose, 
  standalone = true,
  onComplete,
  language = 'ja'
}: StoryPlayerProps) {
  // 現在のシーンを管理
  const [currentSceneId, setCurrentSceneId] = useState<string>(story.initialScene);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  
  // テキスト表示アニメーションの状態
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [textComplete, setTextComplete] = useState<boolean>(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  
  // テキストセグメント（話者ごとに分割されたテキスト）
  const [textSegments, setTextSegments] = useState<Array<{speaker: string, text: string}>>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState<number>(0);
  
  // 選択肢の表示状態
  const [showChoices, setShowChoices] = useState<boolean>(false);
  
  // クイズモード関連の状態
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<{
    correct: boolean;
    explanation: string;
  } | null>(null);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  
  // アニメーション速度（ミリ秒/文字）
  const [typingSpeed, setTypingSpeed] = useState<number>(30);
  
  // 学習ポイントの表示状態
  const [showLearningPoint, setShowLearningPoint] = useState<boolean>(false);
  
  // UI関連の状態
  const [showControls, ] = useState<boolean>(true); // コントロール表示状態
  const [showSettings, setShowSettings] = useState<boolean>(false); // 設定パネル表示状態
  const [textSize, setTextSize] = useState<string>('medium'); // テキストサイズ
  const [musicOn, setMusicOn] = useState<boolean>(false); // BGM
  const [sfxOn, setSfxOn] = useState<boolean>(true); // 効果音
  const [speechOn, setSpeechOn] = useState<boolean>(true); // 音声ナレーション
  const [nightMode, setNightMode] = useState<boolean>(false); // ナイトモード
  const [showUI, setShowUI] = useState<boolean>(true); // UI表示状態
  
  // 音声・BGM再生用の参照
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  
  // シーン切り替えエフェクト
  const [transition, setTransition] = useState<boolean>(false);
  
  // 履歴管理
  const [history, setHistory] = useState<Array<{sceneId: string, choice?: string}>>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // プレイデータ（進捗や選択を記録）
  const [playData, setPlayData] = useState<{
    startTime: number;
    endTime?: number;
    choices: Array<{sceneId: string, choiceText: string, timestamp: number}>;
    completedScenes: string[];
  }>({
    startTime: Date.now(),
    choices: [],
    completedScenes: []
  });
  
  // 自動モード
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const autoModeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // シーンマップの作成（検索を効率化）
  const scenesMap = useRef<Record<string, Scene>>({});

  // UI表示/非表示の切り替え (F11キーのような全画面表示)
  const toggleUI = () => {
    setShowUI(!showUI);
  };
  
  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // スペースキーで次へ進む/テキストスキップ
      if (e.code === 'Space') {
        e.preventDefault();
        if (isTyping) {
          skipTextAnimation();
        } else if (textComplete && (!activeScene?.choices || activeScene.choices.length === 0)) {
          handleContinue();
        }
      }
      
      // Aキーで自動モード切り替え
      if (e.code === 'KeyA') {
        toggleAutoMode();
      }
      
      // Hキーで履歴表示切り替え
      if (e.code === 'KeyH') {
        setShowHistory(!showHistory);
      }
      
      // Sキーで設定表示切り替え
      if (e.code === 'KeyS') {
        setShowSettings(!showSettings);
      }
      
      // Fキーでフルスクリーン切り替え
      if (e.code === 'KeyF') {
        toggleUI();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTyping, textComplete, activeScene, showHistory, showSettings]);
  
  // シーンが初期化されたときに、テキストセグメントを解析
  useEffect(() => {
    // シーンマップを構築
    const map: Record<string, Scene> = {};
    story.scenes.forEach(scene => {
      map[scene.id] = scene;
    });
    scenesMap.current = map;
    
    // 初期シーンをセット
    setActiveScene(map[story.initialScene]);
    setHistory([{ sceneId: story.initialScene }]);
    
    // プレイデータ初期化
    setPlayData({
      startTime: Date.now(),
      choices: [],
      completedScenes: [story.initialScene]
    });
    
    // クリーンアップ
    return () => {
      if (autoModeTimeoutRef.current) {
        clearTimeout(autoModeTimeoutRef.current);
      }
      
      // BGMと音声を停止
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [story]);
  
  // シーンが変わったときの処理
  useEffect(() => {
    if (!currentSceneId || !scenesMap.current[currentSceneId]) return;
    
    const scene = scenesMap.current[currentSceneId];
    
    // テキストセグメントを解析
    const text = language === 'ja' ? scene.text : (scene.textEn || scene.text);
    const fullText = text.map(quote => {
      const speaker = quote.speaker ? `(${quote.speaker}) ` : '';
      return speaker + quote.text;
    }).join('\n');
    const segments = parseTextWithSpeakers(fullText);
    
    // トランジションエフェクト
    setTransition(true);
    setTimeout(() => {
      setActiveScene(scene);
      setTextComplete(false);
      setShowChoices(false);
      setDisplayedText('');
      setIsTyping(true);
      setTransition(false);
      setTextSegments(segments);
      setCurrentSegmentIndex(0);
      
      // 最初の話者をセット（存在する場合）
      if (segments.length > 0) {
        setCurrentSpeaker(segments[0].speaker);
      } else {
        setCurrentSpeaker('');
      }

      // テキストアニメーション開始
      // let timeout: NodeJS.Timeout;
      const startTextAnimation = () => {
        // 全テキストを連結
        const fullText = segments.map(segment => segment.text).join('');
        let i = 0;
        
        const typeText = () => {
          if (i < fullText.length) {
            const currentText = fullText.substring(0, i + 1);
            setDisplayedText(currentText);
            i++;
            
            // 現在の話者を更新
            updateCurrentSpeaker(i, segments);
            
            // タイプ効果音 (効果音がオンの場合)
            if (sfxOn && i % 5 === 0) {
              playTypingSfx();
            }
            setTimeout(typeText, typingSpeed);
          } else {
            setIsTyping(false);
            setTextComplete(true);
            setShowChoices(true);
            
            // 自動モードの場合、選択肢がなければ自動的に次へ
            if (autoMode && (!scene.choices || scene.choices.length === 0)) {
              autoModeTimeoutRef.current = setTimeout(() => {
                handleContinue();
              }, 2000);
            }
          }
        };
        
        typeText();
      };
      
      // 音声ナレーションの再生
      if (scene.sceneSpeechUrls && scene.sceneSpeechUrls.length > 0 && speechOn) {
        playSceneSpeech(scene);
      }
      
      // BGMの再生
      if (scene.sceneBgmType && musicOn) {
        playSceneBgm(scene);
      }
      
      startTextAnimation();
    }, 500); // トランジション時間
    
    // クリーンアップ
    return () => {
      // 音声が再生中の場合は停止
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // BGMは停止しない（シーン間で継続させる）
      // シーンが変わる場合は新しいBGMに切り替わる
      
      // let timeout: NodeJS.Timeout;
      // clearTimeout(timeout);
    };
  }, [currentSceneId, language, autoMode, typingSpeed, sfxOn]);
  
  // 現在の話者を更新
  const updateCurrentSpeaker = (position: number, segments: Array<{speaker: string, text: string}>) => {
    let accumulatedLength = 0;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (accumulatedLength <= position && accumulatedLength + segment.text.length > position) {
        setCurrentSpeaker(segment.speaker);
        setCurrentSegmentIndex(i);
        return;
      }
      accumulatedLength += segment.text.length;
    }
  };
  
  // タイピング効果音を再生する関数
  const playTypingSfx = () => {
    // 実際の効果音処理はここに実装
    // この例では処理だけを入れておく
  };
  
  // テキストを一気に表示する
  const skipTextAnimation = () => {
    if (!activeScene) return;
    
    const text = language === 'ja' ? activeScene.text : (activeScene.textEn || activeScene.text);
    const fullText = text.map(quote => {
      const speaker = quote.speaker ? `(${quote.speaker}) ` : '';
      return speaker + quote.text;
    }).join('\n');
    const segments = parseTextWithSpeakers(fullText);
    const allText = segments.map(segment => segment.text).join('');
    
    // 最後のセグメントを表示
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      setCurrentSpeaker(lastSegment.speaker);
      setCurrentSegmentIndex(segments.length - 1);
    }
    
    // 音声が再生中の場合は一時停止
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    setDisplayedText(allText);
    setIsTyping(false);
    setTextComplete(true);
    setShowChoices(true);
  };
  
  // クイズの選択肢をクリックしたときの処理
  const handleQuizOptionClick = (index: number, isCorrect: boolean, explanation: string) => {
    if (quizSubmitted) return; // 既に回答済みなら何もしない
    
    // 効果音再生（オプション）
    if (sfxOn) {
      // 選択肢クリック効果音を再生（実装済みなら使用）
    }
    
    setSelectedOptionIndex(index);
    setQuizSubmitted(true);
    setTotalQuestions(prev => prev + 1);
    
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
    }
    
    setQuizResult({
      correct: isCorrect,
      explanation: explanation
    });
  };
  
  // 選択肢をクリックしたときの処理（従来の分岐タイプ用）
  const handleChoiceClick = (choice: Choice) => {
    if (!activeScene) return;
    
    // 選択効果音 (効果音がオンの場合)
    if (sfxOn) {
      // 選択肢クリック効果音を再生
    }
    
    // 選択を記録
    setPlayData(prev => ({
      ...prev,
      choices: [
        ...prev.choices, 
        {
          sceneId: activeScene.id,
          choiceText: choice.text,
          timestamp: Date.now()
        }
      ],
      completedScenes: [...prev.completedScenes, choice.nextScene]
    }));
    
    // 履歴に追加
    setHistory(prev => [...prev, { sceneId: choice.nextScene, choice: choice.text }]);
    
    // 次のシーンへ
    setCurrentSceneId(choice.nextScene);
  };
  
  // 次のシーンへ進む処理
  const handleContinue = () => {
    if (!activeScene) return;
    
    // クイズモードで、クイズ回答後の場合、次のシーンへ進む
    if (story.isQuizMode && activeScene.nextScene && quizSubmitted) {
      // クイズの状態をリセット
      setQuizSubmitted(false);
      setSelectedOptionIndex(null);
      setQuizResult(null);
      
      // 履歴に追加
      setHistory(prev => [...prev, { sceneId: activeScene.nextScene || '', choice: '次へ' }]);
      
      // 次のシーンへ
      setCurrentSceneId(activeScene.nextScene);
      return;
    }
    
    // 通常モードで、選択肢がない場合（ストーリー終了）
    if (!story.isQuizMode && (!activeScene.choices || activeScene.choices.length === 0)) {
      // ストーリー終了処理
      setPlayData(prev => ({
        ...prev,
        endTime: Date.now(),
        ...(story.isQuizMode && { correctAnswers: totalCorrect, totalQuestions: totalQuestions })
      }));
      
      if (onComplete) {
        onComplete(playData);
      }
      
      if (onClose) {
        onClose();
      }
      return;
    }
    
    // 通常モードで、選択肢が1つだけの場合、自動的に次へ進む
    if (!story.isQuizMode && activeScene.choices && activeScene.choices.length === 1) {
      handleChoiceClick(activeScene.choices[0]);
    }
  };
  
  // 自動モードの切り替え
  const toggleAutoMode = () => {
    setAutoMode(prev => !prev);
  };
  
  // テキスト表示速度の変更
  const changeTypingSpeed = (speed: number) => {
    setTypingSpeed(speed);
  };
  
  // テキストサイズの変更
  const changeTextSize = (size: string) => {
    setTextSize(size);
  };
  
  // BGMの切り替え
  const toggleMusic = () => {
    setMusicOn(prev => {
      const newState = !prev;
      console.log("BGM切り替え:", newState ? "オン" : "オフ");
      if (newState) {
        console.log("BGMをオンにしました");
        console.log("現在のシーン:", activeScene);
        console.log("シーンのBGMタイプ:", activeScene?.sceneBgmType);
        // BGMをオンにした場合、現在のシーンのBGMを再生
        if (activeScene && activeScene.sceneBgmType) {
          playSceneBgm(activeScene);
        }
      } else {
        // BGMをオフにした場合、再生中のBGMを停止
        if (bgmRef.current) {
          bgmRef.current.pause();
        }
      }
      return newState;
    });
  };
  
  // 効果音の切り替え
  const toggleSfx = () => {
    setSfxOn(prev => !prev);
  };
  
  // ナイトモードの切り替え
  const toggleNightMode = () => {
    setNightMode(prev => !prev);
  };
  
  // 音声ナレーションの切り替え
  const toggleSpeech = () => {
    setSpeechOn(prev => !prev);
    // 音声ナレーションがオフになった場合は音声を停止
    if (speechOn && audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  // 現在再生中の音声ファイルのインデックス
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number>(0);
  
  // 現在のシーンオブジェクトをref で管理
  const currentSceneRef = useRef<Scene | null>(null);
  
  // シーンのBGMを再生する関数
  const playSceneBgm = (scene: Scene) => {
    console.log("playSceneBgm called with scene");
    console.log("isSceneBgmCategory:", isSceneBgmCategory(scene.sceneBgmType));
    console.log("scene.sceneBgmType:", !scene.sceneBgmType);
    console.log("musicOn:", musicOn);
    if (!scene.sceneBgmType || !isSceneBgmCategory(scene.sceneBgmType)) {
      return;
    }
    console.log("BGM再生開始:", scene.sceneBgmType);
    
    try {
      // BGM用のAudio要素がなければ作成
      if (!bgmRef.current) {
        bgmRef.current = new Audio();
        // BGMをループ再生に設定
        bgmRef.current.loop = true;
      }
      
      // 現在のBGMと同じ場合は何もしない（すでに再生中のため）
      if (bgmRef.current.src === scene.sceneBgmType && !bgmRef.current.paused) {
        return;
      }
      
      // 新しいBGMの設定
      const sceneBgmUrl = "https://firebasestorage.googleapis.com/v0/b/storylearning-648a6.firebasestorage.app/o/bgms%2F" + scene.sceneBgmType + ".mp3?alt=media";
      bgmRef.current.src = sceneBgmUrl;
      console.log("BGM URL:", bgmRef.current.src);
      bgmRef.current.volume = 0.2; // BGMのボリュームは少し小さめに
      bgmRef.current.load();
      
      // オーディオの読み込みエラー処理
      bgmRef.current.onerror = (error) => {
        console.error("BGMファイル読み込みエラー:", error);
        // 音楽をオフにして、エラー表示のかわりに静かにする
        setMusicOn(false);
      };
      
      // BGMの再生
      bgmRef.current.play().catch(err => {
        console.error("BGM再生エラー:", err);
        // 音楽をオフにして、エラー表示のかわりに静かにする
        setMusicOn(false);
      });
    } catch (error) {
      console.error("BGM再生設定エラー:", error);
      // 音楽をオフにして、エラー表示のかわりに静かにする
      setMusicOn(false);
    }
  };
  
  // シーンの音声を再生する
  const playSceneSpeech = (scene: Scene) => {
    console.log("音声再生開始:", scene?.sceneSpeechUrls);
    if (!speechOn || !scene || !scene.sceneSpeechUrls || scene.sceneSpeechUrls.length === 0) {
      return;
    }
    
    // 現在のシーンを保存
    currentSceneRef.current = scene;
    
    try {
      // audioRef がなければ作成
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      // 以前の音声を停止
      audioRef.current.pause();
      
      // 最初のインデックスから開始
      setCurrentAudioIndex(0);
      
      // 新しい音声をセット
      audioRef.current.src = scene.sceneSpeechUrls[0];
      audioRef.current.load();
      
      // 音声再生終了時の処理
      audioRef.current.onended = () => {
        console.log("音声再生完了");
        
        // ローカル変数で次のインデックスを計算
        const nextIndex = currentAudioIndex + 1;
        console.log("次の音声インデックス:", nextIndex);
        
        // 次の音声ファイルがある場合は再生
        if (currentSceneRef.current && 
            currentSceneRef.current.sceneSpeechUrls && 
            nextIndex < currentSceneRef.current.sceneSpeechUrls.length) {
            
          // インデックスを更新
          setCurrentAudioIndex(nextIndex);
          
          // 次の音声を再生
          if (audioRef.current) {
            audioRef.current.src = currentSceneRef.current.sceneSpeechUrls[nextIndex];
            audioRef.current.load();
            audioRef.current.play().catch(err => {
              console.error("次の音声再生エラー:", err);
            });
          }
        }
      };
      
      // 音声再生
      audioRef.current.play().catch(err => {
        console.error("音声再生エラー:", err);
      });
    } catch (error) {
      console.error("音声再生設定エラー:", error);
    }
  };
  
  // 学習ポイントの表示切り替え
  const toggleLearningPoint = () => {
    setShowLearningPoint(prev => !prev);
    // 学習ポイント表示効果音
    if (sfxOn) {
      // 効果音再生
    }
  };
  
  // シーンのテキストか選択肢をクリックしたときの処理
  const handleScreenClick = () => {
    // UI要素が非表示の場合は、クリックでUI表示に戻る
    if (!showUI) {
      setShowUI(true);
      return;
    }
    
    if (isTyping) {
      // テキストアニメーション中なら、アニメーションをスキップ
      skipTextAnimation();
    } else if (textComplete && (!activeScene?.choices || activeScene.choices.length === 0)) {
      // 選択肢がなければ、次へ進む
      handleContinue();
    }
  };
  
  // 背景スタイルの設定
  const getBackgroundStyle = () => {
    if (!activeScene) return {};
    
    // 生成された画像がある場合はそれを使用
    if (activeScene.sceneImageUrl) {
      return {
        backgroundImage: `url(${activeScene.sceneImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: nightMode ? 'brightness(0.7) contrast(1.1)' : 'none',
        transition: 'filter 0.5s ease'
      };
    }
    
    // デフォルトのグラデーション背景
    return {
      background: nightMode 
        ? 'linear-gradient(135deg, rgba(25, 55, 100, 0.9) 0%, rgba(40, 80, 130, 0.95) 100%)'
        : 'linear-gradient(135deg, rgba(176, 224, 255, 0.8) 0%, rgba(218, 249, 255, 0.9) 100%)',
      transition: 'background 0.5s ease'
    };
  };
  
  // テキストサイズに基づいたクラス名を取得
  const getTextSizeClass = () => {
    switch (textSize) {
      case 'small': return 'text-base';
      case 'medium': return 'text-lg';
      case 'large': return 'text-xl';
      case 'xlarge': return 'text-2xl';
      default: return 'text-lg';
    }
  };
  
  // テキストを表示用に変換
  const renderDisplayedText = (): ReactNode => {
    // テキストセグメントがない場合は単純に表示
    if (textSegments.length === 0) {
      return displayedText;
    }
    
    // テキストを位置に基づいてセグメントに分割
    const result: ReactNode[] = [];
    let accumulatedLength = 0;
    
    for (let i = 0; i < textSegments.length; i++) {
      const segment = textSegments[i];
      
      if (accumulatedLength >= displayedText.length) {
        // このセグメントはまだ表示されていない
        break;
      }
      
      const segmentStartPos = accumulatedLength;
      const segmentEndPos = accumulatedLength + segment.text.length;
      
      if (segmentEndPos <= displayedText.length) {
        // このセグメントは完全に表示されている
        result.push(
          <>
          <span key={i} className={`segment-text ${i === currentSegmentIndex ? 'current-segment' : ''}`}>
            {segment.text}
          </span>
          <br />
          </>
        );
      } else if (segmentStartPos < displayedText.length) {
        // このセグメントは部分的に表示されている
        const visiblePart = segment.text.substring(0, displayedText.length - segmentStartPos);
        
        result.push(
          <span key={i} className={`segment-text ${i === currentSegmentIndex ? 'current-segment' : ''}`}>
            {visiblePart}
          </span>
        );
      }
      
      accumulatedLength += segment.text.length;
    }
    
    return result;
  };
  
  if (!activeScene) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[var(--primary)] border-gray-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white">ストーリーを読み込み中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative ${standalone ? 'min-h-screen' : 'min-h-[600px]'} bg-black overflow-hidden`}
      onClick={handleScreenClick}
    >
      {/* ツールバー（上部に表示するUI） - PCのみ表示 */}
      {showUI && showControls && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-black bg-opacity-40 backdrop-blur-sm text-white p-2 hidden md:flex justify-between items-center transition-opacity duration-300">
          <div className="flex items-center space-x-3">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title="設定"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title="履歴"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); toggleAutoMode(); }}
              className={`p-2 rounded-full transition-colors ${autoMode ? 'bg-[var(--primary)] hover:bg-[var(--primary-dark)]' : 'hover:bg-gray-700'}`}
              title="自動再生"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); toggleUI(); }}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title="フルスクリーン"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
          
          <h1 className="text-white text-shadow font-bold text-lg">
            {story.title}
          </h1>
          
          <div className="flex items-center space-x-3">
            {activeScene.sceneSpeechUrls && activeScene.sceneSpeechUrls.length > 0 && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (audioRef.current && !audioRef.current.paused) {
                    audioRef.current.pause();
                  } else {
                    playSceneSpeech(activeScene);
                  }
                }}
                className={`p-2 rounded-full transition-colors hover:bg-gray-700`}
                title="音声再生/停止"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.414-9.9l4.243 4.243-4.243 4.242z" />
                </svg>
              </button>
            )}
            
            {activeScene.learningPoint && (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleLearningPoint(); }}
                className={`p-2 rounded-full transition-colors ${showLearningPoint ? 'bg-[var(--primary)]' : 'hover:bg-gray-700'}`}
                title="学習ポイント"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </button>
            )}
            
            {onClose && (
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="閉じる"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* スマホ用タイトルバー */}
      {showUI && showControls && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-black bg-opacity-40 backdrop-blur-sm text-white p-2 md:hidden flex justify-between items-center transition-opacity duration-300">
          <h1 className="text-white text-shadow font-bold text-base truncate max-w-[75%]">
            {story.title}
          </h1>
          
          <div className="flex items-center space-x-2">
            {activeScene.sceneSpeechUrls && activeScene.sceneSpeechUrls.length > 0 && (
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (audioRef.current && !audioRef.current.paused) {
                    audioRef.current.pause();
                  } else {
                    playSceneSpeech(activeScene);
                  }
                }}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="音声再生/停止"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.414-9.9l4.243 4.243-4.243 4.242z" />
                </svg>
              </button>
            )}
            
            {onClose && (
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                title="閉じる"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* 設定パネル */}
      {showSettings && (
        <div 
          className="absolute inset-x-0 top-12 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-md p-4 border-b border-gray-700 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-semibold">ゲーム設定</h3>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-300 mb-2">テキスト表示速度</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => changeTypingSpeed(10)}
                  className={`px-3 py-1 rounded-md ${typingSpeed === 10 ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  速い
                </button>
                <button
                  onClick={() => changeTypingSpeed(30)}
                  className={`px-3 py-1 rounded-md ${typingSpeed === 30 ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  普通
                </button>
                <button
                  onClick={() => changeTypingSpeed(50)}
                  className={`px-3 py-1 rounded-md ${typingSpeed === 50 ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  遅い
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-300 mb-2">テキストサイズ</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => changeTextSize('small')}
                  className={`px-3 py-1 rounded-md ${textSize === 'small' ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  小
                </button>
                <button
                  onClick={() => changeTextSize('medium')}
                  className={`px-3 py-1 rounded-md ${textSize === 'medium' ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  中
                </button>
                <button
                  onClick={() => changeTextSize('large')}
                  className={`px-3 py-1 rounded-md ${textSize === 'large' ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  大
                </button>
                <button
                  onClick={() => changeTextSize('xlarge')}
                  className={`px-3 py-1 rounded-md ${textSize === 'xlarge' ? 'bg-[var(--primary)] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  特大
                </button>
              </div>
            </div>
            
            <div className="col-span-2">
              {/* PC用の設定レイアウト */}
            <div className="hidden md:flex justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">BGM</span>
                <button 
                  onClick={toggleMusic}
                  className={`w-12 h-6 rounded-full flex items-center ${musicOn ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${musicOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">効果音</span>
                <button 
                  onClick={toggleSfx}
                  className={`w-12 h-6 rounded-full flex items-center ${sfxOn ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${sfxOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">ナイトモード</span>
                <button 
                  onClick={toggleNightMode}
                  className={`w-12 h-6 rounded-full flex items-center ${nightMode ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${nightMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">音声ナレーション</span>
                <button 
                  onClick={toggleSpeech}
                  className={`w-12 h-6 rounded-full flex items-center ${speechOn ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${speechOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
            </div>
            
            {/* スマホ用の設定レイアウト */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">BGM</span>
                <button 
                  onClick={toggleMusic}
                  className={`w-12 h-6 rounded-full flex items-center ${musicOn ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${musicOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">効果音</span>
                <button 
                  onClick={toggleSfx}
                  className={`w-12 h-6 rounded-full flex items-center ${sfxOn ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${sfxOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">ナイトモード</span>
                <button 
                  onClick={toggleNightMode}
                  className={`w-12 h-6 rounded-full flex items-center ${nightMode ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${nightMode ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">音声ナレーション</span>
                <button 
                  onClick={toggleSpeech}
                  className={`w-12 h-6 rounded-full flex items-center ${speechOn ? 'bg-[var(--primary)]' : 'bg-gray-700'} transition-colors`}
                >
                  <span className={`w-5 h-5 rounded-full transform transition-transform ${speechOn ? 'translate-x-6 bg-white' : 'translate-x-1 bg-gray-400'}`}></span>
                </button>
              </div>
            </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            <p>キーボードショートカット: スペース(次へ), A(自動), H(履歴), S(設定), F(UI表示切替)</p>
          </div>
        </div>
      )}
      
      {/* 履歴パネル */}
      {showHistory && (
        <div 
          className="absolute inset-0 z-40 bg-gray-900 bg-opacity-95 backdrop-blur-md p-4 text-white overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-semibold">履歴</h3>
            <button 
              onClick={() => setShowHistory(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            {history.map((item, index) => {
              const scene = scenesMap.current[item.sceneId];
              const text = language === 'ja' ? scene.text : (scene.textEn || scene.text);
              const fullText = text.map(quote => {
                const speaker = quote.speaker ? `(${quote.speaker}) ` : '';
                return speaker + quote.text;
              }).join('\n');
              if (!scene) return null;
              
              return (
                <div key={index} className="border-b border-gray-700 pb-4">
                  {index > 0 && item.choice && (
                    <div className="mb-2 text-sm text-[var(--primary-light)] italic">
                      選択: {item.choice}
                    </div>
                  )}
                  <div className="text-gray-200 whitespace-pre-line">
                    {fullText.split('\n').map((line, lineIndex) => (
                      <span key={lineIndex} className="block">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* 学習ポイントが表示されている場合のオーバーレイ */}
      {showLearningPoint && activeScene.learningPoint && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-20 flex items-center justify-center p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6 shadow-xl border border-[var(--primary)] animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">学習ポイント</h3>
              </div>
              <button 
                onClick={toggleLearningPoint}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-700 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-[var(--primary-light)] mb-3">{activeScene.learningPoint.title}</h4>
              <p className="text-gray-100 leading-relaxed">{activeScene.learningPoint.content}</p>
              
              <div className="mt-8 flex justify-between items-center">
                <div className="flex items-center text-gray-300 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-[var(--primary-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  このポイントはストーリー内でいつでも確認できます
                </div>
                <button 
                  onClick={toggleLearningPoint}
                  className="px-5 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-dark)] transition-colors shadow-lg"
                >
                  ストーリーに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* トランジションオーバーレイ */}
      <div 
        className={`absolute inset-0 bg-black z-10 pointer-events-none transition-opacity duration-500 ${
          transition ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
      
      {/* 背景エリア */}
      <div 
        className="relative w-full h-full min-h-screen flex flex-col"
        style={getBackgroundStyle()}
      >
        {/* クイズモードの場合、進捗状況表示 */}
        {story.isQuizMode && (
          <div className="absolute top-14 right-2 bg-white bg-opacity-80 px-3 py-1 rounded-full shadow text-sm text-gray-700 z-20">
            正解率: {totalCorrect}/{totalQuestions} ({totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}%)
          </div>
        )}
        {/* キャラクターが表示されるエリア（今後実装） */}
        <div className="min-h-[300px] flex items-center justify-center">
          {/* キャラクター表示エリア（将来的に実装） */}
          {activeScene.characters && activeScene.characters.length > 0 && (
            <div className="absolute bottom-[200px] left-1/2 transform -translate-x-1/2">
              {/* ここにキャラクターのシルエットや画像を表示 */}
              <div className="w-64 h-64 opacity-70 rounded-full bg-gradient-to-b from-transparent to-black/20 mx-auto"></div>
            </div>
          )}
        </div>
        
        {/* テキストとUI表示エリア */}
        <div className={`mt-auto transition-all duration-300 ${!showUI ? 'opacity-0' : 'opacity-100'}`}>
          {/* テキストボックス - 透明度を上げて背景を見やすく */}
          <div 
            className={`relative ${
              nightMode ? 'bg-gray-900 bg-opacity-30' : 'bg-white bg-opacity-30'
            } backdrop-blur-sm border-t ${
              nightMode ? 'border-gray-700' : 'border-gray-200'
            } p-4 md:p-6 min-h-[150px] md:min-h-[200px] cursor-pointer shadow-xl transition-colors duration-300 rounded-t-xl`}
          >
            {/* 話者名（現在の位置に基づいて表示）- より透明に調整 */}
            {currentSpeaker && (
              <div className="inline-block bg-[var(--primary)] bg-opacity-70 backdrop-blur-sm text-white px-4 py-1.5 rounded-tl-md rounded-tr-md rounded-br-md mb-3 shadow-md">
                {currentSpeaker}
              </div>
            )}
            
            {/* テキスト - セグメントごとに表示 - 固定高さを設定し、スクロール可能に */}
            <div className={`${getTextSizeClass()} leading-relaxed ${nightMode ? 'text-gray-100' : 'text-gray-800'} text-shadow-sm max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar whitespace-pre-line md:whitespace-normal`}>
              {renderDisplayedText()}
              {isTyping && <span className="animate-pulse ml-0.5">|</span>}
            </div>
            
            {/* スキップ・続けるボタン */}
            {isTyping ? (
              <div className="absolute bottom-4 right-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); skipTextAnimation(); }}
                  className={`${nightMode ? 'text-[var(--primary-light)]' : 'text-[var(--primary)]'} hover:text-[var(--primary-dark)] text-sm underline transition-colors`}
                >
                  スキップ
                </button>
              </div>
            ) : textComplete && (!activeScene.choices || activeScene.choices.length === 0) && (
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center">
                  <span className={`${nightMode ? 'text-gray-400' : 'text-gray-500'} mr-2 text-sm animate-pulse`}>
                    クリックで続ける
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {/* クイズモードの選択肢 - より透明なコンテナ */}
          {showChoices && story.isQuizMode && activeScene.quiz && (
            <div className={`${
              nightMode ? 'bg-gray-800 bg-opacity-25' : 'bg-gray-100 bg-opacity-25'
            } backdrop-blur-sm p-6 transition-colors duration-300 rounded-b-xl`}>
              {/* 問題文 */}
              <div className="mb-4 md:mb-6">
                <h3 className={`font-bold text-lg md:text-xl mb-2 md:mb-3 ${nightMode ? 'text-white' : 'text-gray-800'} text-shadow-sm`}>
                  {activeScene.quiz.question}
                </h3>
              </div>
              
              {/* クイズの選択肢 */}
              <div className="space-y-2 md:space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {activeScene.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleQuizOptionClick(index, option.isCorrect, option.explanation || ''); 
                    }}
                    disabled={quizSubmitted}
                    className={`w-full text-left p-3 md:p-4 rounded-xl transition-all duration-200 transform ${
                      quizSubmitted && selectedOptionIndex === index
                        ? option.isCorrect
                          ? 'bg-green-100 bg-opacity-80 border-green-500 text-green-800'
                          : 'bg-red-100 bg-opacity-80 border-red-500 text-red-800'
                        : quizSubmitted
                          ? 'opacity-70'
                          : 'hover:scale-[1.01] hover:shadow-lg hover:bg-opacity-70 active:bg-opacity-60'
                    } ${
                      nightMode 
                        ? 'bg-gray-700 bg-opacity-30 border border-gray-600 text-white' 
                        : 'bg-white bg-opacity-30 border border-gray-200 text-gray-800'
                    } backdrop-blur-sm touch-manipulation`}
                  >
                    <div className="flex items-center">
                      <span className={`inline-block w-6 h-6 rounded-full mr-3 flex-shrink-0 ${
                        quizSubmitted && selectedOptionIndex === index
                          ? option.isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : nightMode 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-[var(--primary-light)] text-[var(--primary)]'
                      } text-xs flex items-center justify-center font-bold`}>
                        {String.fromCharCode(65 + index)} {/* A, B, C, ... */}
                      </span>
                      <span className={getTextSizeClass()}>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* 結果と解説 - 固定高さを設定し、スクロール可能に */}
              {quizSubmitted && quizResult && (
                <div className={`mt-6 p-4 rounded-lg backdrop-blur-sm max-h-[40vh] overflow-y-auto ${
                  quizResult.correct
                    ? nightMode ? 'bg-green-900 bg-opacity-50 border border-green-700' : 'bg-green-50 bg-opacity-70 border border-green-200'
                    : nightMode ? 'bg-red-900 bg-opacity-50 border border-red-700' : 'bg-red-50 bg-opacity-70 border border-red-200'
                }`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      quizResult.correct ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}>
                      {quizResult.correct ? '✓' : '✗'}
                    </div>
                    <h4 className={`font-bold ${
                      nightMode
                        ? 'text-white'
                        : quizResult.correct ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {quizResult.correct ? '正解です！' : '不正解です'}
                    </h4>
                  </div>
                  
                  {quizResult.explanation && (
                    <p className={`${nightMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{quizResult.explanation}</p>
                  )}
                  
                  <div className={`mt-4 p-3 rounded border ${
                    nightMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
                  }`}>
                    <h5 className={`font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-900'} mb-2`}>解説</h5>
                    <p className={nightMode ? 'text-gray-300' : 'text-gray-700'}>{activeScene.quiz.explanation}</p>
                  </div>
                  
                  <div className="mt-5 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleContinue(); }}
                      className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                    >
                      次へ進む
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* 通常モードの選択肢（従来のシナリオ分岐用）- より透明なコンテナ */}
          {showChoices && !story.isQuizMode && activeScene.choices && activeScene.choices.length > 0 && (
            <div className={`${
              nightMode ? 'bg-gray-800 bg-opacity-25' : 'bg-gray-100 bg-opacity-25'
            } backdrop-blur-sm p-6 space-y-3 transition-colors duration-300 rounded-b-xl`}>
              {activeScene.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); handleChoiceClick(choice); }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg ${
                    nightMode 
                      ? 'bg-gray-700 bg-opacity-30 border border-gray-600 text-white hover:bg-gray-600 hover:border-[var(--primary)] hover:bg-opacity-50' 
                      : 'bg-white bg-opacity-30 border border-gray-200 text-gray-800 hover:bg-[var(--primary-light)] hover:border-[var(--primary)] hover:bg-opacity-50'
                  } backdrop-blur-sm`}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full mr-3 flex-shrink-0 ${
                      nightMode ? 'bg-gray-600 text-white' : 'bg-[var(--primary-light)] text-[var(--primary)]'
                    } text-xs flex items-center justify-center font-bold`}>
                      {index + 1}
                    </span>
                    <span className={getTextSizeClass()}>{choice.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* モバイル用コントロールバー（画面下部） - 改善版 */}
      {showUI && showControls && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-md text-white p-3 flex justify-around z-30 border-t border-gray-700">
          {/* スキップボタン（テキスト表示中のみ表示） */}
          {isTyping ? (
            <button 
              onClick={(e) => { e.stopPropagation(); skipTextAnimation(); }}
              className="flex flex-col items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
              <span className="text-xs mt-1">スキップ</span>
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleAutoMode(); }}
              className={`flex flex-col items-center justify-center ${autoMode ? 'text-[var(--primary)]' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs mt-1">自動</span>
            </button>
          )}
          
          {/* 履歴ボタン */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }}
            className={`flex flex-col items-center justify-center ${showHistory ? 'text-[var(--primary)]' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1">履歴</span>
          </button>
          
          {/* 速度切り替えボタン */}
          <button 
            onClick={(e) => { e.stopPropagation(); changeTypingSpeed(typingSpeed === 30 ? 10 : 30); }}
            className="flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs mt-1">速度</span>
          </button>
          
          {/* 学習ポイント（ある場合のみ表示） */}
          {activeScene.learningPoint && (
            <button 
              onClick={(e) => { e.stopPropagation(); toggleLearningPoint(); }}
              className={`flex flex-col items-center justify-center ${showLearningPoint ? 'text-[var(--primary)]' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs mt-1">学習</span>
            </button>
          )}
          
          {/* 設定ボタン */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
            className={`flex flex-col items-center justify-center ${showSettings ? 'text-[var(--primary)]' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs mt-1">設定</span>
          </button>
        </div>
      )}
      
      {/* スタイルシート用のCSS */}
      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .text-shadow-sm {
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .current-segment {
          font-weight: 500;
        }
        .segment-text {
          transition: all 0.2s ease;
        }
        
        /* カスタムスクロールバースタイル */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
