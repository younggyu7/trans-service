'use client';

// 간단한 인메모리 스토어 (mock)
// 새로고침하면 초기값으로 리셋됩니다.

export type DraftStatus = '출제중' | '출제완료' | '최종승인';

export interface ExamDraft {
  id: string;
  templateId?: string;
  title: string;
  type: '번역' | '프롬프트';
  mainCategory: string;
  middleCategory?: string;
  subCategory?: string;
  questionCount: number;
  durationMinutes: number;
  assignedTranslatorId?: string;
  status: DraftStatus;
}

let drafts: ExamDraft[] = [
  {
    id: 'draft-001',
    templateId: 'exam-001',
    title: '전문1급 번역 시험 A형',
    type: '번역',
    mainCategory: '비즈니스',
    middleCategory: '마케팅/기획',
    subCategory: '마케팅 제안서',
    questionCount: 6,
    durationMinutes: 90,
    assignedTranslatorId: 'tr-001',
    status: '출제중',
  },
];

export function getDrafts(): ExamDraft[] {
  return drafts;
}

export function addDraft(draft: ExamDraft) {
  drafts = [...drafts, draft];
}

export function updateDraft(id: string, patch: Partial<ExamDraft>) {
  drafts = drafts.map((d) => (d.id === id ? { ...d, ...patch } : d));
}

export function approveDraft(id: string) {
  updateDraft(id, { status: '최종승인' });
}
