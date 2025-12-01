'use client';

export default function AvailableExamsPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>홈</span>
        <span>{'>'}</span>
        <span>마이페이지</span>
        <span>{'>'}</span>
        <span className="text-gray-900 font-semibold">시험응시</span>
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8 text-gray-900">시험응시</h1>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-gray-200">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">현재 등록 가능한 시험이 없습니다.</p>
      </div>
    </div>
  );
}
