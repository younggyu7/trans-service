'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, HelpCircle } from 'lucide-react';

// 카테고리 (대/중/소)
const MAIN_CATEGORIES = [
  { id: 'law', label: '법률' },
  { id: 'business', label: '비즈니스' },
  { id: 'medical', label: '의료' },
  { id: 'tech', label: '기술' },
  { id: 'general', label: '일반' },
];

const MIDDLE_CATEGORIES: Record<string, { id: string; label: string }[]> = {
  law: [
    { id: 'law-domestic', label: '국내 법률' },
    { id: 'law-international', label: '국제 법률' },
  ],
  business: [
    { id: 'biz-marketing', label: '마케팅' },
    { id: 'biz-contract', label: '계약/영업' },
  ],
  medical: [
    { id: 'med-general', label: '일반 의료' },
    { id: 'med-pharma', label: '제약' },
  ],
  tech: [
    { id: 'tech-manual', label: '매뉴얼' },
    { id: 'tech-spec', label: '기술 명세' },
  ],
  general: [
    { id: 'gen-document', label: '일반 문서' },
    { id: 'gen-etc', label: '기타' },
  ],
};

const DETAIL_CATEGORIES: Record<string, { id: string; label: string }[]> = {
  'law-domestic': [
    { id: 'law-domestic-complaint', label: '고소장' },
    { id: 'law-domestic-contract', label: '계약서' },
  ],
  'law-international': [
    { id: 'law-international-contract', label: '국제 계약서' },
  ],
  'biz-marketing': [
    { id: 'biz-marketing-copy', label: '카피라이팅' },
  ],
};

// 언어 + 티어
const LANGUAGE_TIERS = {
  tier1: { id: 'tier1', label: 'Tier1', display: 'Tier1' },
  tier2: { id: 'tier2', label: 'Tier2', display: 'Tier2' },
  tier3: { id: 'tier3', label: 'Tier3', display: 'Tier3' },
};

const LANGUAGES = [
  { code: 'ko', name: '한국어', tier: 'tier1' },
  { code: 'en', name: '영어', tier: 'tier1' },
  { code: 'zh', name: '중국어', tier: 'tier1' },
  { code: 'ja', name: '일어', tier: 'tier1' },
  { code: 'ar', name: '아랍어', tier: 'tier2' },
  { code: 'vi', name: '베트남어', tier: 'tier2' },
  { code: 'fr', name: '프랑스어', tier: 'tier2' },
  { code: 'de', name: '독일어', tier: 'tier2' },
];

const AI_MODELS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'wrtn', label: 'wrtn.' },
  { id: 'other', label: '다른 AI' },
];

const TONES = [
  { id: 'formal', label: '공식적인' },
  { id: 'casual', label: '일상적인' },
  { id: 'technical', label: '기술적' },
  { id: 'creative', label: '창의적' },
];

const HUMAN_WORK_TYPES = [
  { id: 'none', label: '요청 없음' },
  { id: 'review', label: '감수 요청' },
  { id: 'edit', label: '에디팅 요청' },
];

const HUMAN_LEVELS = [
  { id: 'standard', label: '일반 전문가' },
  { id: 'senior', label: '고급전문가' },
];

function getLanguageLabel(code: string) {
  const lang = LANGUAGES.find((l) => l.code === code);
  if (!lang) return '';
  const tier = LANGUAGE_TIERS[lang.tier as keyof typeof LANGUAGE_TIERS];
  return `${lang.name} (${tier.display})`;
}

