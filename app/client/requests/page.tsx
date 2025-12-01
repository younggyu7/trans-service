'use client';

import { useState } from 'react';

const requests = [
  {
    id: 1,
    title: '비즈니스 계약서 번역 (한국어 → 영어)',
    field: '법률/계약',
    wordCount: '2,500 단어',
    price: '₩450,000',
    translator: '김영희 (A등급)',
    status: 'in-progress',
    progress: 65,
    registeredDate: '2024-11-20',
    deadline: '2024-12-05',
  },
  {
    id: 2,
    title: '의료 논문 번역 (영어 → 한국어)',
    field: '의료/제약',
    wordCount: '3,800 단어',
    price: '₩620,000',
    translator: '이철수 (A등급)',
    status: 'in-progress',
    progress: 30,
    registeredDate: '2024-11-22',
    deadline: '2024-12-10',
  },
  {
    id: 3,
    title: '마케팅 자료 번역 (한국어 → 영어)',
    field: '마케팅',
    wordCount: '1,200 단어',
    price: '₩180,000',
    translator: '미정',
    status: 'pending',
    progress: 0,
    registeredDate: '2024-11-25',
    deadline: '2024-12-08',
  },
];

export default function RequestsPage() {
  const [filter, setFilter] = useState('all');

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      'in-progress': { text: '진행중', className: 'bg-blue-100 text-blue-700' },
      pending: { text: '대기중', className: 'bg-yellow-100 text-yellow-700' },
      completed: { text: '완료', className: 'bg-green-100 text-green-700' },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">홈 &gt; 내 의뢰 목록</div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">내 번역 의뢰</h1>
          <button 
            onClick={() => window.location.href = '/client/request/new'}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            + 새 의뢰 등록
          </button>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-4xl mb-2">📋</div>
          <div className="text-sm text-gray-600 mb-1">전체 의뢰</div>
          <div className="text-2xl font-bold">12</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-4xl mb-2">⏱️</div>
          <div className="text-sm text-gray-600 mb-1">대기중</div>
          <div className="text-2xl font-bold">3</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-4xl mb-2">🔄</div>
          <div className="text-sm text-gray-600 mb-1">진행중</div>
          <div className="text-2xl font-bold">2</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-sm text-gray-600 mb-1">완료</div>
          <div className="text-2xl font-bold">7</div>
        </div>
      </div>

      {/* 탭 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            {[
              { key: 'all', label: '전체' },
              { key: 'pending', label: '대기중' },
              { key: 'in-progress', label: '진행중' },
              { key: 'completed', label: '완료' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                  filter === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 의뢰 목록 */}
        <div className="p-6 space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{request.title}</h3>
                    <p className="text-sm text-gray-600">
                      등록일: {request.registeredDate} | 마감일: {request.deadline}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">분야</div>
                    <div className="font-semibold">{request.field}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">분량</div>
                    <div className="font-semibold">{request.wordCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">비용</div>
                    <div className="font-semibold text-blue-600">{request.price}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">번역사</div>
                    <div className="font-semibold">{request.translator}</div>
                  </div>
                </div>

                {request.status === 'in-progress' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">번역 진행률</span>
                      <span className="font-semibold">{request.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${request.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">
                    상세보기
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">
                    메시지
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
