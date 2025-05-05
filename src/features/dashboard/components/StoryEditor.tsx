"use client";

import { useState, useEffect } from 'react';
import { Story, Scene, Choice, LearningPoint } from '@/utils/storyModel';
import StoryPreview from './StoryPreview';
import Image from 'next/image';

interface StoryEditorProps {
  story: Story;
  onSave: (story: Story) => Promise<void>;
  isSaving: boolean;
}

export default function StoryEditor({ story, onSave, isSaving }: StoryEditorProps) {
  const [editedStory, setEditedStory] = useState<Story>(story);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [activeSceneId, setActiveSceneId] = useState<string | null>(story.initialScene || null);
  const [scenesMap, setScenesMap] = useState<Record<string, Scene>>({});
  const [sceneOrder, setSceneOrder] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // ストーリーの内容が変更されたときに状態を更新
  useEffect(() => {
    setEditedStory(story);
    
    // シーンをIDでマップ化して検索しやすくする
    const map: Record<string, Scene> = {};
    const order: string[] = [];
    
    story.scenes.forEach(scene => {
      map[scene.id] = scene;
      order.push(scene.id);
    });
    
    setScenesMap(map);
    setSceneOrder(order);
    
    // 初期シーンがなければ、最初のシーンをアクティブに
    if (!activeSceneId && story.scenes.length > 0) {
      setActiveSceneId(story.initialScene || story.scenes[0].id);
    }
    
    // 初期状態では変更なし
    setUnsavedChanges(false);
  }, [story, activeSceneId]);

  // 基本情報の更新
  const updateBasicInfo = (field: keyof Story, value: string) => {
    setEditedStory(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
  };

  // メタデータの更新
  const updateMetadata = (field: string, value: string | Array<string>) => {
    setEditedStory(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    } as Story));
    setUnsavedChanges(true);
  };

  // シーンの更新
  const updateScene = (sceneId: string, field: keyof Scene, value: string) => {
    const updatedScene = {
      ...scenesMap[sceneId],
      [field]: value
    };
    
    const updatedMap = {
      ...scenesMap,
      [sceneId]: updatedScene
    };
    
    setScenesMap(updatedMap);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: sceneOrder.map(id => updatedMap[id])
    }));
    
    setUnsavedChanges(true);
  };

  // 選択肢の更新
  const updateChoice = (sceneId: string, choiceIndex: number, field: keyof Choice, value: string) => {
    const scene = scenesMap[sceneId];
    if (!scene.choices) return;
    
    const updatedChoices = [...scene.choices];
    updatedChoices[choiceIndex] = {
      ...updatedChoices[choiceIndex],
      [field]: value
    };
    
    const updatedScene = {
      ...scene,
      choices: updatedChoices
    };
    
    const updatedMap = {
      ...scenesMap,
      [sceneId]: updatedScene
    };
    
    setScenesMap(updatedMap);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: sceneOrder.map(id => updatedMap[id])
    }));
    
    setUnsavedChanges(true);
  };

  // 選択肢の追加
  const addChoice = (sceneId: string) => {
    const scene = scenesMap[sceneId];
    const choices = scene.choices || [];
    
    const newChoice: Choice = {
      text: '新しい選択肢',
      nextScene: scene.id // デフォルトでは同じシーンに戻る
    };
    
    const updatedScene = {
      ...scene,
      choices: [...choices, newChoice]
    };
    
    const updatedMap = {
      ...scenesMap,
      [sceneId]: updatedScene
    };
    
    setScenesMap(updatedMap);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: sceneOrder.map(id => updatedMap[id])
    }));
    
    setUnsavedChanges(true);
  };

  // 選択肢の削除
  const removeChoice = (sceneId: string, choiceIndex: number) => {
    const scene = scenesMap[sceneId];
    if (!scene.choices) return;
    
    const updatedChoices = scene.choices.filter((_, index) => index !== choiceIndex);
    
    const updatedScene = {
      ...scene,
      choices: updatedChoices
    };
    
    const updatedMap = {
      ...scenesMap,
      [sceneId]: updatedScene
    };
    
    setScenesMap(updatedMap);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: sceneOrder.map(id => updatedMap[id])
    }));
    
    setUnsavedChanges(true);
  };

  // 学習ポイントの更新
  const updateLearningPoint = (sceneId: string, field: keyof LearningPoint, value: string) => {
    const scene = scenesMap[sceneId];
    const learningPoint = scene.learningPoint || { sceneId, title: '', content: '' };
    
    const updatedLearningPoint = {
      ...learningPoint,
      [field]: value
    };
    
    const updatedScene = {
      ...scene,
      learningPoint: updatedLearningPoint
    };
    
    const updatedMap = {
      ...scenesMap,
      [sceneId]: updatedScene
    };
    
    setScenesMap(updatedMap);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: sceneOrder.map(id => updatedMap[id])
    }));
    
    setUnsavedChanges(true);
  };

  // 新しいシーンの追加
  const addNewScene = () => {
    // シーンIDを生成（簡易的なランダムID）
    const newId = `scene_${Date.now().toString(36)}`;
    
    const newScene: Scene = {
      id: newId,
      type: 'scene',
      background: 'default background',
      text: '新しいシーンのテキスト',
      text_en: 'New scene text',
      choices: [
        {
          text: '次へ',
          nextScene: story.initialScene // デフォルトでは初期シーンに戻る
        }
      ]
    };
    
    // シーンマップを更新
    const updatedMap = {
      ...scenesMap,
      [newId]: newScene
    };
    
    // シーン順序を更新
    const updatedOrder = [...sceneOrder, newId];
    
    setScenesMap(updatedMap);
    setSceneOrder(updatedOrder);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: updatedOrder.map(id => updatedMap[id])
    }));
    
    // 変更を検知
    setUnsavedChanges(true);
    
    // 新しいシーンをアクティブに
    setActiveSceneId(newId);
    setActiveTab('scenes');
  };

  // シーンの削除
  const removeScene = (sceneId: string) => {
    // 初期シーンは削除できない
    if (sceneId === editedStory.initialScene) {
      alert('初期シーンは削除できません');
      return;
    }
    
    // 確認ダイアログ
    if (!confirm('このシーンを削除してもよろしいですか？この操作は元に戻せません。')) {
      return;
    }
    
    // シーンマップから削除
    const { [sceneId]: _, ...updatedMap } = scenesMap; // eslint-disable-line @typescript-eslint/no-unused-vars
    
    // シーン順序も更新
    const updatedOrder = sceneOrder.filter(id => id !== sceneId);
    
    // このシーンを参照している選択肢も更新（仮の対処として初期シーンへ戻す）
    Object.keys(updatedMap).forEach(id => {
      const scene = updatedMap[id];
      if (scene.choices) {
        scene.choices = scene.choices.map(choice => {
          if (choice.nextScene === sceneId) {
            return { ...choice, nextScene: editedStory.initialScene };
          }
          return choice;
        });
      }
    });
    
    setScenesMap(updatedMap);
    setSceneOrder(updatedOrder);
    
    // 編集中のストーリーも更新
    setEditedStory(prev => ({
      ...prev,
      scenes: updatedOrder.map(id => updatedMap[id])
    }));
    
    // アクティブシーンが削除されたシーンだった場合、初期シーンをアクティブに
    if (activeSceneId === sceneId) {
      setActiveSceneId(editedStory.initialScene);
    }
  };

  // 変更を保存
  const handleSave = async () => {
    // 最終的なストーリーデータを構築
    const finalStory: Story = {
      ...editedStory,
      scenes: sceneOrder.map(id => scenesMap[id])
    };
    
    await onSave(finalStory);
  };

  // filteredScenes の計算 - 検索語に基づいてシーンをフィルタリング
  const filteredScenes = searchTerm.trim() 
    ? sceneOrder.filter(id => {
        const scene = scenesMap[id];
        return (
          id.toLowerCase().includes(searchTerm.toLowerCase()) || 
          scene?.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          scene?.text_en?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : sceneOrder;

  // アクティブシーン
  const activeScene = activeSceneId ? scenesMap[activeSceneId] : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
            activeTab === 'basic'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('basic')}
        >
          基本情報
        </button>
        <button
          className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
            activeTab === 'scenes'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('scenes')}
        >
          シーン編集
        </button>
        <button
          className={`flex-1 py-4 px-4 text-center font-medium text-sm transition-colors ${
            activeTab === 'settings'
              ? 'text-[var(--primary)] border-b-2 border-[var(--primary)]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          公開設定
        </button>
      </div>

      <div className="p-6">
        {/* 基本情報タブ */}
        {activeTab === 'basic' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">基本情報</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                タイトル
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.title}
                onChange={(e) => updateBasicInfo('title', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                説明
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.description}
                onChange={(e) => updateBasicInfo('description', e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="initialScene" className="block text-sm font-medium text-gray-700 mb-1">
                初期シーン
              </label>
              <select
                id="initialScene"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.initialScene}
                onChange={(e) => updateBasicInfo('initialScene', e.target.value)}
              >
                {sceneOrder.map(id => (
                  <option key={id} value={id}>
                    {id} - {scenesMap[id]?.text?.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="thumbnailURL" className="block text-sm font-medium text-gray-700 mb-1">
                サムネイルURL
              </label>
              <input
                id="thumbnailURL"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.thumbnailURL || ''}
                onChange={(e) => updateBasicInfo('thumbnailURL', e.target.value)}
              />
              {editedStory.thumbnailURL && (
                <div className="mt-2 p-2 border border-gray-200 rounded">
                  <p className="text-xs text-gray-500 mb-1">プレビュー:</p>
                  <Image 
                    src={editedStory.thumbnailURL} 
                    alt="サムネイルプレビュー" 
                    className="h-24 object-cover rounded"
                    width={500}
                    height={500}
                  />
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="isQuizMode"
                  type="checkbox"
                  className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] rounded"
                  checked={!!editedStory.isQuizMode}
                  onChange={(e) => {
                    setEditedStory(prev => ({
                      ...prev,
                      isQuizMode: e.target.checked
                    }));
                    setUnsavedChanges(true);
                  }}
                />
                <label htmlFor="isQuizMode" className="ml-2 block text-sm font-medium text-gray-700">
                  クイズモード
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                クイズモードでは、ストーリーを進めながら問題に答えて学ぶスタイルになります。
                各シーンで設定したクイズ問題を順番に解いていく形式です。
              </p>
            </div>
          </div>
        )}

        {/* シーン編集タブ */}
        {activeTab === 'scenes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">シーン編集</h2>
              <button
                onClick={addNewScene}
                className="px-3 py-1 text-sm text-white bg-[var(--primary)] rounded hover:bg-[var(--primary-dark)] transition-colors"
              >
                + 新規シーン追加
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* シーンリスト（左側） */}
              <div className="md:col-span-1 border-r border-gray-200 pr-4">
                <div className="mb-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="シーンを検索..."
                      className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {searchTerm && (
                      <button 
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <ul className="space-y-1 max-h-[500px] overflow-y-auto">
                  {filteredScenes.map(id => (
                    <li 
                      key={id}
                      className={`p-2 text-sm rounded cursor-pointer ${
                        activeSceneId === id 
                          ? 'bg-[var(--primary-light)] text-[var(--primary)]' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveSceneId(id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{id}</span>
                        {id === editedStory.initialScene && (
                          <span className="text-xs bg-[var(--primary)] text-white rounded-full px-2 py-0.5">初期</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs truncate mt-1">
                        {scenesMap[id]?.text?.substring(0, 40) || ''}...
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* シーン編集（右側） */}
              <div className="md:col-span-3">
                {activeScene ? (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-800">
                        シーン: {activeSceneId}
                        {activeSceneId === editedStory.initialScene && (
                          <span className="ml-2 text-xs bg-[var(--primary)] text-white rounded-full px-2 py-0.5">初期シーン</span>
                        )}
                      </h3>
                      <button
                        onClick={() => removeScene(activeSceneId!)}
                        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                        disabled={activeSceneId === editedStory.initialScene}
                      >
                        削除
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            シーンID
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            value={activeScene.id}
                            disabled
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            シーンタイプ
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                            value={activeScene.type}
                            onChange={(e) => updateScene(activeSceneId!, 'type', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          背景プロンプト
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                          value={activeScene.background}
                          onChange={(e) => updateScene(activeSceneId!, 'background', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          テキスト（日本語）
                        </label>
                        <textarea
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                          value={activeScene.text}
                          onChange={(e) => updateScene(activeSceneId!, 'text', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          テキスト（英語）
                        </label>
                        <textarea
                          rows={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                          value={activeScene.text_en}
                          onChange={(e) => updateScene(activeSceneId!, 'text_en', e.target.value)}
                        />
                      </div>
                      
                      {/* クイズモードの場合はクイズ編集、それ以外は選択肢編集を表示 */}
                      {editedStory.isQuizMode ? (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              クイズ問題
                            </label>
                          </div>
                          
                          <div className="border border-gray-200 rounded-md p-3 mb-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                問題文
                              </label>
                              <textarea
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                value={activeScene.quiz?.question || ''}
                                onChange={(e) => {
                                  // クイズオブジェクトがない場合は初期化
                                  const updatedScene = { ...activeScene };
                                  if (!updatedScene.quiz) {
                                    updatedScene.quiz = {
                                      question: e.target.value,
                                      options: [],
                                      explanation: ''
                                    };
                                  } else {
                                    updatedScene.quiz = {
                                      ...updatedScene.quiz,
                                      question: e.target.value
                                    };
                                  }
                                  
                                  const updatedMap = {
                                    ...scenesMap,
                                    [activeSceneId!]: updatedScene
                                  };
                                  
                                  setScenesMap(updatedMap);
                                  
                                  // 編集中のストーリーも更新
                                  setEditedStory(prev => ({
                                    ...prev,
                                    scenes: sceneOrder.map(id => updatedMap[id])
                                  }));
                                  
                                  setUnsavedChanges(true);
                                }}
                                placeholder="問題文を入力してください"
                              />
                            </div>
                            
                            <div className="mt-3">
                              <label className="block text-xs text-gray-500 mb-1">
                                問題の解説
                              </label>
                              <textarea
                                rows={3}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                value={activeScene.quiz?.explanation || ''}
                                onChange={(e) => {
                                  // クイズオブジェクトがない場合は初期化
                                  const updatedScene = { ...activeScene };
                                  if (!updatedScene.quiz) {
                                    updatedScene.quiz = {
                                      question: '',
                                      options: [],
                                      explanation: e.target.value
                                    };
                                  } else {
                                    updatedScene.quiz = {
                                      ...updatedScene.quiz,
                                      explanation: e.target.value
                                    };
                                  }
                                  
                                  const updatedMap = {
                                    ...scenesMap,
                                    [activeSceneId!]: updatedScene
                                  };
                                  
                                  setScenesMap(updatedMap);
                                  
                                  // 編集中のストーリーも更新
                                  setEditedStory(prev => ({
                                    ...prev,
                                    scenes: sceneOrder.map(id => updatedMap[id])
                                  }));
                                  
                                  setUnsavedChanges(true);
                                }}
                                placeholder="問題の解説を入力してください"
                              />
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs text-gray-500">
                                  選択肢
                                </label>
                                <button
                                  onClick={() => {
                                    const updatedScene = { ...activeScene };
                                    // クイズオブジェクトがない場合は初期化
                                    if (!updatedScene.quiz) {
                                      updatedScene.quiz = {
                                        question: '',
                                        options: [],
                                        explanation: ''
                                      };
                                    }
                                    
                                    // 新しい選択肢を追加
                                    updatedScene.quiz.options = [
                                      ...(updatedScene.quiz.options || []),
                                      { text: '', isCorrect: false, explanation: '' }
                                    ];
                                    
                                    const updatedMap = {
                                      ...scenesMap,
                                      [activeSceneId!]: updatedScene
                                    };
                                    
                                    setScenesMap(updatedMap);
                                    
                                    // 編集中のストーリーも更新
                                    setEditedStory(prev => ({
                                      ...prev,
                                      scenes: sceneOrder.map(id => updatedMap[id])
                                    }));
                                    
                                    setUnsavedChanges(true);
                                  }}
                                  className="px-2 py-1 text-xs text-white bg-[var(--primary)] rounded hover:bg-[var(--primary-dark)] transition-colors"
                                >
                                  + 選択肢を追加
                                </button>
                              </div>
                              
                              {/* クイズの選択肢がある場合 */}
                              {activeScene.quiz?.options && activeScene.quiz.options.length > 0 ? (
                                <div className="space-y-3 mt-2">
                                  {activeScene.quiz.options.map((option, index) => (
                                    <div key={index} className="border border-gray-200 rounded-md p-3">
                                      <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                          <input
                                            type="radio"
                                            className="mr-2 h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                                            checked={option.isCorrect}
                                            onChange={() => {
                                              // 現在の選択肢を正解に、他の選択肢を不正解に
                                              const updatedScene = { ...activeScene };
                                              if (updatedScene.quiz && updatedScene.quiz.options) {
                                                updatedScene.quiz.options = updatedScene.quiz.options.map((opt, i) => ({
                                                  ...opt,
                                                  isCorrect: i === index
                                                }));
                                                
                                                const updatedMap = {
                                                  ...scenesMap,
                                                  [activeSceneId!]: updatedScene
                                                };
                                                
                                                setScenesMap(updatedMap);
                                                
                                                // 編集中のストーリーも更新
                                                setEditedStory(prev => ({
                                                  ...prev,
                                                  scenes: sceneOrder.map(id => updatedMap[id])
                                                }));
                                                
                                                setUnsavedChanges(true);
                                              }
                                            }}
                                          />
                                          <span className="text-sm font-medium text-gray-700">
                                            {option.isCorrect ? '正解' : '不正解'}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => {
                                            // 選択肢を削除
                                            const updatedScene = { ...activeScene };
                                            if (updatedScene.quiz && updatedScene.quiz.options) {
                                              updatedScene.quiz.options = updatedScene.quiz.options.filter((_, i) => i !== index);
                                              
                                              const updatedMap = {
                                                ...scenesMap,
                                                [activeSceneId!]: updatedScene
                                              };
                                              
                                              setScenesMap(updatedMap);
                                              
                                              // 編集中のストーリーも更新
                                              setEditedStory(prev => ({
                                                ...prev,
                                                scenes: sceneOrder.map(id => updatedMap[id])
                                              }));
                                              
                                              setUnsavedChanges(true);
                                            }
                                          }}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                      
                                      <div>
                                        <label className="block text-xs text-gray-500 mb-1">
                                          選択肢のテキスト
                                        </label>
                                        <input
                                          type="text"
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                          value={option.text}
                                          onChange={(e) => {
                                            const updatedScene = { ...activeScene };
                                            if (updatedScene.quiz && updatedScene.quiz.options) {
                                              updatedScene.quiz.options = updatedScene.quiz.options.map((opt, i) => {
                                                if (i === index) {
                                                  return { ...opt, text: e.target.value };
                                                }
                                                return opt;
                                              });
                                              
                                              const updatedMap = {
                                                ...scenesMap,
                                                [activeSceneId!]: updatedScene
                                              };
                                              
                                              setScenesMap(updatedMap);
                                              
                                              // 編集中のストーリーも更新
                                              setEditedStory(prev => ({
                                                ...prev,
                                                scenes: sceneOrder.map(id => updatedMap[id])
                                              }));
                                              
                                              setUnsavedChanges(true);
                                            }
                                          }}
                                          placeholder="選択肢のテキスト"
                                        />
                                      </div>
                                      
                                      <div className="mt-2">
                                        <label className="block text-xs text-gray-500 mb-1">
                                          選択肢の解説
                                        </label>
                                        <textarea
                                          rows={2}
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                          value={option.explanation || ''}
                                          onChange={(e) => {
                                            const updatedScene = { ...activeScene };
                                            if (updatedScene.quiz && updatedScene.quiz.options) {
                                              updatedScene.quiz.options = updatedScene.quiz.options.map((opt, i) => {
                                                if (i === index) {
                                                  return { ...opt, explanation: e.target.value };
                                                }
                                                return opt;
                                              });
                                              
                                              const updatedMap = {
                                                ...scenesMap,
                                                [activeSceneId!]: updatedScene
                                              };
                                              
                                              setScenesMap(updatedMap);
                                              
                                              // 編集中のストーリーも更新
                                              setEditedStory(prev => ({
                                                ...prev,
                                                scenes: sceneOrder.map(id => updatedMap[id])
                                              }));
                                              
                                              setUnsavedChanges(true);
                                            }
                                          }}
                                          placeholder="この選択肢を選んだ場合の解説"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center p-4 border border-dashed border-gray-300 rounded-md">
                                  <p className="text-gray-500 text-sm">選択肢がありません</p>
                                  <button
                                    onClick={() => {
                                      const updatedScene = { ...activeScene };
                                      // クイズオブジェクトがない場合は初期化
                                      if (!updatedScene.quiz) {
                                        updatedScene.quiz = {
                                          question: '',
                                          options: [],
                                          explanation: ''
                                        };
                                      }
                                      
                                      // 新しい選択肢を追加
                                      updatedScene.quiz.options = [
                                        ...(updatedScene.quiz.options || []),
                                        { text: '', isCorrect: true, explanation: '' }
                                      ];
                                      
                                      const updatedMap = {
                                        ...scenesMap,
                                        [activeSceneId!]: updatedScene
                                      };
                                      
                                      setScenesMap(updatedMap);
                                      
                                      // 編集中のストーリーも更新
                                      setEditedStory(prev => ({
                                        ...prev,
                                        scenes: sceneOrder.map(id => updatedMap[id])
                                      }));
                                      
                                      setUnsavedChanges(true);
                                    }}
                                    className="mt-2 px-3 py-1 text-xs text-[var(--primary)] border border-[var(--primary)] rounded hover:bg-[var(--primary-light)] transition-colors"
                                  >
                                    + 選択肢を追加
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              次のシーン
                            </label>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                              value={activeScene.nextScene || ''}
                              onChange={(e) => {
                                const updatedScene = {
                                  ...activeScene,
                                  nextScene: e.target.value
                                };
                                
                                const updatedMap = {
                                  ...scenesMap,
                                  [activeSceneId!]: updatedScene
                                };
                                
                                setScenesMap(updatedMap);
                                
                                // 編集中のストーリーも更新
                                setEditedStory(prev => ({
                                  ...prev,
                                  scenes: sceneOrder.map(id => updatedMap[id])
                                }));
                                
                                setUnsavedChanges(true);
                              }}
                            >
                              <option value="">次のシーンを選択</option>
                              {sceneOrder.map(id => (
                                id !== activeSceneId && (
                                  <option key={id} value={id}>
                                    {id}
                                  </option>
                                )
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              選択肢
                            </label>
                            <button
                              onClick={() => addChoice(activeSceneId!)}
                              className="px-2 py-1 text-xs text-white bg-[var(--primary)] rounded hover:bg-[var(--primary-dark)] transition-colors"
                            >
                              + 選択肢を追加
                            </button>
                          </div>
                          
                          {activeScene.choices && activeScene.choices.length > 0 ? (
                            <div className="space-y-3">
                              {activeScene.choices.map((choice, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">選択肢 {index + 1}</span>
                                    <button
                                      onClick={() => removeChoice(activeSceneId!, index)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        テキスト
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                        value={choice.text}
                                        onChange={(e) => updateChoice(activeSceneId!, index, 'text', e.target.value)}
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        次のシーン
                                      </label>
                                      <select
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                                        value={choice.nextScene}
                                        onChange={(e) => updateChoice(activeSceneId!, index, 'nextScene', e.target.value)}
                                      >
                                        {sceneOrder.map(id => (
                                          <option key={id} value={id}>
                                            {id} {id === activeSceneId && '(このシーン)'}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-4 border border-dashed border-gray-300 rounded-md">
                              <p className="text-gray-500 text-sm">選択肢がありません</p>
                              <button
                                onClick={() => addChoice(activeSceneId!)}
                                className="mt-2 px-3 py-1 text-xs text-[var(--primary)] border border-[var(--primary)] rounded hover:bg-[var(--primary-light)] transition-colors"
                              >
                                + 選択肢を追加
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* 学習ポイント編集 */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            学習ポイント
                          </label>
                        </div>
                        
                        <div className="border border-gray-200 rounded-md p-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">
                              タイトル
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                              value={activeScene.learningPoint?.title || ''}
                              onChange={(e) => updateLearningPoint(activeSceneId!, 'title', e.target.value)}
                              placeholder="このシーンでの学びのタイトル"
                            />
                          </div>
                          
                          <div className="mt-2">
                            <label className="block text-xs text-gray-500 mb-1">
                              内容
                            </label>
                            <textarea
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                              value={activeScene.learningPoint?.content || ''}
                              onChange={(e) => updateLearningPoint(activeSceneId!, 'content', e.target.value)}
                              placeholder="このシーンで学べる教育的内容の詳細な解説"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed border-gray-300 rounded-md">
                    <p className="text-gray-500">シーンを選択してください</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 公開設定タブ */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">公開設定</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                公開状態
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.metadata?.visibility || 'private'}
                onChange={(e) => updateMetadata('visibility', e.target.value)}
              >
                <option value="private">非公開（自分だけが閲覧可能）</option>
                <option value="unlisted">限定公開（URLを知っている人が閲覧可能）</option>
                <option value="public">公開（誰でも閲覧可能）</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.metadata?.category || ''}
                onChange={(e) => updateMetadata('category', e.target.value)}
              >
                <option value="">カテゴリなし</option>
                <option value="education">教育</option>
                <option value="entertainment">エンターテイメント</option>
                <option value="business">ビジネス</option>
                <option value="science">科学</option>
                <option value="history">歴史</option>
                <option value="language">語学</option>
                <option value="other">その他</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                難易度
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                value={editedStory.metadata?.difficulty || '通常'}
                onChange={(e) => updateMetadata('difficulty', e.target.value)}
              >
                <option value="簡単">簡単</option>
                <option value="通常">通常</option>
                <option value="難しい">難しい</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タグ
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)]"
                placeholder="カンマ区切りでタグを入力（例: 英語, 動物, 冒険）"
                value={(editedStory.metadata?.tags || []).join(', ')}
                onChange={(e) => {
                  const tagsText = e.target.value;
                  const tagsArray = tagsText.split(',').map(tag => tag.trim()).filter(tag => tag);
                  updateMetadata('tags', tagsArray);
                }}
              />
              {editedStory.metadata?.tags && editedStory.metadata.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {editedStory.metadata.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                作成情報
              </label>
              <div className="bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                <p>作成者: {editedStory.metadata?.creator?.username || '匿名'}</p>
                <p>作成日: {editedStory.metadata?.createdAt ? new Date(editedStory.metadata.createdAt).toLocaleString('ja-JP') : '不明'}</p>
                <p>最終更新: {editedStory.metadata?.updatedAt ? new Date(editedStory.metadata.updatedAt).toLocaleString('ja-JP') : '不明'}</p>
              </div>
            </div>
          </div>
        )}

        {/* 保存ボタン */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center">
            {unsavedChanges && (
              <span className="inline-flex items-center text-sm text-amber-600 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                未保存の変更があります
              </span>
            )}
            
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              プレビュー
            </button>
          </div>
          
          <div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-5 py-2 bg-[var(--primary)] text-white rounded-lg shadow-sm hover:bg-[var(--primary-dark)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  変更を保存
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* プレビューモーダル */}
        {showPreview && (
          <StoryPreview 
            story={{
              ...editedStory,
              scenes: sceneOrder.map(id => scenesMap[id])
            }}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
}
