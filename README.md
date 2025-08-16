# Reportly Frontend

Reportly는 AI 기반 브랜드 분석 리포트를 제공하는 웹 애플리케이션입니다.

## 주요 기능

- **AI 분석 리포트**: LLM 기반 브랜드 분석 결과 제공
- **카테고리별 점수 비교**: 다양한 카테고리에서의 경쟁력 분석
- **경쟁사 비교**: 업계 내 경쟁사와의 비교 분석
- **리포트 프린트**: 분석 결과를 프린트 가능한 형태로 출력
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 리포트 프린트 기능

### 특징

- **브라우저 프린트 지원**: react-to-print를 사용한 안정적인 프린트
- **차트 지원**: SVG 차트와 그래프가 포함된 완벽한 프린트 출력
- **프린트 최적화**: 프린트 전용 CSS 스타일로 깔끔한 출력
- **즉시 프린트**: 별도 생성 과정 없이 바로 프린트 다이얼로그 열기

### 사용법

1. 결과지 페이지에서 우측 상단의 "리포트 다운" 버튼 클릭
2. 브라우저 프린트 다이얼로그가 열림
3. 프린터 설정 후 프린트 또는 PDF로 저장
4. 파일명: `reportly-{기업명}-분석결과`

### 기술적 특징

- **react-to-print**: 안정적이고 가벼운 프린트 솔루션
- **프린트 전용 CSS**: @media print로 최적화된 출력 스타일
- **차트 렌더링**: SVG 차트의 완벽한 프린트 지원
- **크로스 브라우저 지원**: 모든 최신 브라우저에서 작동

## 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Charts**: Custom SVG charts
- **Print Support**: react-to-print
- **State Management**: React Hooks
- **Build Tool**: Next.js

## 프로젝트 구조

```
reportly-fe/
├── app/                    # Next.js App Router
│   └── result/            # 결과지 페이지
├── components/             # React 컴포넌트
│   ├── ui/                # UI 기본 컴포넌트
│   ├── Header.tsx         # 헤더 (프린트 버튼 포함)
│   └── ...                # 기타 컴포넌트
├── hooks/                 # Custom React Hooks
└── types/                 # TypeScript 타입 정의
```

## 프린트 관련 파일

- `app/globals.css`: 프린트 전용 CSS 스타일 정의
- `components/Header.tsx`: 프린트 버튼이 포함된 헤더 컴포넌트

## 문제 해결

### 프린트 스타일 최적화

- Tailwind CSS v4의 oklch 색상 함수를 안전한 hex 색상으로 대체
- PDF 생성 시 색상 호환성 문제 해결

### 차트 렌더링 문제

- SVG 요소들의 PDF 변환 최적화
- 차트 컨테이너에 PDF 전용 스타일 적용

### 메모리 사용량

- 대용량 콘텐츠 처리 시 메모리 효율성 개선
- 이미지 타임아웃 및 압축 옵션 적용

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
