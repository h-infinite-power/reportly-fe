# Reportly API Server

Reportly 프론트엔드와 연동되는 Node.js API 서버입니다.

## 🚀 시작하기

### 1. 의존성 설치

```bash
cd server
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 프로덕션 서버 실행

```bash
npm start
```

서버는 기본적으로 8080 포트에서 실행됩니다.

## 📊 API 엔드포인트

### 기본 정보

- **서버 주소**: `http://localhost:8080`
- **API 베이스**: `http://localhost:8080/reportly-api`
- **헬스 체크**: `http://localhost:8080/health`

### API 목록

#### 1. 브랜드 목록 조회

```
GET /reportly-api/companies
```

#### 2. 업종 목록 조회

```
GET /reportly-api/industries
```

#### 3. 분석 결과 생성

```
POST /reportly-api/analysis-results
```

#### 4. 종합 점수 목록 조회

```
GET /reportly-api/analysis-results/total-score-list
```

#### 5. 분석 결과 통계 조회

```
GET /reportly-api/analysis-results/:analysisResultId/analysis-result-score-statistics
```

#### 6. 분석 결과 점수 조회

```
GET /reportly-api/analysis-results/:analysisResultId/analysis-result-scores?companyNo=:companyNo
```

#### 7. 분석 결과 상세 조회

```
GET /reportly-api/analysis-results/:analysisResultId
```

## 🛠️ 기술 스택

- **Runtime**: Node.js
- **Framework**: Express.js
- **Middleware**:
  - CORS (Cross-Origin Resource Sharing)
  - Helmet (보안 헤더)
  - Morgan (로깅)
  - Express JSON Parser

## 📁 프로젝트 구조

```
server/
├── package.json          # 의존성 및 스크립트
├── server.js            # 메인 서버 파일
└── README.md           # 서버 문서
```

## 🔧 환경 설정

### 포트 설정

기본 포트는 8080입니다. 환경 변수로 변경할 수 있습니다:

```bash
PORT=3000 npm start
```

### 개발 모드

nodemon을 사용하여 파일 변경 시 자동 재시작:

```bash
npm run dev
```

## 📝 로깅

서버는 모든 API 요청을 콘솔에 로깅합니다:

- 📊 브랜드 목록 요청
- 📊 업종 목록 요청
- 📊 분석 요청
- 📊 분석 결과 생성
- 📊 종합 점수 목록 요청
- 📊 분석 결과 통계 요청
- 📊 분석 결과 점수 요청
- 📊 분석 결과 상세 요청

## 🧪 테스트

### 헬스 체크

```bash
curl http://localhost:8080/health
```

### 브랜드 목록 조회

```bash
curl http://localhost:8080/reportly-api/companies
```

### 분석 요청

```bash
curl -X POST http://localhost:8080/reportly-api/analysis-results \
  -H "Content-Type: application/json" \
  -d '{
    "targetCompanyNo": "101",
    "industryNo": "3",
    "competitorCompanyNoList": ["102", "103"]
  }'
```

## 🔍 프론트엔드 연동

프론트엔드에서 서버와 연동하려면:

1. 프론트엔드 프로젝트 루트에 `.env.local` 파일 생성
2. 다음 내용 추가:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/reportly-api
   ```
3. 프론트엔드 서버 재시작

## 🚨 주의사항

- 현재는 메모리 기반 데이터 저장소를 사용합니다
- 서버 재시작 시 분석 결과 데이터가 초기화됩니다
- 프로덕션 환경에서는 데이터베이스 연동이 필요합니다

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
