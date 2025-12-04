'use client';

import { useState } from 'react';
import { addDraft, type ExamDraft } from '@/lib/examDraftStore';

interface QuestionTypeSetting {
  id: string;
  kind: '객관식' | '주관식' | '서술형' | '번역' | '프롬프트' | 'custom';
  customLabel?: string; // kind === 'custom' 일 때 표시용 이름
  count: number;
}

interface ExamTemplate {
  id: string;
  name: string;
  type: '번역' | '프롬프트';
  mainCategory: string; // 대 카테고리
  middleCategory?: string; // 중 카테고리
  subCategory?: string; // 소 카테고리
  questionCount: number;
  questionTypes?: QuestionTypeSetting[]; // 문항 유형별 개수
  durationMinutes: number;
  status: 'draft' | 'ready' | 'open' | 'closed';
  assignedTranslatorId?: string; // 배정된 출제자 ID
  // 일정 & 조건 요약 (실제 저장 구조는 이후 확장)
  examDate?: string;
  scoringEndDate?: string;
  resultPublishDate?: string;
  registrationStart?: string;
  registrationEnd?: string;
  authorDeadline?: string;
  minApplicants?: number;
  baseFee?: number; // 단순 접수
  reviewFee?: number; // 검수 옵션
  passScore?: number;
}

// 카테고리 트리 (대 / 중 / 소)
const CATEGORY_TREE: Record<string, Record<string, string[]>> = {
  비즈니스: {
    '마케팅/기획': ['마케팅 제안서', '브랜딩 전략서'],
    '계약/법무': ['국내 계약서', '국제 계약서'],
  },
  일반: {
    '에세이/논술': ['시사 에세이', '자기소개서'],
  },
  기술: {
    '기술 문서': ['사용 설명서', '제품 스펙'],
  },
};

interface TranslatorInfo {
  id: string;
  name: string;
  languages: string;
  specialties: string;
  level: string;
}

const MOCK_TRANSLATORS: TranslatorInfo[] = [
  {
    id: 'tr-001',
    name: '김번역',
    languages: '한국어 → 영어, 영어 → 한국어',
    specialties: '비즈니스, 계약/법무',
    level: '전문1급',
  },
  {
    id: 'tr-002',
    name: '이프롬프트',
    languages: '한국어, 영어',
    specialties: '에세이/논술, 창의 글쓰기',
    level: '2급',
  },
  {
    id: 'tr-003',
    name: '박기술',
    languages: '한국어 → 영어',
    specialties: '기술 문서, 매뉴얼',
    level: '1급',
  },
];

const mockTemplates: ExamTemplate[] = [
  {
    id: 'exam-001',
    name: '전문1급 번역 시험 A형',
    type: '번역',
    mainCategory: '비즈니스',
    middleCategory: '마케팅/기획',
    subCategory: '마케팅 제안서',
    questionCount: 6,
    questionTypes: [
      { id: 'qt-1', kind: '객관식', count: 3 },
      { id: 'qt-2', kind: '주관식', count: 3 },
    ],
    durationMinutes: 90,
    status: 'open',
    assignedTranslatorId: 'tr-001',
    examDate: '2025-01-15',
    scoringEndDate: '2025-01-20',
    resultPublishDate: '2025-01-22',
    registrationStart: '2025-01-01',
    registrationEnd: '2025-01-10',
    authorDeadline: '2024-12-28',
    minApplicants: 10,
    baseFee: 30000,
    reviewFee: 50000,
    passScore: 60,
  },
  {
    id: 'exam-002',
    name: '프롬프트 작성 시험 B형',
    type: '프롬프트',
    mainCategory: '일반',
    middleCategory: '에세이/논술',
    subCategory: '시사 에세이',
    questionCount: 3,
    questionTypes: [{ id: 'qt-3', kind: '서술형', count: 3 }],
    durationMinutes: 60,
    status: 'draft',
    assignedTranslatorId: undefined,
    examDate: '2025-02-10',
    scoringEndDate: '2025-02-15',
    resultPublishDate: '2025-02-18',
    registrationStart: '2025-01-25',
    registrationEnd: '2025-02-05',
    authorDeadline: '2025-01-20',
    minApplicants: 5,
    baseFee: 20000,
    reviewFee: 40000,
    passScore: 70,
  },
];

