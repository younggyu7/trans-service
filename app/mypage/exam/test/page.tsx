'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import type { ExamType, AnswerUnit } from '@/types/exam';

// Mock 시험 데이터
const mockExamContent = {
  title: '시험명이 나오는 영역',
  sourceText: "Artificial intelligence has become an integral part of modern society. From healthcare to education, AI is transforming how we work and live. However, many people still don't fully understand the implications of this technology.",
  sentences: [
    "Artificial intelligence has become an integral part of modern society.",
    "From healthcare to education, AI is transforming how we work and live.",
    "However, many people still don't fully understand the implications of this technology."
  ],
  paragraphs: [
    "Artificial intelligence has become an integral part of modern society. From healthcare to education, AI is transforming how we work and live. However, many people still don't fully understand the implications of this technology."
  ],
  targetSentences: [
    "인공지능은 현대 사회의 필수적인 부분이 되었습니다.",
    "의료에서 교육까지, AI는 우리의 일과 삭의 방식을 변화시키고 있습니다.",
    "그러나 많은 사람들은 여전히 이 기술의 의미를 완전히 이해하지 모하고 있습니다."
  ],
  targetParagraphs: [
    "인공지능은 현대 사회의 필수적인 부분이 되었습니다. 의료에서 교육까지, AI는 우리의 일과 삭의 방식을 변화시키고 있습니다. 그러나 많은 사람들은 여전히 이 기술의 의미를 완전히 이해하지 모하고 있습니다."
  ],
  imageUrl: 'https://via.placeholder.com/1000x300',
  audioUrl: '#'
};

function ExamTestContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('id');
  const [selectedTab, setSelectedTab] = useState(0); // 문장/문단 탭 선택
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1시간
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState('sentence'); // 'sentence' | 'paragraph'

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDisplayItems = useCallback(() => {
    if (currentTab === 'sentence') {
      return {
        source: mockExamContent.sentences,
        target: mockExamContent.targetSentences || [],
        label: '문장'
      };
    } else {
      return {
        source: mockExamContent.paragraphs,
        target: mockExamContent.targetParagraphs || [],
        label: '문단'
      };
    }
  }, [currentTab]);

  const displayItems = getDisplayItems();

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSubmit = () => {
    if (window.confirm('시험을 제출하시겠습니까?')) {
      console.log('시험 제출:', answers);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* 1. Top: Exam Info */}
      <div className="border-b border-gray-200 px-6 py-4 bg-white">
        <div className="flex gap-4 items-start">
          {/* Left: Avatar + Info */}
          <div className="w-20 h-20 rounded-lg bg-gray-300 flex-shrink-0 overflow-hidden">
            <img src="https://via.placeholder.com/80" alt="프로필" className="w-full h-full object-cover" />
          </div>

          {/* Middle: Exam Details */}
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">
              <span className="text-gray-700">번역 자격증</span>
              <span className="ml-2 text-blue-600 font-semibold">전문1급</span>
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">시험명이 나오는 영역</h2>
            <div className="text-xs text-gray-600 mb-2">
              <span className="text-gray-700">번역 &gt;</span>
              <span className="ml-2">영상 &gt;</span>
              <span className="ml-2">다큐멘터리</span>
            </div>
            <p className="text-sm text-gray-600">A형 태국 여행에 대해 기획서를 작성해보시고.</p>
          </div>

          {/* Right: Timer + Language */}
          <div className="text-right flex-shrink-0">
            <div className="mb-3">
              <p className="text-xs text-gray-500">한국어 &gt;</p>
              <p className="text-sm text-blue-600 font-semibold">English</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
              <div className="text-white text-lg font-bold">5:00</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">09:00 - 09:15</p>
          </div>
        </div>
      </div>

      {/* 2. Problem Selection Tabs */}
      <div className="border-b border-gray-200 px-6 py-2 bg-white flex gap-4">
        <button className="px-3 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">
          문제1
        </button>
        <button className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          문제2
        </button>
        <button className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          문제3
        </button>
        <button className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          문제4
        </button>
        <button className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
          문제5
        </button>
      </div>

      {/* 3. Control Bar */}
      <div className="border-b border-gray-200 px-6 py-3 bg-white flex items-center justify-between">
        {/* Left: Audio & Reset */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded" title="음성 내보내기">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          </button>
        </div>

        {/* Middle: Tabs & Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('sentence')}
            className={`px-3 py-1 text-xs font-semibold ${currentTab === 'sentence' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700'} rounded`}
          >
            문장
          </button>
          <button
            onClick={() => setCurrentTab('paragraph')}
            className={`px-3 py-1 text-xs font-semibold ${currentTab === 'paragraph' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700'} rounded`}
          >
            문단
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded" title="리셋">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded" title="보기">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded" title="전체화면">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6v4m11-5h4v4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Right: Submit */}
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">
          제출하기
        </button>
      </div>

      {/* 4. Problem Image */}
      <div className="border-b border-gray-200 flex-shrink-0 px-6 py-4 bg-white">
        <div className="bg-gray-100 rounded-lg h-40 overflow-hidden">
          <img src="https://via.placeholder.com/1200x300" alt="문제" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* 5. 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Source */}
        <div className="flex-1 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-600">원문</h3>
            <button className="p-1 hover:bg-gray-200 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6v4m11-5h4v4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 text-xs text-gray-700 leading-relaxed">
            {currentTab === 'sentence' ? (
              <div className="space-y-2">
                {mockExamContent.sentences.map((sentence, index) => (
                  <div key={index} className="pb-2" style={{borderBottom: '1px dashed #d1d5db'}}>
                    {sentence}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {mockExamContent.paragraphs.map((paragraph, index) => (
                  <div key={index} className="pb-2" style={{borderBottom: '1px solid #d1d5db'}}>
                    {paragraph}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: AI Translation */}
        <div className="flex-1 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-yellow-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-600">AI 번역기</h3>
            <div className="flex items-center gap-1">
              <button className="px-2 py-0.5 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                ChatGPT
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6v4m11-5h4v4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 text-xs text-gray-700 leading-relaxed bg-yellow-50">
            {currentTab === 'sentence' ? (
              <div className="space-y-2">
                {mockExamContent.targetSentences.map((sentence, index) => (
                  <div key={index} className="pb-2" style={{borderBottom: '1px dashed #fcd34d'}}>
                    {sentence}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {mockExamContent.targetParagraphs.map((paragraph, index) => (
                  <div key={index} className="pb-2" style={{borderBottom: '1px solid #fcd34d'}}>
                    {paragraph}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: My Answer */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-blue-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-600">내 답안</h3>
            <button className="p-1 hover:bg-gray-200 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6v4m11-5h4v4M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <textarea
            placeholder="답안을 입력하세요."
            className="flex-1 p-3 text-xs border-0 resize-none focus:outline-none focus:ring-0 focus:ring-offset-0"
          />
          <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex gap-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-100">
              저장
            </button>
            <button className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">
              제출
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamTestPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">로딩 중...</div>}>
      <ExamTestContent />
    </Suspense>
  );
}
