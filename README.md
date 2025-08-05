# Reportly - LLM 시선 기반 브랜드 평가 시스템

LLM이 인식하는 브랜드 이미지를 분석하고, 경쟁사와의 포지셔닝을 시각화하여 제공하는 시스템입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# 로컬 개발 환경 (Node.js 서버가 8080 포트에서 실행될 때)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/reportly-api

# 프로덕션 환경 (기본값)
# NEXT_PUBLIC_API_BASE_URL=https://h-infinite-power.store/reportly-api
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3001](http://localhost:3001)을 열어 애플리케이션을 확인하세요.

## 🔧 환경 설정

### 로컬 개발 환경

1. **Node.js 백엔드 서버 실행** (8080 포트)
2. **환경 변수 설정**:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/reportly-api
   ```
3. **프론트엔드 실행**:
   ```bash
   npm run dev
   ```

### 프로덕션 환경

1. **환경 변수 설정** (선택사항):
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://h-infinite-power.store/reportly-api
   ```
2. **빌드 및 배포**:
   ```bash
   npm run build
   npm start
   ```

## 📊 기능

### 메인페이지

- 브랜드 선택 (API에서 동적 로드)
- 업종 선택 (이커머스, 금융/핀테크 등)
- 경쟁사 선택 (최대 3개)
- AI 분석 시작

### 결과페이지

- 종합 점수 및 경쟁력 순위
- 강점/약점 카테고리 분석
- AI 인사이트 요약 (강점, 약점, 개선제안)
- 카테고리별 점수 차트
- 레이더 차트 (경쟁사 비교)
- 프롬프트 분석 상세 내용

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **상태 관리**: React Hooks
- **API**: RESTful API 연동
- **개발 도구**: ESLint, Prettier

## 📁 프로젝트 구조

```
reportly-fe/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인페이지
│   └── result/
│       └── page.tsx       # 결과페이지
├── components/             # 재사용 가능한 컴포넌트
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 및 API 클라이언트
├── types/                 # TypeScript 타입 정의
└── docs/                  # 프로젝트 문서
```

## 🔍 테스트

### 더미데이터 테스트

현재 API 서버가 없어도 더미데이터로 테스트할 수 있습니다:

1. 브라우저 개발자 도구 콘솔 열기 (F12)
2. 메인페이지에서 브랜드, 업종, 경쟁사 선택
3. "AI 분석 시작하기" 클릭
4. 콘솔에서 API 호출 로그 및 더미데이터 확인

### 로컬 API 서버 테스트

Node.js 백엔드 서버를 8080 포트에서 실행하면 실제 API와 연동됩니다.

## 📝 API 문서

자세한 API 명세는 `docs/rest-api/` 폴더를 참조하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
