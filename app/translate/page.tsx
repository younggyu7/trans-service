'use client';

import Link from 'next/link';

export default function TranslatePage() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">번역 서비스</h1>
        <p className="text-lg text-gray-600">원하는 서비스를 선택하세요</p>
      </div>

      {/* 서비스 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 번역 의뢰하기 */}
        <Link href="/translate/client/request/new">
          <div className="block h-full p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-400">
            <div className="text-6xl mb-6 text-center">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">번역 의뢰</h2>
            <p className="text-gray-600 text-center mb-6">
              AI 번역부터 휴먼 검수까지, 원하는 대로 설정하고 신청하세요
            </p>
            <div className="flex items-center justify-center text-blue-600 font-semibold">
              의뢰 시작 →
            </div>
          </div>
        </Link>

        {/* 전체 의뢰 (원페이지) */}
        <Link href="/translate/client/request/all">
          <div className="block h-full p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-400">
            <div className="text-6xl mb-6 text-center">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">전체 의뢰 페이지</h2>
            <p className="text-gray-600 text-center mb-6">
              STEP 1 · STEP 2 모든 설정을 한 화면에서 입력하고 바로 의뢰합니다.
            </p>
            <div className="flex items-center justify-center text-green-600 font-semibold">
              원페이지 의뢰 시작 →
            </div>
          </div>
        </Link>

        {/* 번역사 페이지 */}
        <Link href="/translate/translator/requests">
          <div className="block h-full p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-400">
            <div className="text-6xl mb-6 text-center">🌐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">번역가</h2>
            <p className="text-gray-600 text-center mb-6">
              신규 요청을 확인하고 번역 작업을 수행하세요
            </p>
            <div className="flex items-center justify-center text-purple-600 font-semibold">
              번역 작업 보기 →
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
