# Reportly Frontend

Reportly는 AI 기반 브랜드 분석 리포트를 제공하는 웹 애플리케이션입니다.

## 주요 기능

- **AI 분석 리포트**: LLM 기반 브랜드 분석 결과 제공
- **카테고리별 점수 비교**: 다양한 카테고리에서의 경쟁력 분석
- **경쟁사 비교**: 업계 내 경쟁사와의 비교 분석
- **PDF 다운로드**: 분석 결과를 PDF 형태로 다운로드 가능
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## PDF 다운로드 기능

### 특징

- **고품질 PDF 생성**: html2canvas와 jsPDF를 사용한 고품질 변환
- **차트 지원**: SVG 차트와 그래프가 포함된 완벽한 PDF 생성
- **진행 상황 표시**: PDF 생성 진행률을 실시간으로 확인
- **에러 처리**: 생성 실패 시 적절한 에러 메시지 표시

### 사용법

1. 결과지 페이지에서 우측 상단의 "리포트 다운" 버튼 클릭
2. PDF 생성 진행 상황 확인
3. 생성 완료 시 자동으로 다운로드
4. 파일명: `reportly-report-YYYY-MM-DD.pdf`

### 기술적 특징

- **oklch 색상 함수 오류 방지**: 안전한 hex 색상으로 대체
- **SVG 렌더링 최적화**: 차트와 그래프의 완벽한 PDF 변환
- **메모리 효율성**: 대용량 콘텐츠도 안정적인 PDF 생성
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
- **PDF Generation**: html2canvas, jsPDF
- **State Management**: React Hooks
- **Build Tool**: Next.js

## 프로젝트 구조

```
reportly-fe/
├── app/                    # Next.js App Router
│   ├── result/            # 결과지 페이지
│   └── test-pdf/          # PDF 테스트 페이지
├── components/             # React 컴포넌트
│   ├── ui/                # UI 기본 컴포넌트
│   ├── Header.tsx         # 헤더 (PDF 다운로드 버튼 포함)
│   ├── PDFDownloadButton.tsx # PDF 다운로드 전용 버튼
│   └── ...                # 기타 컴포넌트
├── lib/                   # 유틸리티 함수
│   └── pdf-generator.ts   # PDF 생성 로직
├── hooks/                 # Custom React Hooks
└── types/                 # TypeScript 타입 정의
```

## PDF 생성 관련 파일

- `lib/pdf-generator.ts`: PDF 생성 핵심 로직
- `components/PDFDownloadButton.tsx`: PDF 다운로드 버튼 컴포넌트
- `app/globals.css`: PDF 전용 스타일 정의
- `app/test-pdf/page.tsx`: PDF 기능 테스트 페이지

## 문제 해결

### "oklch" 색상 함수 오류

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
