'use client';

import { useMemo, useState } from 'react';
import { getDrafts } from '@/lib/examDraftStore';

export default function AuthorRequestedExamsPage() {
  const [version] = useState(0);
  const drafts = useMemo(() => getDrafts(), [version]);
  const requested = drafts.filter((d) => d.status === '출제자전달완료');

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">요청온 시험 출제</h1>
          <p className="mt-1 text-sm text-gray-600">
            관리자에게서 출제 요청이 온 시험 목록입니다. 각 시험을 선택해 문제를 출제할 수 있습니다.
          </p>
        </div>
      </header>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        {requested.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            아직 출제 요청이 온 시험이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {requested.map((exam) => (
              <article
                key={exam.id}
                className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-yellow-200 bg-yellow-50 text-yellow-800 font-medium">
                    출제 요청됨
                  </span>
                  <button
                    className="px-3 py-1.5 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                    onClick={() => {
                      // TODO: 실제 출제 상세 페이지로 라우팅
                      alert('출제 상세 페이지는 추후 구현 예정입니다.');
                    }}
                  >
                    시험 출제하기
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
