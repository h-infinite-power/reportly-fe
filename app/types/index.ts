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
