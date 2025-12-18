'use client';

import Link from 'next/link';
import { usePrice, type PriceSettings } from '@/lib/priceContext';
import { useLanguageConfig, type LanguageTier } from '@/lib/languageConfig';
import { useState } from 'react';

const TIER_LABELS: Record<LanguageTier, string> = {
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  tier3: 'Tier 3',
  tier4: 'Tier 4',
};

export default function AdminPricingPage() {
  const { prices, updatePrices } = usePrice();
  const {
    languages,
    tierMultipliers,
    updateLanguage,
    updateTierMultiplier,
    addLanguage,
    removeLanguage,
  } = useLanguageConfig();
  const [saved, setSaved] = useState(false);
  const [priceTableType, setPriceTableType] = useState<'client' | 'translator'>('client');
  const [selectedLargeCategory, setSelectedLargeCategory] = useState<string | null>(null);
  const [selectedMidCategory, setSelectedMidCategory] = useState<string | null>(null);
  
  // 현재 선택된 가격표 (의뢰자 또는 번역사)
  const currentPrices = priceTableType === 'client' ? prices.clientPrices : prices.translatorPrices;

  const handleAddLanguage = (tier: LanguageTier) => {
    const code = window.prompt('언어 코드를 입력하세요 (예: es)');
    if (!code) return;
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    const name = window.prompt('언어 이름을 입력하세요 (예: 스페인어)') ?? '';
    const trimmedName = name.trim() || trimmedCode;

    addLanguage({
      code: trimmedCode,
      name: trimmedName,
      tier,
      enabled: true,
    });
    setSaved(false);
  };

  const handleRemoveLanguage = (code: string) => {
    if (!window.confirm('이 언어를 목록에서 삭제하시겠습니까?')) return;
    removeLanguage(code);
    setSaved(false);
  };

  const handleChange = (key: keyof PriceSettings, value: number) => {
    updatePrices({ [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    alert('가격이 저장되었습니다! (모든 페이지에 반영되었습니다)');
    setSaved(true);
  };

  // 소 카테고리 추가
  const handleAddSmallCategory = (midCategoryKey: string) => {
    const name = window.prompt('소 카테고리 이름을 입력하세요');
    if (!name || !name.trim()) return;
    
    const currentSmall = currentPrices.category_small || {};
    const midCategory = currentSmall[midCategoryKey] || {};
    
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_small: {
          ...currentSmall,
          [midCategoryKey]: {
            ...midCategory,
            [name.trim()]: 0,
          },
        },
      },
    });
    setSaved(false);
  };

  // 소 카테고리 삭제
  const handleRemoveSmallCategory = (midCategoryKey: string, smallCategoryName: string) => {
    if (!window.confirm(`"${smallCategoryName}" 소 카테고리를 삭제하시겠습니까?`)) return;
    
    const currentSmall = currentPrices.category_small || {};
    const midCategory = { ...(currentSmall[midCategoryKey] || {}) };
    delete midCategory[smallCategoryName];
    
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_small: {
          ...currentSmall,
          [midCategoryKey]: midCategory,
        },
      },
    });
    setSaved(false);
  };

  // 소 카테고리 가격 변경
  const handleChangeSmallCategory = (midCategoryKey: string, smallCategoryName: string, value: number) => {
    const currentSmall = currentPrices.category_small || {};
    const midCategory = { ...(currentSmall[midCategoryKey] || {}) };
    midCategory[smallCategoryName] = value;
    
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_small: {
          ...currentSmall,
          [midCategoryKey]: midCategory,
        },
      },
    });
    setSaved(false);
  };

  // 대 카테고리 추가
  const handleAddLargeCategory = () => {
    const name = window.prompt('대 카테고리 이름을 입력하세요');
    if (!name || !name.trim()) return;
    
    const icon = window.prompt('아이콘을 입력하세요 (예: 📹, 🎤)') || '📁';
    const key = `large_${Date.now()}`;
    
    const currentLarge = currentPrices.category_large || {};
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_large: {
          ...currentLarge,
          [key]: {
            name: name.trim(),
            icon: icon.trim(),
            price: 0,
          },
        },
      },
    });
    setSaved(false);
  };

  // 대 카테고리 삭제
  const handleRemoveLargeCategory = (largeKey: string) => {
    if (!window.confirm(`"${currentPrices.category_large[largeKey]?.name}" 대 카테고리를 삭제하시겠습니까? 하위 카테고리도 모두 삭제됩니다.`)) return;
    
    const currentLarge = { ...(currentPrices.category_large || {}) };
    delete currentLarge[largeKey];
    
    // 해당 대 카테고리의 중 카테고리도 삭제
    const currentMid = { ...(currentPrices.category_mid || {}) };
    delete currentMid[largeKey];
    
    // 해당 대 카테고리의 중 카테고리에 속한 소 카테고리도 삭제
    const currentSmall = { ...(currentPrices.category_small || {}) };
    if (currentPrices.category_mid?.[largeKey]) {
      Object.keys(currentPrices.category_mid[largeKey]).forEach((midKey) => {
        delete currentSmall[midKey];
      });
    }
    
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_large: currentLarge,
        category_mid: currentMid,
        category_small: currentSmall,
      },
    });
    
    if (selectedLargeCategory === largeKey) {
      setSelectedLargeCategory(null);
      setSelectedMidCategory(null);
    }
    setSaved(false);
  };

  // 대 카테고리 가격 변경
  const handleChangeLargeCategoryPrice = (largeKey: string, value: number) => {
    const currentLarge = { ...(currentPrices.category_large || {}) };
    if (currentLarge[largeKey]) {
      currentLarge[largeKey] = {
        ...currentLarge[largeKey],
        price: value,
      };
      const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
      updatePrices({
        [priceKey]: {
          category_large: currentLarge,
        },
      });
      setSaved(false);
    }
  };

  // 중 카테고리 추가
  const handleAddMidCategory = (largeKey: string) => {
    const name = window.prompt('중 카테고리 이름을 입력하세요');
    if (!name || !name.trim()) return;
    
    const key = `mid_${largeKey}_${Date.now()}`;
    const currentMid = currentPrices.category_mid || {};
    const largeMid = currentMid[largeKey] || {};
    
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_mid: {
          ...currentMid,
          [largeKey]: {
            ...largeMid,
            [key]: {
              name: name.trim(),
              price: 0,
            },
          },
        },
      },
    });
    setSaved(false);
  };

  // 중 카테고리 삭제
  const handleRemoveMidCategory = (largeKey: string, midKey: string) => {
    if (!window.confirm(`"${currentPrices.category_mid[largeKey]?.[midKey]?.name}" 중 카테고리를 삭제하시겠습니까? 하위 소 카테고리도 모두 삭제됩니다.`)) return;
    
    const currentMid = { ...(currentPrices.category_mid || {}) };
    const largeMid = { ...(currentMid[largeKey] || {}) };
    delete largeMid[midKey];
    currentMid[largeKey] = largeMid;
    
    // 해당 중 카테고리의 소 카테고리도 삭제
    const currentSmall = { ...(currentPrices.category_small || {}) };
    delete currentSmall[midKey];
    
    const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
    updatePrices({
      [priceKey]: {
        category_mid: currentMid,
        category_small: currentSmall,
      },
    });
    
    if (selectedMidCategory === midKey) {
      setSelectedMidCategory(null);
    }
    setSaved(false);
  };

  // 중 카테고리 가격 변경
  const handleChangeMidCategoryPrice = (largeKey: string, midKey: string, value: number) => {
    const currentMid = { ...(currentPrices.category_mid || {}) };
    const largeMid = { ...(currentMid[largeKey] || {}) };
    if (largeMid[midKey]) {
      largeMid[midKey] = {
        ...largeMid[midKey],
        price: value,
      };
      currentMid[largeKey] = largeMid;
      const priceKey = priceTableType === 'client' ? 'clientPrices' : 'translatorPrices';
      updatePrices({
        [priceKey]: {
          category_mid: currentMid,
        },
      });
      setSaved(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 text-sm">
            ← 관리자 대시보드
          </Link>
          <div className="text-2xl font-bold">가격 및 요금 관리</div>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">가격 설정</h1>
          <p className="text-gray-600">번역 서비스의 모든 가격을 관리하세요</p>
        </div>

        {/* 가격표 타입 선택 탭 */}
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">가격표 타입:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPriceTableType('client');
                  setSelectedLargeCategory(null);
                  setSelectedMidCategory(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priceTableType === 'client'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                의뢰자 가격표
              </button>
              <button
                onClick={() => {
                  setPriceTableType('translator');
                  setSelectedLargeCategory(null);
                  setSelectedMidCategory(null);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priceTableType === 'translator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                번역사 가격표
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 0. 언어 / 티어 설정 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              0️⃣ 언어 및 티어 설정
            </h2>

            {/* 티어별 계수 */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">티어별 계수 (가격 배수)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                {(Object.keys(TIER_LABELS) as LanguageTier[]).map((tier) => (
                  <div key={tier} className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                    <div className="text-xs text-gray-600 mb-1">{TIER_LABELS[tier]}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">×</span>
                      <input
                        type="number"
                        step="0.1"
                        min={0.1}
                        value={tierMultipliers[tier]}
                        onChange={(e) => {
                          updateTierMultiplier(tier, Number(e.target.value));
                          setSaved(false);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 언어별 티어 및 사용 여부 (티어별 박스) */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">티어별 언어 구성</h3>
              <p className="text-xs text-gray-500 mb-3">
                각 티어 박스에서 언어를 추가/삭제하고, 사용 여부를 설정할 수 있습니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(TIER_LABELS) as LanguageTier[]).map((tier) => {
                  const tierLanguages = languages.filter((l) => l.tier === tier);
                  return (
                    <div
                      key={tier}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {TIER_LABELS[tier]}
                          </div>
                          <div className="text-xs text-gray-500">
                            현재 언어 {tierLanguages.length}개
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddLanguage(tier)}
                          className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
                        >
                          언어 추가하기
                        </button>
                      </div>

                      {tierLanguages.length === 0 ? (
                        <div className="text-xs text-gray-400 border border-dashed border-gray-300 rounded-md px-3 py-4 text-center">
                          이 티어에 등록된 언어가 없습니다.
                        </div>
                      ) : (
                        <ul className="space-y-2 text-sm">
                          {tierLanguages.map((lang) => (
                            <li
                              key={lang.code}
                              className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-3 py-2"
                            >
                              <div>
                                <div className="text-sm text-gray-900">
                                  {lang.name}
                                  <span className="ml-2 text-xs text-gray-400">({lang.code})</span>
                                </div>
                                <label className="inline-flex items-center gap-1 mt-1 text-xs text-gray-700">
                                  <input
                                    type="checkbox"
                                    checked={lang.enabled}
                                    onChange={(e) => {
                                      updateLanguage(lang.code, { enabled: e.target.checked });
                                      setSaved(false);
                                    }}
                                  />
                                  <span>{lang.enabled ? '사용' : '미사용'}</span>
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveLanguage(lang.code)}
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                삭제
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-gray-500">
                활성화된 언어만 번역가 설정 페이지의 언어 선택 드롭다운 및 결제 안내 페이지의 언어 목록에 표시됩니다.
              </p>
            </div>
          </div>

          {/* 1. 번역 방식별 기본 요금 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              1️⃣ 번역 방식별 기본 요금
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번역사 - 텍스트 (₩/단어)
                </label>
                <input
                  type="number"
                  value={prices.translator_text}
                  onChange={(e) => handleChange('translator_text', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번역사 - 음성 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.translator_voice}
                  onChange={(e) => handleChange('translator_voice', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  번역사 - 동영상 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.translator_video}
                  onChange={(e) => handleChange('translator_video', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI - 텍스트 (₩/글자)
                </label>
                <input
                  type="number"
                  value={prices.ai_text}
                  onChange={(e) => handleChange('ai_text', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI - 음성 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.ai_voice}
                  onChange={(e) => handleChange('ai_voice', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI - 동영상 (₩/분)
                </label>
                <input
                  type="number"
                  value={prices.ai_video}
                  onChange={(e) => handleChange('ai_video', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 2. 전문 분야별 추가 요금 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              2️⃣ 전문 분야별 추가 요금 (₩/단어)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  마케팅
                </label>
                <input
                  type="number"
                  value={prices.marketing}
                  onChange={(e) => handleChange('marketing', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  법률
                </label>
                <input
                  type="number"
                  value={prices.law}
                  onChange={(e) => handleChange('law', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기술/IT
                </label>
                <input
                  type="number"
                  value={prices.tech}
                  onChange={(e) => handleChange('tech', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학술/논문
                </label>
                <input
                  type="number"
                  value={prices.academic}
                  onChange={(e) => handleChange('academic', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  의료/제약
                </label>
                <input
                  type="number"
                  value={prices.medical}
                  onChange={(e) => handleChange('medical', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  금융
                </label>
                <input
                  type="number"
                  value={prices.finance}
                  onChange={(e) => handleChange('finance', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 3. 긴급도 할증 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              3️⃣ 긴급도별 할증 (%)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급1 (3일)
                </label>
                <input
                  type="number"
                  value={prices.urgent1}
                  onChange={(e) => handleChange('urgent1', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">기본 금액 대비 할증 비율</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급2 (1일)
                </label>
                <input
                  type="number"
                  value={prices.urgent2}
                  onChange={(e) => handleChange('urgent2', Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">기본 금액 대비 할증 비율</p>
              </div>
            </div>
          </div>

          {/* 4. 매칭/결제 관련 추가 요금 설정 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 4-1. 매칭 방법별 추가 요금 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
                4️⃣ 매칭 방법별 추가 요금
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-gray-800 mb-1">직접 찾기</div>
                  <input
                    type="number"
                    value={prices.match_direct}
                    onChange={(e) => handleChange('match_direct', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">기본 금액 대비 추가 요금 (₩ 또는 % 기준 자유)</p>
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">매칭 요청</div>
                  <input
                    type="number"
                    value={prices.match_request}
                    onChange={(e) => handleChange('match_request', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">자동 매칭</div>
                  <input
                    type="number"
                    value={prices.match_auto}
                    onChange={(e) => handleChange('match_auto', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">기타(기업)</div>
                  <input
                    type="number"
                    value={prices.match_corporate}
                    onChange={(e) => handleChange('match_corporate', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* 4-2. 결제 분류별 글자당 금액 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
                5️⃣ 결제 분류별 단가 (₩/글자)
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-gray-800 mb-1">포인트</div>
                  <input
                    type="number"
                    value={prices.payment_point_per_char}
                    onChange={(e) => handleChange('payment_point_per_char', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">구독</div>
                  <input
                    type="number"
                    value={prices.payment_subscribe_per_char}
                    onChange={(e) => handleChange('payment_subscribe_per_char', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">1회 결제</div>
                  <input
                    type="number"
                    value={prices.payment_oneoff_per_char}
                    onChange={(e) => handleChange('payment_oneoff_per_char', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* 4-3. 결제 내용별 금액 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
                6️⃣ 결제 내용별 금액 (₩)
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="font-medium text-gray-800 mb-1">포인트 충전</div>
                  <input
                    type="number"
                    value={prices.payment_point_charge}
                    onChange={(e) => handleChange('payment_point_charge', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">베이직 구독</div>
                  <input
                    type="number"
                    value={prices.payment_basic_sub}
                    onChange={(e) => handleChange('payment_basic_sub', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">스탠다드 구독</div>
                  <input
                    type="number"
                    value={prices.payment_standard_sub}
                    onChange={(e) => handleChange('payment_standard_sub', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">프리미엄 구독</div>
                  <input
                    type="number"
                    value={prices.payment_premium_sub}
                    onChange={(e) => handleChange('payment_premium_sub', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-800 mb-1">서비스 이용 (1회결제)</div>
                  <input
                    type="number"
                    value={prices.payment_service_use}
                    onChange={(e) => handleChange('payment_service_use', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 7. 카테고리별 추가 요금 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">
              7️⃣ 카테고리별 추가 요금 (₩/단어 또는 %)
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              AI번역 서비스의 카테고리별 추가 요금을 설정합니다. 트리 형식으로 대 → 중 → 소 카테고리를 선택하여 가격을 설정하세요.
            </p>

            {/* 트리 형식 3단 레이아웃 */}
            <div className="flex gap-4 h-[600px] border border-gray-200 rounded-lg overflow-hidden">
              {/* 왼쪽: 대 카테고리 */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">대 카테고리</h3>
                  <button
                    onClick={handleAddLargeCategory}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    + 추가
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {currentPrices.category_large && Object.keys(currentPrices.category_large).length > 0 ? (
                    Object.entries(currentPrices.category_large).map(([key, category]) => (
                      <div
                        key={key}
                        className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                          selectedLargeCategory === key
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedLargeCategory(key);
                          setSelectedMidCategory(null);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            {category.icon} {category.name}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLargeCategory(key);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">가격:</label>
                          <input
                            type="number"
                            value={category.price}
                            onChange={(e) => {
                              handleChangeLargeCategoryPrice(key, Number(e.target.value));
                              e.stopPropagation();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="기본 가격"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">대 카테고리가 없습니다</div>
                  )}
                </div>
              </div>

              {/* 중간: 중 카테고리 */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">중 카테고리</h3>
                    {selectedLargeCategory && (
                      <button
                        onClick={() => handleAddMidCategory(selectedLargeCategory)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        + 추가
                      </button>
                    )}
                  </div>
                  {selectedLargeCategory && currentPrices.category_large[selectedLargeCategory] && (
                    <p className="text-xs text-gray-500 mt-1">
                      {currentPrices.category_large[selectedLargeCategory].icon} {currentPrices.category_large[selectedLargeCategory].name} 선택됨
                    </p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {!selectedLargeCategory ? (
                    <div className="p-4 text-sm text-gray-500 text-center">대 카테고리를 선택하세요</div>
                  ) : currentPrices.category_mid?.[selectedLargeCategory] && Object.keys(currentPrices.category_mid[selectedLargeCategory]).length > 0 ? (
                    Object.entries(currentPrices.category_mid[selectedLargeCategory]).map(([key, category]) => (
                      <div
                        key={key}
                        className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                          selectedMidCategory === key
                            ? 'bg-blue-100 border-blue-300'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMidCategory(key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{category.name}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMidCategory(selectedLargeCategory, key);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            삭제
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">추가 가격:</label>
                          <input
                            type="number"
                            value={category.price}
                            onChange={(e) => {
                              handleChangeMidCategoryPrice(selectedLargeCategory, key, Number(e.target.value));
                              e.stopPropagation();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="추가 가격"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-gray-500 text-center">중 카테고리가 없습니다</div>
                  )}
                </div>
              </div>

              {/* 오른쪽: 소 카테고리 */}
              <div className="w-1/3 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">소 카테고리</h3>
                    {selectedMidCategory && (
                      <button
                        onClick={() => handleAddSmallCategory(selectedMidCategory)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        + 추가
                      </button>
                    )}
                  </div>
                  {selectedMidCategory && (
                    <p className="text-xs text-gray-500 mt-1">중 카테고리 선택됨</p>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  {!selectedMidCategory ? (
                    <div className="p-4 text-sm text-gray-500 text-center">중 카테고리를 선택하세요</div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {currentPrices.category_small?.[selectedMidCategory] && Object.keys(currentPrices.category_small[selectedMidCategory]).length > 0 ? (
                        Object.entries(currentPrices.category_small[selectedMidCategory]).map(([smallName, smallPrice]) => (
                          <div key={smallName} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-sm text-gray-900">{smallName}</div>
                              <button
                                onClick={() => handleRemoveSmallCategory(selectedMidCategory, smallName)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                삭제
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600">가격:</label>
                              <input
                                type="number"
                                value={smallPrice}
                                onChange={(e) => handleChangeSmallCategory(selectedMidCategory, smallName, Number(e.target.value))}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="가격"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-8">
                          소 카테고리가 없습니다.<br />
                          위의 &quot;+ 추가&quot; 버튼을 클릭하여 추가하세요.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              💾 가격 저장
            </button>
            {saved && (
              <div className="text-green-600 font-semibold flex items-center gap-2">
                ✅ 저장되었습니다
              </div>
            )}
          </div>
        </div>

        {/* 미리보기 */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 현재 가격표 미리보기</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">번역사 텍스트</div>
              <div className="text-lg font-bold text-purple-600">₩{prices.translator_text}/단어</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">AI 텍스트</div>
              <div className="text-lg font-bold text-blue-600">₩{prices.ai_text}/글자</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">의료/제약 추가</div>
              <div className="text-lg font-bold text-green-600">+₩{prices.medical}/단어</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">긴급1 할증</div>
              <div className="text-lg font-bold text-orange-600">+{prices.urgent1}%</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-xs text-gray-600">긴급2 할증</div>
              <div className="text-lg font-bold text-red-600">+{prices.urgent2}%</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
