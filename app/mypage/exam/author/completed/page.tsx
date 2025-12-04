'use client';

import { useMemo, useState } from 'react';
import { getDrafts } from '@/lib/examDraftStore';

const today = new Date();

function isPast(dateStr?: string) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getTime() < today.getTime();
}

export default function AuthorCompletedExamsPage() {
  const [version] = useState(0);
  const drafts = useMemo(() => getDrafts(), [version]);
  const completed = drafts.filter((d) => d.status === '출제완료');
  const approved = drafts.filter((d) => d.status === '최종승인');

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">완료된 시험 및 채점</h1>
          <p className="mt-1 text-sm text-gray-600">
            출제를 완료한 시험과 관리자 최종 승인 여부, 시험일 이후 채점 가능 여부를 확인할 수 있습니다.
          </p>
        </div>
      </header>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        {completed.length === 0 && approved.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            아직 출제를 완료한 시험이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {[...completed, ...approved].map((exam) => {
              const canGrade = isPast('2025-01-15'); // TODO: exam 시험일로 교체

              return (
                <article
                  key={exam.id}
                  className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{exam.title}</h3>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-1">
                      <span>{exam.type}</span>
                      <span>· {exam.mainCategory}</span>
                      {exam.middleCategory && <span>· {exam.middleCategory}</span>}
                      {exam.subCategory && <span>· {exam.subCategory}</span>}
                      <span>· {exam.questionCount}문항</span>
                      <span>· {exam.durationMinutes}분</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {exam.status === '출제완료' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-800 font-medium">
                        관리자 검토 대기
                      </span>
                    )}
                    {exam.status === '최종승인' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-800 font-medium">
                        최종 승인 완료
                      </span>
                    )}
                    <button
                      className={`px-3 py-1.5 rounded-md font-semibold border text-xs ${
                        canGrade
                          ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                      disabled={!canGrade}
                      onClick={() => {
                        if (!canGrade) return;
                        // TODO: 채점 페이지로 이동
                        alert('채점 페이지는 추후 구현 예정입니다.');
                      }}
                    >
                      채점하기
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
