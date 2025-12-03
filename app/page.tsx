export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">통합 번역 플랫폼</h1>
        <p className="text-xl text-gray-600 mb-12">시험 응시 및 번역 서비스를 한 곳에서</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* 시험 응시 */}
          <a 
            href="/mypage/available"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">시험 응시</h2>
            <p className="text-gray-600">번역 시험 마이페이지</p>
          </a>

          {/* 번역 서비스 */}
          <a 
            href="/translate"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">번역 서비스</h2>
            <p className="text-gray-600">번역 의뢰 및 번역가 관리</p>
          </a>

          {/* 문제은행 */}
          <a 
            href="/question-bank"
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">문제은행</h2>
            <p className="text-gray-600">문제 관리 및 출제</p>
          </a>
        </div>
      </div>
    </div>
  );
}
