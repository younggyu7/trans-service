'use client';

import { useState, useEffect } from 'react';
import IconSidebar from '@/components/IconSidebar';
import Header from '@/components/Header';

type PageType = 'create-exam' | 'in-progress' | 'completed';

interface Question {
  id: number;
  type: 'subjective' | 'descriptive' | 'multiple';
  title: string;
  question: string;
  content?: string;
  options?: string[];
  correctAnswer?: number;
  difficulty: string;
  category: string;
  answer?: string | number | null;
}

interface ExamData {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  answers: (string | number | null)[];
  estimatedTime: number;
  status?: string;
  completedAt?: string;
  timeSpent?: number;
  hasFeedback?: boolean;
}

export default function QuestionBankPage() {
  const [currentPage, setCurrentPage] = useState<PageType>('create-exam');
  const [subjectiveCount, setSubjectiveCount] = useState(3);
  const [multipleCount, setMultipleCount] = useState(4);
  const [descriptiveCount, setDescriptiveCount] = useState(3);
  const [examInProgress, setExamInProgress] = useState<ExamData | null>(null);
  const [examToView, setExamToView] = useState<ExamData | null>(null);
  const [inProgressExams, setInProgressExams] = useState<ExamData[]>([]);
  const [completedExams, setCompletedExams] = useState<ExamData[]>([]);

  const totalQuestions = subjectiveCount + multipleCount + descriptiveCount;
  const estimatedTime = Math.ceil(totalQuestions * 2.5);

  // Load exams from localStorage
  useEffect(() => {
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    setInProgressExams(exams);
    
    let completed = JSON.parse(localStorage.getItem('completedExams') || '[]');
    
    // 샘플 데이터 추가 (처음 로드 시만)
    if (completed.length === 0) {
      const sampleCompleted: ExamData = {
        id: 'sample_completed_1',
        title: '번역 기초 테스트',
        createdAt: '2025-11-25T05:00:00.000Z',
        completedAt: '2025-11-25T05:30:00.000Z',
        timeSpent: 1530, // 25분 30초
        estimatedTime: 25,
        hasFeedback: true,
        status: 'completed',
        questions: [
          {
            id: 1,
            type: 'subjective',
            title: '문제 1',
            question: '다음 영문을 한국어로 번역하세요.',
            content: 'The company has been focusing on sustainable development and innovation to meet the growing demands of the global market.',
            difficulty: '중급',
            category: '비즈니스',
            answer: '회사는 글로벌 시장의 증가하는 수요를 충족하기 위해 지속 가능한 개발과 혁신에 주력해왔습니다.'
          },
          {
            id: 2,
            type: 'multiple',
            title: '문제 2',
            question: '다음 단어의 가장 적절한 번역을 선택하세요: "sustainability"',
            options: ['지속성', '지속가능성', '유지', '보존'],
            correctAnswer: 1,
            difficulty: '초급',
            category: '어휘',
            answer: 1
          },
          {
            id: 3,
            type: 'descriptive',
            title: '문제 3',
            question: '다음 문장을 번역하고, 번역 시 고려한 사항을 설명하세요.',
            content: 'Our team is committed to delivering high-quality products and services that exceed customer expectations.',
            difficulty: '고급',
            category: '비즈니스',
            answer: '우리 팀은 고객의 기대를 뛰어넘는 고품질 제품과 서비스를 제공하는 데 전념하고 있습니다. "전념하고 있다"는 committed의 강한 의지를 표현하기 위해 선택했습니다.'
          }
        ],
        answers: [
          '회사는 글로벌 시장의 증가하는 수요를 충족하기 위해 지속 가능한 개발과 혁신에 주력해왔습니다.',
          1,
          '우리 팀은 고객의 기대를 뛰어넘는 고품질 제품과 서비스를 제공하는 데 전념하고 있습니다. "전념하고 있다"는 committed의 강한 의지를 표현하기 위해 선택했습니다.'
        ]
      };
      
      completed = [sampleCompleted];
      localStorage.setItem('completedExams', JSON.stringify(completed));
    }
    
    setCompletedExams(completed);
  }, []);

  const handleCreateExam = () => {
    if (totalQuestions === 0) {
      alert('최소 1개 이상의 문제를 선택해주세요.');
      return;
    }

    const sampleQuestions: Question[] = [
      {
        id: 1,
        type: 'subjective',
        title: '문제 1',
        question: '다음 영문을 한국어로 번역하세요.',
        content: 'The company has been focusing on sustainable development and innovation to meet the growing demands of the global market.',
        difficulty: '중급',
        category: '비즈니스',
        answer: ''
      },
      {
        id: 2,
        type: 'descriptive',
        title: '문제 2',
        question: '다음 문장을 번역하고, 번역 시 고려한 사항을 설명하세요.',
        content: 'Our team is committed to delivering high-quality products and services that exceed customer expectations.',
        difficulty: '고급',
        category: '비즈니스',
        answer: ''
      },
      {
        id: 3,
        type: 'multiple',
        title: '문제 3',
        question: '다음 단어의 가장 적절한 번역을 선택하세요: "sustainability"',
        options: ['지속성', '지속가능성', '유지', '보존'],
        correctAnswer: 1,
        difficulty: '초급',
        category: '어휘',
        answer: null
      }
    ];

    const questions: Question[] = [];
    let questionNum = 1;

    // 주관식
    for (let i = 0; i < subjectiveCount; i++) {
      questions.push({
        ...sampleQuestions[0],
        id: questionNum,
        title: `문제 ${questionNum}`,
        type: 'subjective',
        answer: ''
      });
      questionNum++;
    }

    // 객관식
    for (let i = 0; i < multipleCount; i++) {
      questions.push({
        ...sampleQuestions[2],
        id: questionNum,
        title: `문제 ${questionNum}`,
        type: 'multiple',
        answer: null
      });
      questionNum++;
    }

    // 서술형
    for (let i = 0; i < descriptiveCount; i++) {
      questions.push({
        ...sampleQuestions[1],
        id: questionNum,
        title: `문제 ${questionNum}`,
        type: 'descriptive',
        answer: ''
      });
      questionNum++;
    }

    const newExam: ExamData = {
      id: 'exam_' + Date.now(),
      title: '새로운 시험',
      createdAt: new Date().toISOString(),
      questions,
      answers: new Array(totalQuestions).fill(null),
      estimatedTime
    };

    // Save to localStorage
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    exams.push(newExam);
    localStorage.setItem('exams', JSON.stringify(exams));
    setInProgressExams(exams);

    alert(`총 ${totalQuestions}개의 문제가 생성되었습니다. (주관식: ${subjectiveCount}, 객관식: ${multipleCount}, 서술형: ${descriptiveCount})\n예상 시간: ${Math.round(estimatedTime)}분`);
    setExamInProgress(newExam);
  };

  const handleEnterExam = (exam: ExamData) => {
    setExamInProgress(exam);
  };

  const handleExitExam = () => {
    setExamInProgress(null);
  };

  const handleSubmitExam = (exam: ExamData, timeSpent: number) => {
    const completedExam = {
      ...exam,
      status: 'completed',
      completedAt: new Date().toISOString(),
      timeSpent,
      hasFeedback: false
    };

    const completed = JSON.parse(localStorage.getItem('completedExams') || '[]');
    completed.push(completedExam);
    localStorage.setItem('completedExams', JSON.stringify(completed));
    setCompletedExams(completed);

    // Remove from in-progress
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    const filtered = exams.filter((e: ExamData) => e.id !== exam.id);
    localStorage.setItem('exams', JSON.stringify(filtered));
    setInProgressExams(filtered);

    alert('시험이 제출되었습니다!');
    setExamInProgress(null);
    setCurrentPage('completed');
  };

  const handleViewResult = (exam: ExamData) => {
    // Add sample data for viewing
    const sampleResult = {
      ...exam,
      questions: exam.questions.map((q, i) => ({
        ...q,
        myAnswer: i === 0 ? '회사는 글로벌 시장의 증가하는 수요를 충족하기 위해 지속 가능한 개발과 혁신에 주력해왔습니다.' : 
                  i === 1 ? '우리 팀은 고객의 기대를 뛰어넘는 고품질 제품과 서비스를 제공하는 데 전념하고 있습니다.' : 
                  '지속가능성',
        modelAnswer: i === 0 ? '그 회사는 증가하는 글로벌 시장 수요를 충족시키기 위해 지속가능한 발전과 혁신에 집중해왔습니다.' :
                    i === 1 ? '저희 팀은 고객 기대치를 초과하는 고품질의 제품과 서비스를 제공하는 것에 헌신하고 있습니다.' :
                    '지속가능성',
        feedback: exam.hasFeedback ? 
            '전반적으로 잘 번역하셨습니다. 다만 "주력해왔습니다"보다는 "집중해왔습니다"가 더 자연스러운 표현입니다. 또한 "지속 가능한 개발"은 "지속가능한 발전"으로 수정하면 더 정확합니다.' : null
      })),
      hasFeedback: exam.hasFeedback
    };
    setExamToView(sampleResult as any);
  };

  if (examInProgress) {
    return <ExamPage exam={examInProgress} onExit={handleExitExam} onSubmit={handleSubmitExam} />;
  }

  if (examToView) {
    return <ResultPage exam={examToView} onClose={() => setExamToView(null)} />;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <IconSidebar />
        
        <div className="flex flex-1">
          {/* 220px 사이드바 */}
          <div className="w-[220px] bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">📚 문제은행</h2>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              <button
                onClick={() => setCurrentPage('create-exam')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'create-exam'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                📝 시험 생성하기
              </button>
              <button
                onClick={() => setCurrentPage('in-progress')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'in-progress'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                ⏳ 진행중인 시험
              </button>
              <button
                onClick={() => setCurrentPage('completed')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === 'completed'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                ✅ 완료된 시험
              </button>
            </nav>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1 overflow-auto">
        {currentPage === 'create-exam' && (
          <CreateExamPage
            subjectiveCount={subjectiveCount}
            setSubjectiveCount={setSubjectiveCount}
            multipleCount={multipleCount}
            setMultipleCount={setMultipleCount}
            descriptiveCount={descriptiveCount}
            setDescriptiveCount={setDescriptiveCount}
            totalQuestions={totalQuestions}
            estimatedTime={estimatedTime}
            onCreateExam={handleCreateExam}
          />
        )}
        {currentPage === 'in-progress' && <InProgressPage exams={inProgressExams} onEnterExam={handleEnterExam} />}
        {currentPage === 'completed' && <CompletedPage exams={completedExams} onViewResult={handleViewResult} />}
          </div>
        </div>
      </div>
    </>
  );
}

interface CreateExamPageProps {
  subjectiveCount: number;
  setSubjectiveCount: (value: number) => void;
  multipleCount: number;
  setMultipleCount: (value: number) => void;
  descriptiveCount: number;
  setDescriptiveCount: (value: number) => void;
  totalQuestions: number;
  estimatedTime: number;
  onCreateExam: () => void;
}

// 카테고리 데이터 구조
const categoryData: Record<string, Record<string, string[]>> = {
  business: {
    'PPT/프레젠테이션': ['제안서', '보고서', '회의자료'],
    '문서/보고서': ['계약서', '이메일', '사내문서'],
    '이메일/서신': ['비즈니스 메일', '공문', '제안서'],
    '계약서/법률': ['계약서', '약관', '법률문서']
  },
  academic: {
    '논문/저널': ['연구논문', '문헌고찰', '학술기사'],
    '연구보고서': ['연구계획서', '결과보고서', '중간보고서'],
    '학위논문': ['학사논문', '석사논문', '박사논문'],
    '교재/참고서': ['교과서', '학습지', '참고서적']
  },
  culture: {
    '기사/리뷰': ['뉴스기사', '블로그', '리뷰'],
    '문학/소설': ['소설', '에세이', '시'],
    '영상/자막': ['영화자막', '드라마자막', '다큐멘터리'],
    '웹툰/만화': ['웹툰', '만화', '그래픽노벨']
  },
  science: {
    'IT/기술문서': ['기술사양서', 'API문서', '매뉴얼'],
    '의학/약학': ['의학논문', '약품정보', '임상시험'],
    '공학/건축': ['설계도면', '시방서', '기술보고서'],
    '자연과학': ['연구논문', '실험보고서', '과학기사']
  }
};

function CreateExamPage({
  subjectiveCount,
  setSubjectiveCount,
  multipleCount,
  setMultipleCount,
  descriptiveCount,
  setDescriptiveCount,
  totalQuestions,
  estimatedTime,
  onCreateExam,
}: CreateExamPageProps) {
  const [examType, setExamType] = useState('all');
  const [language, setLanguage] = useState('all');
  const [difficulties, setDifficulties] = useState(['beginner', 'intermediate', 'advanced']);
  const [grades, setGrades] = useState(['1', '2', '3']);
  const [selectedMajor, setSelectedMajor] = useState<string[]>([]);
  const [selectedMiddle, setSelectedMiddle] = useState<Record<string, string[]>>({});
  const [selectedMinor, setSelectedMinor] = useState<Record<string, string[]>>({});
  const [excludeSolved, setExcludeSolved] = useState(false);
  const [excludeCorrect, setExcludeCorrect] = useState(false);
  const [onlyWrong, setOnlyWrong] = useState(false);

  const toggleDifficulty = (diff: string) => {
    setDifficulties(prev =>
      prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
    );
  };

  const toggleGrade = (grade: string) => {
    setGrades(prev =>
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  const toggleMajorCategory = (major: string) => {
    setSelectedMajor(prev => {
      if (prev.includes(major)) {
        // 대분류 해제 시 하위 모두 제거
        const newMiddle = { ...selectedMiddle };
        delete newMiddle[major];
        setSelectedMiddle(newMiddle);
        
        const newMinor = { ...selectedMinor };
        Object.keys(newMinor).forEach(key => {
          if (key.startsWith(major + '-')) {
            delete newMinor[key];
          }
        });
        setSelectedMinor(newMinor);
        
        return prev.filter(c => c !== major);
      } else {
        return [...prev, major];
      }
    });
  };

  const toggleMiddleCategory = (major: string, middle: string) => {
    setSelectedMiddle(prev => {
      const currentMiddle = prev[major] || [];
      const newMiddle = { ...prev };
      
      if (currentMiddle.includes(middle)) {
        // 중분류 해제 시 하위 소분류도 제거
        newMiddle[major] = currentMiddle.filter(m => m !== middle);
        if (newMiddle[major].length === 0) {
          delete newMiddle[major];
        }
        
        const newMinor = { ...selectedMinor };
        const minorKey = `${major}-${middle}`;
        delete newMinor[minorKey];
        setSelectedMinor(newMinor);
      } else {
        newMiddle[major] = [...currentMiddle, middle];
      }
      
      return newMiddle;
    });
  };

  const toggleMinorCategory = (major: string, middle: string, minor: string) => {
    const key = `${major}-${middle}`;
    setSelectedMinor(prev => {
      const currentMinor = prev[key] || [];
      const newMinor = { ...prev };
      
      if (currentMinor.includes(minor)) {
        newMinor[key] = currentMinor.filter(m => m !== minor);
        if (newMinor[key].length === 0) {
          delete newMinor[key];
        }
      } else {
        newMinor[key] = [...currentMinor, minor];
      }
      
      return newMinor;
    });
  };

  const selectAllMiddle = (major: string) => {
    const allMiddle = Object.keys(categoryData[major] || {});
    setSelectedMiddle(prev => ({
      ...prev,
      [major]: allMiddle
    }));
  };

  const selectAllMinor = (major: string, middle: string) => {
    const key = `${major}-${middle}`;
    const allMinor = categoryData[major]?.[middle] || [];
    setSelectedMinor(prev => ({
      ...prev,
      [key]: allMinor
    }));
  };

  const resetForm = () => {
    setExamType('all');
    setLanguage('all');
    setDifficulties(['beginner', 'intermediate', 'advanced']);
    setGrades(['1', '2', '3']);
    setSelectedMajor([]);
    setSelectedMiddle({});
    setSelectedMinor({});
    setExcludeSolved(false);
    setExcludeCorrect(false);
    setOnlyWrong(false);
    setSubjectiveCount(3);
    setMultipleCount(4);
    setDescriptiveCount(3);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">시험 생성하기</h1>
          <p className="text-gray-600">원하는 카테고리를 선택하여 나만의 시험을 만들어보세요</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          📥 문제 불러오기
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* 필터 섹션 - 한 줄 배치 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시험 유형</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="translation">번역 시험</option>
              <option value="prompt">프롬프트 시험</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">언어선택</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체</option>
              <option value="en-kr">영어 → 한국어</option>
              <option value="kr-en">한국어 → 영어</option>
              <option value="cn-kr">중국어 → 한국어</option>
              <option value="jp-kr">일본어 → 한국어</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
            <div className="flex gap-3">
              {['beginner', 'intermediate', 'advanced'].map((diff) => (
                <label key={diff} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={difficulties.includes(diff)}
                    onChange={() => toggleDifficulty(diff)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    {diff === 'beginner' ? '초급' : diff === 'intermediate' ? '중급' : '고급'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">급수</label>
            <div className="flex gap-3">
              {['1', '2', '3'].map((grade) => (
                <label key={grade} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={grades.includes(grade)}
                    onChange={() => toggleGrade(grade)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{grade}급</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* 문제유형선택 (대분류 → 중뵌류 → 소뵌류) */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">문제유형선택 (대뵌류 → 중뵌류 → 소뵌류)</label>
          
          {/* 대분류 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { value: 'business', label: '비즈니스' },
                { value: 'academic', label: '학술/연구' },
                { value: 'culture', label: '문화/컨텐츠' },
                { value: 'science', label: '과학/기술' },
              ].map((cat) => (
                <label 
                  key={cat.value} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMajor.includes(cat.value)
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMajor.includes(cat.value)}
                    onChange={() => toggleMajorCategory(cat.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{cat.label}</span>
                </label>
              ))}
            </div>

            {/* 중분류 및 소분류 */}
            {selectedMajor.length > 0 && (
              <div className="space-y-4">
                {selectedMajor.map(major => {
                  const majorLabel = {
                    business: '비즈니스',
                    academic: '학술/연구',
                    culture: '문화/컨텐츠',
                    science: '과학/기술'
                  }[major];

                  return (
                    <div key={major} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">{majorLabel}</h4>
                        <button
                          type="button"
                          onClick={() => selectAllMiddle(major)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          - 전체 선택
                        </button>
                      </div>
                      
                      {/* 중분류 */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {Object.keys(categoryData[major] || {}).map(middle => (
                          <label
                            key={middle}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMiddle[major]?.includes(middle) || false}
                              onChange={() => toggleMiddleCategory(major, middle)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">{middle}</span>
                          </label>
                        ))}
                      </div>

                      {/* 소분류 */}
                      {selectedMiddle[major]?.map(middle => {
                        const minorKey = `${major}-${middle}`;
                        const minors = categoryData[major]?.[middle] || [];
                        
                        return (
                          <div key={middle} className="mt-3 pl-4 border-l-2 border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-600">{middle}</span>
                              <button
                                type="button"
                                onClick={() => selectAllMinor(major, middle)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                전체
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {minors.map(minor => (
                                <label
                                  key={minor}
                                  className="flex items-center gap-2 p-1.5 rounded hover:bg-blue-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedMinor[minorKey]?.includes(minor) || false}
                                    onChange={() => toggleMinorCategory(major, middle, minor)}
                                    className="w-3.5 h-3.5 text-blue-600 rounded"
                                  />
                                  <span className="text-xs text-gray-600">{minor}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* 문제 필터링 & 문제 수 설정 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
        {/* 문제 필터링 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">문제 필터링</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeSolved}
                onChange={(e) => setExcludeSolved(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">풀었던 문제 제외</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeCorrect}
                onChange={(e) => setExcludeCorrect(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">맞았던 문제 제외</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWrong}
                onChange={(e) => setOnlyWrong(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">틀린 문제만</span>
            </label>
          </div>
        </div>

        {/* 문제 수 설정 */}
        <div className="grid grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">주관식</label>
            <input
              type="number"
              value={subjectiveCount}
              onChange={(e) => setSubjectiveCount(parseInt(e.target.value) || 0)}
              min="0"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">객관식</label>
            <input
              type="number"
              value={multipleCount}
              onChange={(e) => setMultipleCount(parseInt(e.target.value) || 0)}
              min="0"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">서술형</label>
            <input
              type="number"
              value={descriptiveCount}
              onChange={(e) => setDescriptiveCount(parseInt(e.target.value) || 0)}
              min="0"
              max="20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">총 문제 수</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-blue-600">
              {totalQuestions}문제
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">예상 시간</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
              약 {estimatedTime}분
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전체 문제 은행</label>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
              1,234문제
            </div>
          </div>
        </div>
        </div>

        {/* 선택된 조건 미리보기 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">선택된 조건</h3>
          <div className="space-y-2">
          {/* 기본 필터 */}
          <div className="flex gap-2 flex-wrap">
            {/* 시험 유형 */}
            <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
              {examType === 'all' ? '전체 유형' : examType === 'translation' ? '번역 시험' : '프롬프트 시험'}
            </span>
            
            {/* 언어선택 */}
            {language !== 'all' && (
              <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                {language === 'en-kr' ? '영어→한국어' : language === 'kr-en' ? '한국어→영어' : language === 'cn-kr' ? '중국어→한국어' : '일본어→한국어'}
              </span>
            )}
            
            {/* 난이도 */}
            <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
              {difficulties.length === 3 ? '모든 난이도' : difficulties.map(d => d === 'beginner' ? '초급' : d === 'intermediate' ? '중급' : '고급').join(', ')}
            </span>
            
            {/* 급수 */}
            <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
              {grades.length === 3 ? '모든 급수' : grades.map(g => `${g}급`).join(', ')}
            </span>
          </div>
            
            {/* 문제유형선택 - 계층적 표시 */}
            {selectedMajor.length > 0 && (
            <div className="flex gap-2 flex-wrap">
            {selectedMajor.map(major => {
              const majorLabel = {
                business: '비즈니스',
                academic: '학술/연구',
                culture: '문화/컨텐츠',
                science: '과학/기술'
              }[major];

              const middles = selectedMiddle[major] || [];
              
              // 중분류가 없으면 대분류만 표시
              if (middles.length === 0) {
                return (
                  <span key={major} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                    {majorLabel}
                  </span>
                );
              }

              // 중분류가 있으면 각각 표시
              return middles.map(middle => {
                const minorKey = `${major}-${middle}`;
                const minors = selectedMinor[minorKey] || [];
                
                // 소분류가 없으면 대분류/중분류만
                if (minors.length === 0) {
                  return (
                    <span key={`${major}-${middle}`} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                      {majorLabel}/{middle}
                    </span>
                  );
                }
                
                // 소분류가 있으면 각각 표시
                return minors.map(minor => (
                  <span key={`${major}-${middle}-${minor}`} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700">
                    {majorLabel}/{middle}/{minor}
                  </span>
                ));
              });
            })}
            </div>
            )}
            
            {/* 문제 필터링 & 문제 수 */}
            <div className="flex gap-2 flex-wrap">
            {excludeSolved && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                풀었던 문제 제외
              </span>
            )}
            {excludeCorrect && (
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                맞았던 문제 제외
              </span>
            )}
            {onlyWrong && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                틀린 문제만
              </span>
            )}
            
            {/* 문제 수 */}
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              총 {totalQuestions}문제 (주관식 {subjectiveCount} / 객관식 {multipleCount} / 서술형 {descriptiveCount})
            </span>
          </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={resetForm}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
          <button 
            onClick={onCreateExam}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            🎯 시험 생성하고 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

function InProgressPage({ exams, onEnterExam }: { exams: ExamData[], onEnterExam: (exam: ExamData) => void }) {

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">진행중인 시험</h1>
          <p className="text-gray-600">현재 진행중인 시험 목록입니다</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          📥 문제 불러오기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            진행중인 시험이 없습니다.
          </div>
        ) : (
          exams.map((exam) => {
            const completed = exam.answers?.filter((a: any) => a !== null && a !== '').length || 0;
            const totalQuestions = exam.questions.length;
            const createdDate = new Date(exam.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    진행중
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">문제 수:</span>
                    <span className="font-medium text-gray-900">{totalQuestions}문항</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">진행률:</span>
                    <span className="font-medium text-gray-900">
                      {completed}/{totalQuestions} ({Math.round((completed / totalQuestions) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(completed / totalQuestions) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">생성일:</span>
                    <span className="font-medium text-gray-900">{createdDate}</span>
                  </div>
                </div>
                <button 
                  onClick={() => onEnterExam(exam)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  시험 입장 →
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CompletedPage({ exams, onViewResult }: { exams: ExamData[], onViewResult: (exam: ExamData) => void }) {

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">완료된 시험</h1>
        <p className="text-gray-600">제출한 시험 목록과 결과를 확인할 수 있습니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            완료된 시험이 없습니다.
          </div>
        ) : (
          exams.map((exam) => {
            const minutes = Math.floor((exam.timeSpent || 0) / 60);
            const seconds = (exam.timeSpent || 0) % 60;
            const timeSpentText = `${minutes}분 ${seconds}초`;
            const completedDate = new Date(exam.completedAt || '').toLocaleString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    완료
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">완료일:</span>
                    <span className="font-medium text-gray-900">{completedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">문제 수:</span>
                    <span className="font-medium text-gray-900">{exam.questions.length}문항</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">소요 시간:</span>
                    <span className="font-medium text-gray-900">{timeSpentText}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">채점 상태:</span>
                    <span className={`font-medium ${exam.hasFeedback ? 'text-green-600' : 'text-yellow-600'}`}>
                      {exam.hasFeedback ? '✅ 피드백 받음' : '⏳ 피드백 대기중'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onViewResult(exam)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    결과 보기 →
                  </button>
                  {!exam.hasFeedback && (
                    <button 
                      onClick={() => alert('피드백 신청이 완료되었습니다.')}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      피드백 받기
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// 시험 페이지 컴포넌트
function ExamPage({ exam, onExit, onSubmit }: { exam: ExamData, onExit: () => void, onSubmit: (exam: ExamData, timeSpent: number) => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number | null)[]>(exam.answers || new Array(exam.questions.length).fill(null));
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentQuestion = exam.questions[currentQuestionIndex];

  const handleAnswerChange = (value: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
    
    // Update exam in localStorage
    const updatedExam = { ...exam, answers: newAnswers };
    const exams = JSON.parse(localStorage.getItem('exams') || '[]');
    const index = exams.findIndex((e: ExamData) => e.id === exam.id);
    if (index >= 0) {
      exams[index] = updatedExam;
      localStorage.setItem('exams', JSON.stringify(exams));
    }
  };

  const handleSubmit = () => {
    const unanswered = answers.filter(a => a === null || a === '').length;
    if (unanswered > 0) {
      if (!confirm(`${unanswered}개의 문제가 미완료 상태입니다. 제출하시겠습니까?`)) {
        return;
      }
    }
    onSubmit({ ...exam, answers }, elapsedSeconds);
  };

  const toggleComplete = () => {
    const newCompleted = new Set(completedQuestions);
    if (newCompleted.has(currentQuestionIndex)) {
      newCompleted.delete(currentQuestionIndex);
    } else {
      newCompleted.add(currentQuestionIndex);
    }
    setCompletedQuestions(newCompleted);
  };

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 왼쪽 사이드바 */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button onClick={onExit} className="mb-4 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            ← 나가기
          </button>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">⏱️ 경과 시간</div>
            <div className="text-2xl font-bold text-blue-600">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              🎯 예상 시간: {Math.round(exam.estimatedTime)}분
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">문제 목록</h3>
          <div className="space-y-2">
            {exam.questions.map((q, index) => {
              const isAnswered = answers[index] !== null && answers[index] !== '';
              const isCompleted = completedQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-green-100 text-green-800'
                      : isAnswered
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {q.title} {isCompleted && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => {
              const updatedExam = { ...exam, answers };
              const exams = JSON.parse(localStorage.getItem('exams') || '[]');
              const index = exams.findIndex((e: ExamData) => e.id === exam.id);
              if (index >= 0) {
                exams[index] = updatedExam;
                localStorage.setItem('exams', JSON.stringify(exams));
                alert('임시 저장되었습니다.');
              }
            }}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            💾 임시 저장
          </button>
          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            📤 최종 제출
          </button>
        </div>
      </div>

      {/* 메인 문제 영역 */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.title}</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {currentQuestion.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {currentQuestion.type === 'multiple' ? '객관식' : currentQuestion.type === 'descriptive' ? '서술형' : '주관식'}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-800 mb-4">{currentQuestion.question}</p>
            {currentQuestion.content && (
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">📄 원문</h4>
                <p className="text-gray-800 leading-relaxed">{currentQuestion.content}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">✍️ 답안 작성</label>
            {currentQuestion.type === 'multiple' ? (
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswerChange(index)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                value={(answers[currentQuestionIndex] as string) || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQuestion.type === 'descriptive' ? '번역문과 번역 시 고려사항을 함께 작성해주세요...' : '답안을 입력하세요...'}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            )}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={toggleComplete}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  completedQuestions.has(currentQuestionIndex)
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {completedQuestions.has(currentQuestionIndex) ? '✓ 완료 표기 해제' : '✓ 완료 표기'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← 이전 문제
              </button>
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === exam.questions.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음 문제 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 결과 페이지 컴포넌트
function ResultPage({ exam, onClose }: { exam: any, onClose: () => void }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const minutes = Math.floor((exam.timeSpent || 0) / 60);
  const seconds = (exam.timeSpent || 0) % 60;
  const completedDate = new Date(exam.completedAt || '').toLocaleDateString('ko-KR');

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            ← 돌아가기
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">시험 결과</h1>

        {/* 요약 정보 */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">총 문제</div>
            <div className="text-3xl font-bold text-gray-900">{exam.questions.length}문항</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">소요 시간</div>
            <div className="text-3xl font-bold text-gray-900">{minutes}분 {seconds}초</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">제출일</div>
            <div className="text-3xl font-bold text-gray-900">{completedDate}</div>
          </div>
        </div>

        {/* 문제 번호 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">문제 목록</h3>
          <div className="flex flex-wrap gap-2">
            {exam.questions.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                문제 {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 문제 상세 */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">문제 {currentQuestionIndex + 1}</h2>

          <div className="grid grid-cols-4 gap-6">
            {/* 문제 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 bg-blue-50 px-3 py-2 rounded">📋 문제</h3>
              <div className="text-gray-800">
                <p className="mb-2">{currentQuestion.question}</p>
                {currentQuestion.content && (
                  <p className="mt-3 pt-3 border-t border-gray-200 italic text-sm">{currentQuestion.content}</p>
                )}
              </div>
            </div>

            {/* 내 답안 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 bg-yellow-50 px-3 py-2 rounded">✍️ 내 답안</h3>
              <div className={`text-gray-800 ${!currentQuestion.myAnswer ? 'text-gray-400' : ''}`}>
                {currentQuestion.myAnswer || '답안을 작성하지 않았습니다'}
              </div>
            </div>

            {/* 모범 답안 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 bg-green-50 px-3 py-2 rounded">✅ 모범 답안</h3>
              <div className="text-gray-800">
                {currentQuestion.modelAnswer || '모범 답안이 제공되지 않았습니다'}
              </div>
            </div>

            {/* 피드백 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 bg-purple-50 px-3 py-2 rounded">📝 피드백</h3>
              <div className="text-gray-800">
                {currentQuestion.feedback ? (
                  <p>{currentQuestion.feedback}</p>
                ) : (
                  <div>
                    <p className="text-gray-400 text-sm mb-3">아직 피드백이 없습니다</p>
                    <button
                      onClick={() => alert(`문제 ${currentQuestionIndex + 1}에 대한 피드백을 신청했습니다.`)}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      피드백 받기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {currentQuestion.feedback && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ✍️ 다시 답안 쓰기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
