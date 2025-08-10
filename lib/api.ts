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
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:8080/reportly-api";
    }
  }

  return "https://h-infinite-power.store/reportly-api";
};

const API_BASE_URL = getApiBaseUrl();

/* ------------------ API 클라이언트 ------------------ */

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
    console.log(`🚀 API 호출: ${url}`);
    console.log(
      `📍 환경: ${this.baseUrl.includes("localhost") ? "로컬" : "프로덕션"}`
    );

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

      return (await response.json()) as T;
    } catch (error) {
      console.error(`❌ API 요청 실패: ${endpoint}`, error);
      throw error;
    }
  }

  // (레거시) 브랜드 목록 조회
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>("/companies");
  }

  // (레거시) 업종 목록 조회
  async getIndustries(): Promise<Industry[]> {
    return this.request<Industry[]>("/industries");
  }

  // 브랜드 추가 (레거시 엔드포인트)
  async addCompany(companyName: string): Promise<Company> {
    console.log("📢 브랜드 추가 요청:", companyName);
    const res = await this.request<{ companyNo: string }>("/companies", {
      method: "POST",
      body: JSON.stringify({ companyName }),
    });
    return { companyNo: res.companyNo, companyName };
  }

  // 업종 추가 (레거시 엔드포인트)
  async addIndustry(industryName: string): Promise<Industry> {
    console.log("📢 업종 추가 요청:", industryName);
    const res = await this.request<{ industryNo: string }>("/industries", {
      method: "POST",
      body: JSON.stringify({ industryName }),
    });
    return { industryNo: res.industryNo, industryName };
  }

  // 분석 결과 생성 (jobNo 기준)
  async createAnalysisResult(
    jobNo: string,
    data: AnalysisRequest
  ): Promise<AnalysisResult> {
    console.log("📊 분석 요청 데이터:", data, "jobNo:", jobNo);
    const res = await this.request<{ key: string; no: string }>(`/jobs`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { key: res.key, no: res.no };
  }

  // 종합 점수 목록 조회
  async getTotalScoreList(jobNo: string): Promise<TotalScoreData> {
    return this.request<TotalScoreData>(`/jobs/${jobNo}/total-score-list`);
  }

  // 분석 결과 통계 조회
  async getAnalysisResultStatistics(
    jobNo: string
  ): Promise<AnalysisResultStatistics> {
    return this.request<AnalysisResultStatistics>(
      `/jobs/${jobNo}/analysis-result-score-statistics`
    );
  }

  // 분석 결과 회사 목록 조회
  async getAnalysisResultsInfo(jobNo: string): Promise<
    {
      companyNo: string;
      companyName: string;
      analysisResultNo: string;
      targetCompanyYn: string;
    }[]
  > {
    return this.request(`/jobs/${jobNo}/analysisResults/info`);
  }

  // 분석 결과 카테고리별 점수 조회
  async getAnalysisResultScores(
    analysisResultNo: string
  ): Promise<AnalysisResultScores[]> {
    return this.request<AnalysisResultScores[]>(
      `/analysis-results/${analysisResultNo}/analysis-result-scores`
    );
  }

  // 분석 결과 상세 조회
  async getAnalysisResultDetail(
    analysisResultNo: string
  ): Promise<AnalysisResultDetail> {
    return this.request<AnalysisResultDetail>(
      `/analysis-results/${analysisResultNo}`
    );
  }
}

/* ------------------ 인스턴스 export ------------------ */

export const apiClient = new ApiClient(API_BASE_URL);
