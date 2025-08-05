const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 8080;

// 미들웨어 설정
app.use(helmet()); // 보안 헤더 설정
app.use(cors()); // CORS 설정
app.use(morgan("combined")); // 로깅
app.use(express.json()); // JSON 파싱

// 더미 데이터
const companies = [
  { companyNo: "101", companyName: "스타벅스" },
  { companyNo: "102", companyName: "이디야커피" },
  { companyNo: "103", companyName: "투썸플레이스" },
  { companyNo: "104", companyName: "할리스커피" },
  { companyNo: "105", companyName: "커피빈" },
  { companyNo: "106", companyName: "폴바셋" },
  { companyNo: "107", companyName: "탐앤탐스" },
  { companyNo: "108", companyName: "스무디킹" },
];

const industries = [
  { industryNo: "1", industryName: "이커머스" },
  { industryNo: "2", industryName: "금융/핀테크" },
  { industryNo: "3", industryName: "외식" },
  { industryNo: "4", industryName: "프랜차이즈" },
];

// 분석 결과 저장소 (메모리 기반)
const analysisResults = new Map();

// API 라우트

// 1. 브랜드 목록 조회
app.get("/reportly-api/companies", (req, res) => {
  console.log("📊 브랜드 목록 요청");
  res.json(companies);
});

// 2. 업종 목록 조회
app.get("/reportly-api/industries", (req, res) => {
  console.log("📊 업종 목록 요청");
  res.json(industries);
});

// 3. 분석 결과 생성
app.post("/reportly-api/analysis-results", (req, res) => {
  const { targetCompanyNo, industryNo, competitorCompanyNoList } = req.body;

  console.log("📊 분석 요청:", {
    targetCompanyNo,
    industryNo,
    competitorCompanyNoList,
  });

  // 분석 결과 ID 생성
  const analysisResultNo = Date.now().toString();

  // 분석 결과 저장
  analysisResults.set(analysisResultNo, {
    targetCompanyNo,
    industryNo,
    competitorCompanyNoList,
    createdAt: new Date().toISOString(),
  });

  console.log("📊 분석 결과 생성:", analysisResultNo);

  res.status(201).json({ analysisResultNo });
});

// 4. 종합 점수 목록 조회
app.get("/reportly-api/analysis-results/total-score-list", (req, res) => {
  console.log("📊 종합 점수 목록 요청");

  const totalScoreData = {
    targetRank: 2,
    targetCompanyNo: "101",
    targetTotalScore: 87,
    competitorAvgTotalScore: 76,
    totalCompanyCount: 4,
  };

  res.json(totalScoreData);
});

// 5. 분석 결과 통계 조회
app.get(
  "/reportly-api/analysis-results/:analysisResultId/analysis-result-score-statistics",
  (req, res) => {
    const { analysisResultId } = req.params;

    console.log("📊 분석 결과 통계 요청:", analysisResultId);

    const statistics = {
      targetCompanyCategoryScoreList: [
        { categoryNo: "10", categoryName: "브랜딩", companyScore: 92 },
        { categoryNo: "11", categoryName: "마케팅", companyScore: 88 },
        { categoryNo: "12", categoryName: "고객경험", companyScore: 85 },
        { categoryNo: "13", categoryName: "혁신성", companyScore: 90 },
        { categoryNo: "14", categoryName: "신뢰도", companyScore: 82 },
        { categoryNo: "15", categoryName: "가격경쟁력", companyScore: 78 },
        { categoryNo: "16", categoryName: "서비스품질", companyScore: 86 },
      ],
      competitorCategoryAvgScoreList: [
        { categoryNo: "10", categoryName: "브랜딩", companyScore: 84 },
        { categoryNo: "11", categoryName: "마케팅", companyScore: 82 },
        { categoryNo: "12", categoryName: "고객경험", companyScore: 79 },
        { categoryNo: "13", categoryName: "혁신성", companyScore: 85 },
        { categoryNo: "14", categoryName: "신뢰도", companyScore: 76 },
        { categoryNo: "15", categoryName: "가격경쟁력", companyScore: 72 },
        { categoryNo: "16", categoryName: "서비스품질", companyScore: 81 },
      ],
    };

    res.json(statistics);
  }
);

// 6. 분석 결과 점수 조회
app.get(
  "/reportly-api/analysis-results/:analysisResultId/analysis-result-scores",
  (req, res) => {
    const { analysisResultId } = req.params;
    const { companyNo } = req.query;

    console.log("📊 분석 결과 점수 요청:", { analysisResultId, companyNo });

    const scores = [
      { categoryNo: "10", categoryName: "브랜딩", companyScore: 92 },
      { categoryNo: "11", categoryName: "마케팅", companyScore: 88 },
      { categoryNo: "12", categoryName: "고객경험", companyScore: 85 },
      { categoryNo: "13", categoryName: "혁신성", companyScore: 90 },
      { categoryNo: "14", categoryName: "신뢰도", companyScore: 82 },
      { categoryNo: "15", categoryName: "가격경쟁력", companyScore: 78 },
      { categoryNo: "16", categoryName: "서비스품질", companyScore: 86 },
    ];

    res.json(scores);
  }
);