export default function NewRequestPage() {
  const router = useRouter();

  // 카테고리
  const [mainCategory, setMainCategory] = useState<string>('law');
  const [middleCategory, setMiddleCategory] = useState<string>('law-domestic');
  const [detailCategory, setDetailCategory] = useState<string>('law-domestic-complaint');

  // 언어
  const [sourceLang, setSourceLang] = useState<string>('ko');
  const [targetLang, setTargetLang] = useState<string>('en');

  // AI / 에디터 / 휴먼 작업
  const [selectedModels, setSelectedModels] = useState<string[]>(['chatgpt']);
  const [tone, setTone] = useState<string>('formal');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [useEditor, setUseEditor] = useState<'use' | 'no'>('use');
  const [humanWorkType, setHumanWorkType] = useState<string>('review');
  const [humanLevel, setHumanLevel] = useState<string>('senior');
  const [isUrgentFlag, setIsUrgentFlag] = useState<boolean>(false);
  const [settingUse, setSettingUse] = useState<'use' | 'no'>('use');

  // 언어설정
  const [autoSourceMode, setAutoSourceMode] = useState<'detect' | 'fixed'>('detect');
  const [preferredTargets, setPreferredTargets] = useState<string[]>(['en']);

  // 파일
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);

  const [errors, setErrors] = useState<string[]>([]);

  const handleModelToggle = (id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handlePreferredTargetToggle = (code: string) => {
    setPreferredTargets((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleFileChange = (e: any) => {
    const fileList: FileList | null = e.target.files;
    if (!fileList) return;
    const next = Array.from(fileList).map((f) => ({ name: f.name, size: f.size }));
    setFiles(next);
  };

  const handleNext = () => {
    const newErrors: string[] = [];

    if (!mainCategory || !middleCategory || !detailCategory) {
      newErrors.push('카테고리를 모두 선택해주세요.');
    }
    if (!sourceLang || !targetLang) {
      newErrors.push('출발어와 도착어를 선택해주세요.');
    }
    if (sourceLang === targetLang) {
      newErrors.push('출발어와 도착어는 서로 다른 언어여야 합니다.');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      mainCategory,
      middleCategory,
      detailCategory,
      sourceLang,
      targetLang,
      aiModels: selectedModels,
      tone,
      customPrompt,
      useEditor,
      humanWorkType,
      humanLevel,
      isUrgentFlag,
      settingUse,
      languageSettings: {
        autoSourceMode,
        preferredTargets,
      },
      files,
    };

    sessionStorage.setItem('translationRequest', JSON.stringify(payload));
    router.push('/translate/client/request/new/step2');
  };

  const middleOptions = MIDDLE_CATEGORIES[mainCategory] ?? [];
  const detailOptions = DETAIL_CATEGORIES[middleCategory] ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">새 번역 의뢰</h1>
          <p className="text-sm text-gray-600">카테고리, 언어, AI 설정, 휴먼 작업, 언어설정, 파일까지 한 번에 입력합니다.</p>
        </header>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <ul className="space-y-1 text-sm text-red-700">
              {errors.map((err, idx) => (
                <li key={idx}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-8 bg-white rounded-xl shadow p-6">
          {/* 카테고리 선택 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">카테고리 선택</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[140px]"
                value={mainCategory}
                onChange={(e) => {
                  const nextMain = e.target.value;
                  setMainCategory(nextMain);
                  const firstMiddle = (MIDDLE_CATEGORIES[nextMain] ?? [])[0]?.id ?? '';
                  setMiddleCategory(firstMiddle);
                  const firstDetail = (firstMiddle && DETAIL_CATEGORIES[firstMiddle]?.[0]?.id) || '';
                  setDetailCategory(firstDetail);
                }}
              >
                {MAIN_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[150px]"
                value={middleCategory}
                onChange={(e) => {
                  const nextMid = e.target.value;
                  setMiddleCategory(nextMid);
                  const firstDetail = DETAIL_CATEGORIES[nextMid]?.[0]?.id || '';
                  setDetailCategory(firstDetail);
                }}
              >
                {middleOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[150px]"
                value={detailCategory}
                onChange={(e) => setDetailCategory(e.target.value)}
              >
                {detailOptions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>

            </div>
          </section>

          {/* 언어 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">언어</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">출발어</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {getLanguageLabel(lang.code)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">도착어</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {getLanguageLabel(lang.code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 사용 AI */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">사용 AI</h2>
            <div className="flex flex-wrap gap-4 text-sm">
              {AI_MODELS.map((m) => (
                <label key={m.id} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(m.id)}
                    onChange={() => handleModelToggle(m.id)}
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">톤</p>
                <div className="flex flex-wrap gap-3 text-xs">
                  {TONES.map((t) => (
                    <label key={t.id} className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="tone"
                        value={t.id}
                        checked={tone === t.id}
                        onChange={(e) => setTone(e.target.value)}
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">커스텀 프롬프트 (선택)</p>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs"
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="예: 법률 용어는 원문 유지, 매우 자연스럽게 번역 등"
                />
              </div>
            </div>
          </section>

          {/* 양식 에디터 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">양식 에디터</h2>
            <div className="flex gap-6 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="editor"
                  value="use"
                  checked={useEditor === 'use'}
                  onChange={() => setUseEditor('use')}
                />
                <span>에디터 사용</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="editor"
                  value="no"
                  checked={useEditor === 'no'}
                  onChange={() => setUseEditor('no')}
                />
                <span>에디터 미사용</span>
              </label>
            </div>
          </section>

          {/* 휴먼 작업 요청 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">휴먼 작업 요청</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[130px]"
                value={humanWorkType}
                onChange={(e) => setHumanWorkType(e.target.value)}
              >
                {HUMAN_WORK_TYPES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[130px]"
                value={humanLevel}
                onChange={(e) => setHumanLevel(e.target.value)}
              >
                {HUMAN_LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isUrgentFlag}
                  onChange={(e) => setIsUrgentFlag(e.target.checked)}
                />
                <span>긴급</span>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </label>
            </div>
          </section>

          {/* 설정 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">설정</h2>
            <div className="flex gap-6 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="setting-use"
                  value="use"
                  checked={settingUse === 'use'}
                  onChange={() => setSettingUse('use')}
                />
                <span>사용</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="setting-use"
                  value="no"
                  checked={settingUse === 'no'}
                  onChange={() => setSettingUse('no')}
                />
                <span>미사용</span>
              </label>
            </div>
          </section>

          {/* 언어설정 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">언어설정</h2>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-gray-600">출발어:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-1.5 text-xs"
                value={autoSourceMode}
                onChange={(e) => setAutoSourceMode(e.target.value as 'detect' | 'fixed')}
              >
                <option value="detect">언어 감지</option>
                <option value="fixed">직접 지정</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {LANGUAGES.map((lang) => (
                <label key={lang.code} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferredTargets.includes(lang.code)}
                    onChange={() => handlePreferredTargetToggle(lang.code)}
                  />
                  <span>{getLanguageLabel(lang.code)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 첨부파일 */}
          <section>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">첨부 파일</h2>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="text-sm"
            />
            {files.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-gray-700">
                {files.map((f) => (
                  <li key={f.name}>
                    {f.name} ({Math.round(f.size / 1024)} KB)
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* 다음 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
          >
            다음 단계
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
