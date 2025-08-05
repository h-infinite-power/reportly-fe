export interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  hasInfo?: boolean;
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
  analysisResultNo: string;
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
  companyScore: number;
}

export interface AnalysisResultStatistics {
  targetCompanyCategoryScoreList: CategoryScore[];
  competitorCategoryAvgScoreList: CategoryScore[];
}

export interface AnalysisResultScores {
  categoryNo: string;
  categoryName: string;
  companyScore: number;
}

export interface CompanyInfo {
  companyNo: string;
  companyName: string;
  summary: string;
  content?: string;
  positiveKeyword?: string[];
  negativeKeyword?: string[];
  companyCategoryScore: number;
}

export interface QAData {
  questionNo: string;
  categoryNo: string;
  question: string;
  targetCompanyInfo: CompanyInfo;
  competitorCompanyInfo: CompanyInfo[];
}

export interface AnalysisResultDetail {
  strongPoint: string;
  weakPoint: string;
  improvements: string;
  qaList: QAData[];
}
