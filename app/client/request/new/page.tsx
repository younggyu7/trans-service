'use client';

import { useState } from 'react';

export default function NewRequestPage() {
  const [formData, setFormData] = useState({
    title: '',
    sourceLanguage: 'ko',
    targetLanguage: 'en',
    documentType: 'general',
    deadline: '',
    wordCount: '',
    specialInstructions: '',
    hasUrgent: false,
    hasCertification: false,
  });

  const [estimatedPrice, setEstimatedPrice] = useState({
    basePrice: 0,
    urgentFee: 0,
    certificationFee: 0,
    total: 0,
  });

  const calculatePrice = () => {
    const wordCount = parseInt(formData.wordCount) || 0;
    const baseRate = 100; // 단어당 100원
    const base = wordCount * baseRate;
    const urgent = formData.hasUrgent ? base * 0.3 : 0;
    const certification = formData.hasCertification ? 50000 : 0;
    
    setEstimatedPrice({
      basePrice: base,
      urgentFee: urgent,
      certificationFee: certification,
      total: base + urgent + certification,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">홈 &gt; 번역 의뢰하기</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">번역 의뢰하기</h1>
        <p className="text-gray-600">번역 요청 정보를 입력해주세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 메인 폼 */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                문서 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 사업 계획서"
              />
            </div>

            {/* 언어 선택 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  원본 언어 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sourceLanguage}
                  onChange={(e) => setFormData({ ...formData, sourceLanguage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ko">한국어</option>
                  <option value="en">영어</option>
                  <option value="ja">일본어</option>
                  <option value="zh">중국어</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  번역 언어 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.targetLanguage}
                  onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">영어</option>
                  <option value="ko">한국어</option>
                  <option value="ja">일본어</option>
                  <option value="zh">중국어</option>
                </select>
              </div>
            </div>

            {/* 문서 유형 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                문서 유형 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['일반', '비즈니스', '기술', '법률', '의료', '학술'].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="documentType"
                      value={type}
                      checked={formData.documentType === type}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 분량 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                예상 분량 (단어 수) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.wordCount}
                onChange={(e) => {
                  setFormData({ ...formData, wordCount: e.target.value });
                  calculatePrice();
                }}
                onBlur={calculatePrice}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>

            {/* 파일 업로드 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                파일 첨부 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-gray-600 mb-1">클릭하거나 파일을 드래그하여 업로드</p>
                <p className="text-xs text-gray-500">PDF, DOCX, TXT, HWP (최대 10MB)</p>
                <input type="file" className="hidden" />
              </div>
            </div>

            {/* 마감일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                희망 마감일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 추가 옵션 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">추가 옵션</label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasUrgent}
                    onChange={(e) => {
                      setFormData({ ...formData, hasUrgent: e.target.checked });
                      calculatePrice();
                    }}
                    className="mr-3"
                  />
                  <span className="text-sm">긴급 번역 (기본 요금의 30% 추가)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasCertification}
                    onChange={(e) => {
                      setFormData({ ...formData, hasCertification: e.target.checked });
                      calculatePrice();
                    }}
                    className="mr-3"
                  />
                  <span className="text-sm">공증 번역 필요 (+50,000원)</span>
                </label>
              </div>
            </div>

            {/* 특수 요구사항 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">특수 요구사항</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="번역 시 주의사항이나 특별히 요청하고 싶은 사항을 입력해주세요"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
              >
                견적 요청
              </button>
            </div>
          </form>
        </div>

        {/* 가격 계산 패널 */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              예상 견적
            </h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-600">기본 번역료</span>
                <span className="font-bold text-blue-600">₩{estimatedPrice.basePrice.toLocaleString()}</span>
              </div>
              {formData.hasUrgent && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">긴급 추가 요금</span>
                  <span className="font-bold text-blue-600">₩{estimatedPrice.urgentFee.toLocaleString()}</span>
                </div>
              )}
              {formData.hasCertification && (
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">공증 번역 비용</span>
                  <span className="font-bold text-blue-600">₩{estimatedPrice.certificationFee.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 rounded-lg text-center">
                <div className="text-xs opacity-90 mb-2">총 예상 금액</div>
                <div className="text-3xl font-bold mb-1">₩{estimatedPrice.total.toLocaleString()}</div>
                <div className="text-xs opacity-80">VAT 포함</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-gray-600">
              <strong className="text-blue-600">안내:</strong> 실제 견적은 번역가 매칭 후 확정됩니다.
            </div>

            <a
              href="/payment-guide"
              target="_blank"
              className="block w-full mt-4 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition-colors text-center"
            >
              📋 가격표 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