export default function AdminExamsPage() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [pendingTranslatorId, setPendingTranslatorId] = useState<string | null>(null);

  const selectedExam = mockTemplates.find((e) => e.id === selectedExamId) ?? mockTemplates[0];

  // 문항 유형 설정 상태 (간단히 컴포넌트 로컬에서만 관리)
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeSetting[]>(
    selectedExam.questionTypes ?? [{ id: 'qt-init', kind: '객관식', count: selectedExam.questionCount }],
  );
  const totalQuestionCount = questionTypes.reduce((sum, qt) => sum + qt.count, 0);

  // 카테고리 선택 상태 (대/중/소)
  const [mainCategory, setMainCategory] = useState<string>(selectedExam.mainCategory);
  const [middleCategory, setMiddleCategory] = useState<string | ''>(selectedExam.middleCategory ?? '');
  const [subCategory, setSubCategory] = useState<string | ''>(selectedExam.subCategory ?? '');

  const middleOptions = mainCategory ? Object.keys(CATEGORY_TREE[mainCategory] ?? {}) : [];
  const subOptions =
    mainCategory && middleCategory
      ? CATEGORY_TREE[mainCategory]?.[middleCategory] ?? []
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">시험 관리</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 상단 요약 / 템플릿 불러오기 */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">시험 템플릿 및 일정 관리</h1>
            <p className="text-sm text-gray-600">
              시험 유형, 카테고리, 문제 수, 일정, 출제자 배정 등을 한 곳에서 관리합니다.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50">
              템플릿 불러오기
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700">
              새 시험 만들기
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
              onClick={() => {
                const draft: ExamDraft = {
                  id: `draft-${Date.now()}`,
                  templateId: selectedExam.id,
                  title: selectedExam.name,
                  type: selectedExam.type,
                  mainCategory,
                  middleCategory: middleCategory || undefined,
                  subCategory: subCategory || undefined,
                  questionCount: totalQuestionCount,
                  durationMinutes: selectedExam.durationMinutes,
                  assignedTranslatorId: selectedExam.assignedTranslatorId,
                  status: '출제중',
                };
                addDraft(draft);
                alert('출제본이 생성되었습니다. 출제 현황에서 확인하세요.');
              }}
            >
              출제하기
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 좌측: 시험 목록 */}
          <section className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">시험 목록</h2>
            <div className="space-y-2 max-h-[480px] overflow-y-auto text-sm">
              {mockTemplates.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`w-full text-left px-3 py-2 rounded-md border text-sm flex flex-col gap-1 ${
                    selectedExam?.id === exam.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 truncate mr-2">{exam.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        exam.status === 'open'
                          ? 'bg-green-100 text-green-700'
                          : exam.status === 'ready'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {exam.status === 'open'
                        ? '공개 중'
                        : exam.status === 'ready'
                        ? '출시 대기'
                        : '작성 중'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {exam.type} · {exam.mainCategory} · {exam.questionCount}문항 · {exam.durationMinutes}분
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 우측: 선택된 시험 상세 (스켈레톤) */}
          <section className="lg:col-span-2 space-y-6">
            {/* 1. 기본 정보 */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">1. 기본 정보</h2>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">시험명</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    defaultValue={selectedExam.name}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">유형</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                    defaultValue={selectedExam.type}
                  >
                    <option value="번역">번역</option>
                    <option value="프롬프트">프롬프트</option>
                  </select>
                </div>
                {/* 카테고리 선택 (대/중/소 한 줄) */}
                <div className="col-span-2 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[160px]">
                    <label className="block text-xs text-gray-600 mb-1">대 카테고리</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      value={mainCategory}
                      onChange={(e) => {
                        const nextMain = e.target.value;
                        setMainCategory(nextMain);
                        const mids = Object.keys(CATEGORY_TREE[nextMain] ?? {});
                        const firstMid = mids[0] ?? '';
                        setMiddleCategory(firstMid);
                        const firstSub = firstMid
                          ? CATEGORY_TREE[nextMain]?.[firstMid]?.[0] ?? ''
                          : '';
                        setSubCategory(firstSub);
                      }}
                    >
                      {Object.keys(CATEGORY_TREE).map((key) => (
                        <option key={key} value={key}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <label className="block text-xs text-gray-600 mb-1">중 카테고리 (선택)</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      value={middleCategory}
                      onChange={(e) => {
                        const nextMid = e.target.value;
                        setMiddleCategory(nextMid);
                        const firstSub =
                          nextMid && mainCategory
                            ? CATEGORY_TREE[mainCategory]?.[nextMid]?.[0] ?? ''
                            : '';
                        setSubCategory(firstSub);
                      }}
                    >
                      <option value="">선택 안 함</option>
                      {middleOptions.map((mid) => (
                        <option key={mid} value={mid}>
                          {mid}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <label className="block text-xs text-gray-600 mb-1">소 카테고리</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      disabled={!middleCategory}
                    >
                      {subOptions.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 문항 유형 / 수 / 시험 시간 */}
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-900">문항 유형 및 수</h3>
                  <button
                    type="button"
                    className="px-2 py-1 rounded-md border border-gray-300 text-[11px] text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                      setQuestionTypes((prev) => [
                        ...prev,
                        { id: `qt-${Date.now()}`, kind: '객관식', count: 1 },
                      ])
                    }
                  >
                    + 문항 추가
                  </button>
                </div>

                <div className="space-y-2">
                  {questionTypes.map((qt, idx) => (
                    <div key={qt.id} className="flex items-center gap-2 text-xs">
                      <span className="w-10 text-gray-400">#{idx + 1}</span>
                      <select
                        className="w-28 border border-gray-300 rounded-md px-2 py-1 bg-white"
                        value={qt.kind}
                        onChange={(e) => {
                          const next = [...questionTypes];
                          next[idx] = { ...next[idx], kind: e.target.value as QuestionTypeSetting['kind'] };
                          setQuestionTypes(next);
                        }}
                      >
                        <option value="객관식">객관식</option>
                        <option value="주관식">주관식</option>
                        <option value="서술형">서술형</option>
                        <option value="번역">번역</option>
                        <option value="프롬프트">프롬프트</option>
                        <option value="custom">직접 입력</option>
                      </select>

                      {qt.kind === 'custom' && (
                        <input
                          type="text"
                          placeholder="문항 유형 입력"
                          className="w-32 border border-gray-300 rounded-md px-2 py-1 text-xs"
                          value={qt.customLabel ?? ''}
                          onChange={(e) => {
                            const next = [...questionTypes];
                            next[idx] = { ...next[idx], customLabel: e.target.value };
                            setQuestionTypes(next);
                          }}
                        />
                      )}

                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">문항 수</span>
                        <input
                          type="number"
                          min={1}
                          className="w-16 border border-gray-300 rounded-md px-2 py-1 text-xs"
                          value={qt.count}
                          onChange={(e) => {
                            const value = Number(e.target.value) || 0;
                            const next = [...questionTypes];
                            next[idx] = { ...next[idx], count: value };
                            setQuestionTypes(next);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="ml-auto px-2 py-1 text-[11px] text-gray-500 hover:text-red-600"
                        onClick={() =>
                          setQuestionTypes((prev) => prev.filter((item) => item.id !== qt.id))
                        }
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-700 mt-2">
                  <div>
                    <span className="font-semibold">총 문항 수: </span>
                    <span>{totalQuestionCount}문항</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">시험 시간</span>
                    <input
                      type="number"
                      min={10}
                      className="w-20 border border-gray-300 rounded-md px-2 py-1 text-xs"
                      defaultValue={selectedExam.durationMinutes}
                    />
                    <span className="text-[11px] text-gray-500">분</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 일정 / 접수 / 응시 조건 */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">2. 일정 · 접수 · 응시 조건</h2>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                {/* 왼쪽: 날짜 관련 */}
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold mb-2">시험일 · 채점기간 · 결과 공개일</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">시험일</label>
                        <input
                          type="date"
                          defaultValue={selectedExam.examDate}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">채점 마감일</label>
                        <input
                          type="date"
                          defaultValue={selectedExam.scoringEndDate}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">결과 공개일</label>
                        <input
                          type="date"
                          defaultValue={selectedExam.resultPublishDate}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">접수 기간 · 출제 마감</p>
                    <div className="grid grid-cols-[1.2fr,1.2fr,1fr] gap-2 items-end">
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">접수 시작</label>
                        <input
                          type="date"
                          defaultValue={selectedExam.registrationStart}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">접수 종료</label>
                        <input
                          type="date"
                          defaultValue={selectedExam.registrationEnd}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">출제 마감</label>
                        <input
                          type="date"
                          defaultValue={selectedExam.authorDeadline}
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 인원 / 비용 / 합격점수 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <p className="font-semibold mb-1">최소 응시 인원</p>
                      <input
                        type="number"
                        min={1}
                        defaultValue={selectedExam.minApplicants ?? 0}
                        className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">미달 시 시험이 자동 취소될 수 있습니다.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">합격 점수</p>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={selectedExam.passScore ?? 60}
                          className="w-20 border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                        />
                        <span className="text-[11px] text-gray-500">/ 100점</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">접수 비용</p>
                    <div className="grid grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">단순 접수</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            defaultValue={selectedExam.baseFee ?? 0}
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                          />
                          <span className="text-[11px] text-gray-500">원</span>
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-[11px] text-gray-500">전문가 검수 옵션</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={0}
                            defaultValue={selectedExam.reviewFee ?? 0}
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs"
                          />
                          <span className="text-[11px] text-gray-500">원</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">
                      수험자는 접수 시 단순 접수 / 검수 옵션을 선택하고 결제합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 출제자 배정 / 상태 */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-1">3. 출제자 배정 및 시험 상태</h2>
                <p className="text-xs text-gray-600 mb-2">
                  어떤 출제자에게 문제 출제를 맡길지 결정하고, 시험을 출시하거나 마감할 수 있습니다.
                </p>
                <div className="text-xs text-gray-700">
                  <span className="font-semibold">현재 배정된 출제자: </span>
                  {selectedExam.assignedTranslatorId
                    ? MOCK_TRANSLATORS.find((t) => t.id === selectedExam.assignedTranslatorId)?.name ||
                      '알 수 없음'
                    : '배정되지 않음'}
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setPendingTranslatorId(selectedExam.assignedTranslatorId ?? null);
                    setIsAssignModalOpen(true);
                  }}
                >
                  출제자 배정
                </button>
                <button className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700">
                  출시
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 출제자 배정 모달 */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-6 text-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">출제자 배정</h2>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => setIsAssignModalOpen(false)}
              >
                닫기
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              현재 등록된 출제자 목록입니다. 한 명을 선택해 이 시험의 출제자로 배정하세요.
            </p>

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md mb-4 divide-y divide-gray-100">
              {MOCK_TRANSLATORS.map((t) => {
                const isSelected = pendingTranslatorId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPendingTranslatorId(t.id)}
                    className={`w-full text-left px-3 py-2 flex items-start gap-3 text-xs ${
                      isSelected ? 'bg-indigo-50' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-700">
                      {t.name.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px]">
                          {t.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-600 mb-0.5">언어: {t.languages}</div>
                      <div className="text-[11px] text-gray-600">전문 분야: {t.specialties}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 선택 요약 + 제출 버튼 */}
            <div className="flex items-center justify-between text-xs">
              <div className="text-gray-700">
                <span className="font-semibold">선택된 출제자: </span>
                {pendingTranslatorId
                  ? MOCK_TRANSLATORS.find((t) => t.id === pendingTranslatorId)?.name || '알 수 없음'
                  : '아직 선택되지 않음'}
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!pendingTranslatorId}
                  onClick={() => {
                    // TODO: 실제 저장 로직 연결 (지금은 콘솔에만 출력)
                    console.log('Assign translator', pendingTranslatorId, 'to exam', selectedExam.id);
                    setIsAssignModalOpen(false);
                  }}
                >
                  최종 배정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
