import { Company, Industry, AnalysisResult, AnalysisRequest } from "@/types";

const API_BASE_URL = "https://h-infinite-power.store/reportly-api";

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
  }

  // 브랜드 목록 조회
  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>("/companies");
  }

  // 업종 목록 조회
  async getIndustries(): Promise<Industry[]> {
    return this.request<Industry[]>("/industries");
  }

  // 분석 결과 생성
  async createAnalysisResult(data: AnalysisRequest): Promise<AnalysisResult> {
    return this.request<AnalysisResult>("/analysis-results", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
