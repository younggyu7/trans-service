'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">관리자 대시보드</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">플랫폼 관리</h1>
          <p className="text-gray-600">번역 플랫폼의 전체 서비스를 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/pricing">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">💰</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">가격 및 요금</h2>
              <p className="text-sm text-gray-600">번역 서비스 가격 및 할인율 설정</p>
            </div>
          </Link>

          <Link href="/admin/translators">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">👥</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">번역사 관리</h2>
              <p className="text-sm text-gray-600">번역사 정보 및 평점 관리</p>
            </div>
          </Link>

          <Link href="/admin/requests">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">📋</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">번역 요청 관리</h2>
              <p className="text-sm text-gray-600">모든 번역 요청 현황 모니터링</p>
            </div>
          </Link>

          <Link href="/admin/payments">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">💳</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">결제 관리</h2>
              <p className="text-sm text-gray-600">결제 내역 및 매출 통계</p>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">사용자 관리</h2>
              <p className="text-sm text-gray-600">사용자 계정 및 권한 관리</p>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">⚙️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">시스템 설정</h2>
              <p className="text-sm text-gray-600">플랫폼 전체 설정 및 정책</p>
            </div>
          </Link>

          {/* 시험 관리 */}
          <Link href="/admin/exams">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">시험 관리</h2>
              <p className="text-sm text-gray-600">시험 템플릿, 일정, 출제자 배정 및 응시 현황 관리</p>
            </div>
          </Link>

          {/* 출제 현황 */}
          <Link href="/admin/exams/status">
            <div className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-4xl mb-3">✏️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">출제 현황</h2>
              <p className="text-sm text-gray-600">출제자에게 배정된 시험과 출제 진행 상태를 확인합니다</p>
            </div>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">총 번역사</div>
            <div className="text-3xl font-bold text-purple-600">127명</div>
            <p className="text-xs text-gray-500 mt-2">+12 this month</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">진행 중인 번역</div>
            <div className="text-3xl font-bold text-blue-600">43건</div>
            <p className="text-xs text-gray-500 mt-2">평균 대기 시간 2.4일</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">이번 달 매출</div>
            <div className="text-3xl font-bold text-green-600">₩8.5M</div>
            <p className="text-xs text-gray-500 mt-2">+18% vs last month</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-2">고객 만족도</div>
            <div className="text-3xl font-bold text-yellow-600">4.7★</div>
            <p className="text-xs text-gray-500 mt-2">1,234 reviews</p>
          </div>
        </div>
      </main>
    </div>
  );
}
