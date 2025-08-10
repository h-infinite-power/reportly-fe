export interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  hasInfo?: boolean;
  subtitleClassName?: string;
}

export interface InsightCardProps {
  type: "strength" | "weakness" | "improvement";
  title: string;
  content: string;
}

export interface CategoryData {
  name: string;
  ourScore: number;
  competitorScore: number;
}

export interface CompetitorData {
  name: string;
  score: number;
  description: string;
}

export interface PromptData {
  question: string;
  category: string;
  score: number;
  analysis: string;
  positiveKeywords: string[];
  negativeKeywords: string[];
  competitors: CompetitorData[];
}

export interface KeywordTagProps {
  keyword: string;
  type: "positive" | "negative";
}

// API Response Types
export interface Company {
  companyNo: string;
  companyName: string;
}

export interface Industry {
  industryNo: string;
  industryName: string;
}

export interface AnalysisResult {
  key: string;
  no: string;
}

export interface AnalysisRequest {
  targetCompanyNo: string;
  industryNo: string;
  competitorCompanyNoList: string[];
}

// Form Types
export interface AnalysisFormData {
  targetCompanyNo: string;
  industryNo: string;
  competitorCompanyNoList: string[];
}

// Result Page Types
export interface TotalScoreData {
  targetRank: number;
  targetCompanyNo: string;
  targetTotalScore: number;
  competitorAvgTotalScore: number;
  totalCompanyCount: number;
}

export interface CategoryScore {
  categoryNo: string;
  categoryName: string;
  categoryScore: number;
}

export interface AnalysisResultStatistics {
  targetCompanyCategoryScoreList: CategoryScore[];
  competitorCategoryAvgScoreList: CategoryScore[];
}

// 수정: categoryScore -> companyScore로 변경 (API 명세 및 더미 참고)
export interface AnalysisResultScores {
  categoryNo: string;
  categoryName: string;
  companyScore: number;
}

// CompanyInfo는 QA 데이터 내 targetCompanyInfo, competitorCompanyInfo 형태로 맞춤
export interface CompanyInfo {
  companyNo: string;
  companyName: string;
  summary: string;
  content?: string; // 상세 내용은 optional
  positiveKeyword?: string[]; // 복수형 키워드 배열로 변경
  negativeKeyword?: string[];
  companyCategoryScore: number;
  analysisResultNo?: string; // 분석 결과 번호 (optional)
}

// QA 데이터 구조에 맞춤
export interface QAData {
  questionNo: string;
  categoryNo: string;
  categoryName: string; // API 문서에 따라 추가
  question: string;
  targetCompanyInfo: CompanyInfo;
  competitorCompanyInfo: CompanyInfo[];
}

export interface AnalysisResultDetail {
  strongPoint: string;
  weakPoint: string;
  improvements: string;
  qaList: QAData[];
  competitorCompanyInfoList: CompanyInfo[];
}
