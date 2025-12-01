# 통합 번역 플랫폼

시험 응시 시스템과 번역 서비스를 통합한 Next.js 플랫폼입니다.

## 기술 스택

- **Framework**: Next.js 15.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.1
- **UI Library**: React 19.0.0

## 프로젝트 구조

```
translation-platform/
├── app/
│   ├── mypage/              # 시험 응시자 페이지 (exam 프로젝트)
│   ├── client/              # 번역 의뢰인 페이지
│   │   ├── requests/        # 의뢰 목록
│   │   ├── request/new/     # 새 의뢰 등록
│   │   └── payments/        # 결제 내역
│   ├── translator/          # 번역가 페이지
│   │   ├── available/       # 신규 요청
│   │   ├── working/         # 진행 중 작업
│   │   └── completed/       # 완료된 작업
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx             # 통합 홈페이지
├── components/
│   ├── Header.tsx
│   ├── IconSidebar.tsx      # 60px 아이콘 사이드바
│   ├── Sidebar.tsx
│   ├── ClientSidebar.tsx    # 의뢰인용 사이드바
│   └── TranslatorSidebar.tsx # 번역가용 사이드바
├── types/
│   └── index.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 시작하기

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm run start
```

## 주요 기능

### 시험 응시 시스템
- ✅ 시험 응시자 마이페이지
- ✅ IconSidebar + Sidebar 듀얼 네비게이션

### 번역 서비스
- ✅ 번역 의뢰인
  - 새 의뢰 등록 (가격 계산기)
  - 의뢰 목록 관리
  - 결제 내역
  
- ✅ 번역가
  - 신규 요청 확인
  - 작업 관리
  - 수익 관리

## 통합 포인트

- exam 폴더의 시험 시스템과 번역 폴더의 번역 서비스를 하나의 플랫폼으로 통합
- 일관된 디자인 시스템 (IconSidebar 60px + Sidebar 220px)
- 공통 컴포넌트 재사용
- TypeScript 타입 안정성