// 7. 분석 결과 상세 조회
app.get("/reportly-api/analysis-results/:analysisResultId", (req, res) => {
  const { analysisResultId } = req.params;

  console.log("📊 분석 결과 상세 요청:", analysisResultId);

  const detail = {
    strongPoint:
      "스타벅스는 뛰어난 브랜드 인지도와 일관된 고품질 서비스로 경쟁사 대비 강력한 우위를 확보했습니다. 프리미엄 이미지와 고객 충성도가 높습니다.",
    weakPoint:
      "가격 경쟁력이 상대적으로 낮아 대중적 접근성에 한계가 있습니다. 일부 고객층에게는 부담스러운 가격대입니다.",
    improvements:
      "디지털 주문 시스템과 모바일 앱을 더욱 개선하여 고객 편의성을 높이고, 다양한 가격대의 메뉴를 확대하여 접근성을 개선하세요.",
    qaList: [
      {
        questionNo: "1",
        categoryNo: "10",
        question: "브랜드의 제품 혁신 전략은 얼마나 일관되고 경쟁력이 있는가?",
        targetCompanyInfo: {
          companyNo: "101",
          companyName: "스타벅스",
          summary:
            "스타벅스는 지속적인 제품 혁신과 품질 관리로 브랜드 가치를 유지하고 있습니다.",
          content:
            "스타벅스는 고품질 원두와 다양한 음료 라인업을 통해 지속적인 혁신을 이어가고 있습니다. 시즌별 한정 메뉴와 새로운 음료 개발로 고객의 관심을 끌고 있으며, 원두의 품질 관리와 로스팅 기술에 대한 투자를 지속하고 있습니다.",
          positiveKeyword: ["고품질", "혁신", "프리미엄"],
          negativeKeyword: ["고가", "부담", "제한적"],
          companyCategoryScore: 92,
        },
        competitorCompanyInfo: [
          {
            companyNo: "102",
            companyName: "이디야커피",
            summary: "합리적인 가격과 다양한 메뉴로 대중적 접근성을 확보",
            companyCategoryScore: 85,
          },
          {
            companyNo: "103",
            companyName: "투썸플레이스",
            summary: "창의적인 메뉴 개발과 브랜드 차별화에 집중",
            companyCategoryScore: 88,
          },
          {
            companyNo: "104",
            companyName: "할리스커피",
            summary: "전통적인 커피 문화와 현대적 감각의 조화",
            companyCategoryScore: 82,
          },
        ],
      },
      {
        questionNo: "2",
        categoryNo: "11",
        question: "브랜드의 마케팅 전략과 고객 접점은 얼마나 효과적인가?",
        targetCompanyInfo: {
          companyNo: "101",
          companyName: "스타벅스",
          summary:
            "스타벅스는 강력한 디지털 마케팅과 고객 경험 중심의 전략을 구사하고 있습니다.",
          content:
            "스타벅스 앱을 통한 개인화된 마케팅과 스타벅스 리워드 프로그램을 통해 고객 충성도를 높이고 있습니다. 소셜미디어를 활용한 브랜드 스토리텔링과 시즌별 캠페인으로 브랜드 인지도를 지속적으로 관리하고 있습니다.",
          positiveKeyword: ["디지털", "개인화", "충성도"],
          negativeKeyword: ["복잡", "제한적", "비용"],
          companyCategoryScore: 88,
        },
        competitorCompanyInfo: [
          {
            companyNo: "102",
            companyName: "이디야커피",
            summary: "대중적 마케팅과 접근성 중심의 전략",
            companyCategoryScore: 82,
          },
          {
            companyNo: "103",
            companyName: "투썸플레이스",
            summary: "창의적 마케팅과 젊은 고객층 타겟팅",
            companyCategoryScore: 86,
          },
          {
            companyNo: "104",
            companyName: "할리스커피",
            summary: "전통적 마케팅과 브랜드 스토리 중심",
            companyCategoryScore: 80,
          },
        ],
      },
    ],
  };

  res.json(detail);
});

// 헬스 체크 엔드포인트
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 핸들러
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error("❌ 서버 에러:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Reportly API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 서버 주소: http://localhost:${PORT}`);
  console.log(`📊 API 엔드포인트: http://localhost:${PORT}/reportly-api`);
  console.log(`💚 헬스 체크: http://localhost:${PORT}/health`);
});
