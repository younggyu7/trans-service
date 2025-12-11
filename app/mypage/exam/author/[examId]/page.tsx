'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getDrafts } from '@/lib/examDraftStore';

// 문제 단위 타입 (출제자가 만드는 문제은행용)
interface AuthorQuestion {
  id: number;
  type: 'subjective' | 'descriptive' | 'multiple';
  title: string; // 문제 제목
  question: string; // 문제 지문/설명
  content?: string; // 원문/추가 자료
  options?: string[]; // 객관식 보기
  correctAnswer?: number; // 정답 인덱스
  difficulty: '상' | '중' | '하'; // 난이도
  majorCategory: string; // 대분류
  middleCategory?: string; // 중분류
  minorCategory?: string; // 소분류
  answerGuide?: string; // 모범답안 / 채점 기준
}

export default function ExamAuthorDetailPage() {
  const params = useParams<{ examId: string }>();
  const router = useRouter();
  const examId = params.examId;

  const drafts = useMemo(() => getDrafts(), []);
  const exam = drafts.find((d) => d.id === examId);

  const [questions, setQuestions] = useState<AuthorQuestion[]>(() => {
    // 시험의 총 문항 수에 맞춰 기본 문제 틀을 생성 (간단 mock)
    const count = exam?.questionCount ?? 5;
    const list: AuthorQuestion[] = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i + 1,
        type: 'subjective',
        title: `문제 ${i + 1}`,
        question: '',
        difficulty: '중',
        majorCategory: exam?.mainCategory ?? '',
      });
    }
    return list;
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-600">
        해당 시험 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const current = questions[currentIndex];

  const updateCurrent = (patch: Partial<AuthorQuestion>) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], ...patch };
      return next;
    });
  };

  const handleAddOption = () => {
    if (current.type !== 'multiple') return;
    const options = current.options ?? [];
    updateCurrent({ options: [...options, ''] });
  };

  const handleChangeOption = (idx: number, value: string) => {
    if (current.type !== 'multiple') return;
    const options = [...(current.options ?? [])];
    options[idx] = value;
    updateCurrent({ options });
  };

  const handleSaveMock = () => {
    console.log('author questions (mock)', { examId, questions });
    alert('출제 내용이 (mock)으로 저장되었습니다. 실제 서버 연동은 이후에 추가합니다.');
  };

  const handleSubmitMock = () => {
    console.log('submit author questions (mock)', { examId, questions });
    alert('출제 문제가 (mock) 기준으로 최종 저장되었습니다. 출제중/출제완료 상태는 상위 화면에서 관리합니다.');
    router.push('/mypage/exam/author/in-progress');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-sm">
      {/* 왼쪽: 문제 리스트 */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 space-y-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-3 py-1.5 rounded-md text-xs text-gray-600 hover:bg-gray-100"
          >
            ← 출제중인 시험 목록으로
          </button>
          <div>
            <div className="text-[11px] text-gray-500 mb-1">출제 중 시험</div>
            <div className="text-sm font-semibold text-gray-900">{exam.title}</div>
            <div className="text-[11px] text-gray-500 mt-1 flex flex-wrap gap-1">
              <span>{exam.type}</span>
              <span>· {exam.mainCategory}</span>
              {exam.middleCategory && <span>· {exam.middleCategory}</span>}
              {exam.subCategory && <span>· {exam.subCategory}</span>}
              <span>· {exam.questionCount}문항</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-2">
          {questions.map((q, index) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`w-full text-left px-3 py-2 rounded-md text-xs border transition-colors ${
                index === currentIndex
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-semibold truncate">{q.title || `문제 ${q.id}`}</div>
              <div className="mt-0.5 text-[10px] flex flex-wrap gap-1 opacity-80">
                <span>{q.type === 'multiple' ? '객관식' : q.type === 'descriptive' ? '서술형' : '주관식'}</span>
                <span>· {q.difficulty}</span>
                {q.majorCategory && <span>· {q.majorCategory}</span>}
                {q.middleCategory && <span>· {q.middleCategory}</span>}
                {q.minorCategory && <span>· {q.minorCategory}</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2 text-xs">
          <button
            type="button"
            onClick={handleSaveMock}
            className="w-full px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            임시 저장
          </button>
          <button
            type="button"
            onClick={handleSubmitMock}
            className="w-full px-3 py-1.5 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            출제 문제 완료 저장
          </button>
        </div>
      </aside>

      {/* 오른쪽: 선택된 문제 상세 편집 */}
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-5">
          <header className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                문제 {current.id} 상세 출제
              </h1>
              <p className="text-[11px] text-gray-500">
                이 시험의 총 문항 수({exam.questionCount}문항)에 맞게 각 문제의 유형, 난이도, 카테고리(중/소분류)와 실제 지문/답안을 정의합니다.
              </p>
            </div>
            <div className="text-right text-[11px] text-gray-500">
              <div>시험 ID: {exam.id}</div>
              <div>상태: 출제중 (mock)</div>
            </div>
          </header>

          {/* 상단 메타: 문제 타입 / 난이도 / 카테고리 */}
          <section className="grid grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">문제 유형</label>
              <select
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                value={current.type}
                onChange={(e) =>
                  updateCurrent({ type: e.target.value as AuthorQuestion['type'] })
                }
              >
                <option value="subjective">주관식</option>
                <option value="descriptive">서술형</option>
                <option value="multiple">객관식</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">난이도</label>
              <select
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 bg-white"
                value={current.difficulty}
                onChange={(e) =>
                  updateCurrent({ difficulty: e.target.value as AuthorQuestion['difficulty'] })
                }
              >
                <option value="상">상</option>
                <option value="중">중</option>
                <option value="하">하</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">중분류</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5"
                placeholder="예: 마케팅/기획"
                value={current.middleCategory ?? ''}
                onChange={(e) => updateCurrent({ middleCategory: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">소분류</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5"
                placeholder="예: 제안서 / 계약서 등"
                value={current.minorCategory ?? ''}
                onChange={(e) => updateCurrent({ minorCategory: e.target.value })}
              />
            </div>
          </section>

          {/* 문제 제목 / 지문 */}
          <section className="space-y-3 text-xs">
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">문제 타이틀</label>
              <input
                className="w-full border border-gray-300 rounded-md px-2 py-1.5"
                placeholder="예: 공통 영역 객관식 1번"
                value={current.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">문제 설명 / 지문</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 h-28 resize-none"
                placeholder="수험자에게 보여줄 문제 설명을 작성하세요."
                value={current.question}
                onChange={(e) => updateCurrent({ question: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 text-[11px] text-gray-500">원문 / 참고 자료 (선택)</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-2 py-1.5 h-28 resize-none"
                placeholder="번역 지문, 프롬프트 맥락, 윤리 상황 설명 등 원문을 입력합니다."
                value={current.content ?? ''}
                onChange={(e) => updateCurrent({ content: e.target.value })}
              />
            </div>
          </section>

          {/* 유형별 추가 필드 */}
          {current.type === 'multiple' && (
            <section className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="block mb-1 text-[11px] text-gray-500">객관식 보기 및 정답</label>
                <button
                  type="button"
                  className="px-2 py-1 rounded-md border border-gray-300 text-[11px] text-gray-700 hover:bg-gray-50"
                  onClick={handleAddOption}
                >
                  + 보기 추가
                </button>
              </div>
              <div className="space-y-1">
                {(current.options ?? []).map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="correctOption"
                      className="w-3.5 h-3.5 text-indigo-600"
                      checked={current.correctAnswer === idx}
                      onChange={() => updateCurrent({ correctAnswer: idx })}
                    />
                    <input
                      className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-xs"
                      placeholder={`보기 ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleChangeOption(idx, e.target.value)}
                    />
                  </div>
                ))}
                {(!current.options || current.options.length === 0) && (
                  <p className="text-[11px] text-gray-400">보기를 추가해 주세요.</p>
                )}
              </div>
            </section>
          )}

          {/* 모범답안 / 채점 기준 */}
          <section className="space-y-2 text-xs">
            <label className="block mb-1 text-[11px] text-gray-500">모범답안 / 채점 기준</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-2 py-1.5 h-24 resize-none"
              placeholder="이 문제의 모범답안 또는 채점 기준(문장부호수, 수정단어수, 단계, 단어수 등)을 기술합니다."
              value={current.answerGuide ?? ''}
              onChange={(e) => updateCurrent({ answerGuide: e.target.value })}
            />
          </section>

          {/* 하단 네비게이션 */}
          <footer className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
            <div className="text-[11px] text-gray-500">
              문제 {currentIndex + 1} / {questions.length}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← 이전 문제
              </button>
              <button
                type="button"
                disabled={currentIndex === questions.length - 1}
                onClick={() =>
                  setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
                }
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음 문제 →
              </button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
