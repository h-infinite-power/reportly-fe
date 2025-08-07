import {
  Company,
  Industry,
  AnalysisResult,
  AnalysisRequest,
  TotalScoreData,
  AnalysisResultStatistics,
  AnalysisResultScores,
  AnalysisResultDetail,
} from "@/types";

// 환경에 따른 API 주소 설정
const getApiBaseUrl = () => {
  // 환경 변수 우선 확인
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    // 클라이언트 사이드에서 환경 확인
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8080/reportly-api";
    }
  }

  // 프로덕션 환경 또는 서버 사이드
  return "https://h-infinite-power.store/reportly-api";
};

const API_BASE_URL = getApiBaseUrl();

// 더미데이터
const DUMMY_COMPANIES: Company[] = [
  { companyNo: "101", companyName: "스타벅스" },
  { companyNo: "102", companyName: "이디야커피" },
  { companyNo: "103", companyName: "투썸플레이스" },
  { companyNo: "104", companyName: "할리스커피" },
  { companyNo: "105", companyName: "커피빈" },
  { companyNo: "106", companyName: "폴바셋" },
  { companyNo: "107", companyName: "탐앤탐스" },
  { companyNo: "108", companyName: "스무디킹" },
];

const DUMMY_INDUSTRIES: Industry[] = [
  { industryNo: "1", industryName: "이커머스" },
  { industryNo: "2", industryName: "금융/핀테크" },
  { industryNo: "3", industryName: "외식" },
  { industryNo: "4", industryName: "프랜차이즈" },
];

const DUMMY_TOTAL_SCORE: TotalScoreData = {
  targetRank: 2,
  targetCompanyNo: "101",
  targetTotalScore: 87,
  competitorAvgTotalScore: 76,
  totalCompanyCount: 4,
};

const DUMMY_STATISTICS: AnalysisResultStatistics = {
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

const DUMMY_DETAIL: AnalysisResultDetail = {
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

// API 클라이언트
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // 더미데이터 사용 (실제 API 호출 대신)
    console.log(`🚀 API 호출: ${url}`);
    console.log(
      `📍 환경: ${this.baseUrl.includes("localhost") ? "로컬" : "프로덕션"}`
    );

    // 실제 API 호출 시뮬레이션
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.log(`❌ API 호출 실패, 더미데이터 사용: ${endpoint}`);

      // 더미데이터 반환
      switch (endpoint) {
        case "/companies":
          console.log("📊 더미 브랜드 데이터:", DUMMY_COMPANIES);
          return DUMMY_COMPANIES as T;
        case "/industries":
          console.log("📊 더미 업종 데이터:", DUMMY_INDUSTRIES);
          return DUMMY_INDUSTRIES as T;
        case "/analysis-results/total-score-list":
          console.log("📊 더미 종합 점수 데이터:", DUMMY_TOTAL_SCORE);
          return DUMMY_TOTAL_SCORE as T;
        case "/analysis-results/1001/analysis-result-score-statistics":
          console.log("📊 더미 통계 데이터:", DUMMY_STATISTICS);
          return DUMMY_STATISTICS as T;
        case "/analysis-results/1001":
          console.log("📊 더미 상세 데이터:", DUMMY_DETAIL);
          return DUMMY_DETAIL as T;
        default:
          if (
            endpoint.includes("/analysis-results/") &&
            endpoint.includes("/analysis-result-score-statistics")
          ) {
            console.log("📊 더미 통계 데이터:", DUMMY_STATISTICS);
            return DUMMY_STATISTICS as T;
          }
          if (
            endpoint.includes("/analysis-results/") &&
            !endpoint.includes("/analysis-result-score-statistics") &&
            !endpoint.includes("/analysis-result-scores")
          ) {
            console.log("📊 더미 상세 데이터:", DUMMY_DETAIL);
            return DUMMY_DETAIL as T;
          }
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }
    }
  }

  // 브랜드 목록 조회
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>("/companies");
  }

  // 업종 목록 조회
  async getIndustries(): Promise<Industry[]> {
    return this.request<Industry[]>("/industries");
  }

  // 브랜드 추가
  async addCompany(companyName: string): Promise<Company> {
    console.log("📢 브랜드 추가 요청:", companyName);
    // 실제 API 호출 (엔드포인트 명확히)
    const res = await this.request<{ companyNo: string }>("/companies", {
      method: "POST",
      body: JSON.stringify({ companyName }),
    });
    // 응답값이 번호만 오므로 이름과 조합
    return { companyNo: res.companyNo, companyName };
  }

  // 업종 추가
  async addIndustry(industryName: string): Promise<Industry> {
    console.log("📢 업종 추가 요청:", industryName);
    // 실제 API 호출 (엔드포인트 명확히)
    const res = await this.request<{ industryNo: string }>("/industries", {
      method: "POST",
      body: JSON.stringify({ industryName }),
    });
    // 응답값이 번호만 오므로 이름과 조합
    return { industryNo: res.industryNo, industryName };
  }

  // 분석 결과 생성
  async createAnalysisResult(data: AnalysisRequest): Promise<AnalysisResult> {
    console.log("📊 분석 요청 데이터:", data);
    const result = { analysisResultNo: "1001" };
    console.log("📊 분석 결과 ID:", result);
    return result;
  }

  // 종합 점수 목록 조회
  async getTotalScoreList(): Promise<TotalScoreData> {
    return this.request<TotalScoreData>("/analysis-results/total-score-list");
  }

  // 분석 결과 통계 조회
  async getAnalysisResultStatistics(
    analysisResultId: string
  ): Promise<AnalysisResultStatistics> {
    return this.request<AnalysisResultStatistics>(
      `/analysis-results/${analysisResultId}/analysis-result-score-statistics`
    );
  }

  // 분석 결과 점수 조회
  async getAnalysisResultScores(
    analysisResultId: string,
    companyNo: string
  ): Promise<AnalysisResultScores[]> {
    return this.request<AnalysisResultScores[]>(
      `/analysis-results/${analysisResultId}/analysis-result-scores?companyNo=${companyNo}`
    );
  }

  // 분석 결과 상세 조회
  async getAnalysisResultDetail(
    analysisResultId: string
  ): Promise<AnalysisResultDetail> {
    return this.request<AnalysisResultDetail>(
      `/analysis-results/${analysisResultId}`
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
