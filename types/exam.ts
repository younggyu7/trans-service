export type ExamType = '번역' | '프롬프트';

export interface Exam {
  id: number;
  title: string;
  type: ExamType;
  description: string;
  category: string;
  level: string;
  instructor: string;
  duration: number;
  questionCount: number;
}

export interface ExamQuestion {
  id: number;
  examId: number;
  question: string;
  type: 'translation' | 'prompt' | 'essay';
  maxLength?: number;
  attachments?: string[];
}

export interface ExamAnswer {
  questionId: number;
  answer: string;
  submittedAt?: string;
}

export interface ExamResult {
  id: number;
  examId: number;
  userId: string;
  score: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}
