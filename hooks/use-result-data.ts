import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  TotalScoreData,
  AnalysisResultStatistics,
  AnalysisResultDetail,
  CategoryData,
  PromptData,
} from "@/types";
import { apiClient } from "@/lib/api";

export function useResultData() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get("analysisId");

  const [totalScoreData, setTotalScoreData] = useState<TotalScoreData | null>(
    null
  );
  const [statistics, setStatistics] = useState<AnalysisResultStatistics | null>(
    null
  );
  const [detail, setDetail] = useState<AnalysisResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      if (!analysisId) {
        setError("분석 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [totalScore, statisticsData, detailData] = await Promise.all([
          apiClient.getTotalScoreList(),
          apiClient.getAnalysisResultStatistics(analysisId),
          apiClient.getAnalysisResultDetail(analysisId),
        ]);

        setTotalScoreData(totalScore);
        setStatistics(statisticsData);
        setDetail(detailData);
      } catch (err) {
        setError("결과 데이터를 불러오는데 실패했습니다.");
        console.error("Failed to load result data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [analysisId]);

  // 카테고리 차트 데이터 변환
  const getCategoryChartData = (): CategoryData[] => {
    if (!statistics) return [];

    return statistics.targetCompanyCategoryScoreList.map((target) => {
      const competitor = statistics.competitorCategoryAvgScoreList.find(
        (comp) => comp.categoryNo === target.categoryNo
      );
      return {
        name: target.categoryName,
        ourScore: target.companyScore,
        competitorScore: competitor?.companyScore || 0,
      };
    });
  };

  // 강점 카테고리 찾기
  const getStrongestCategory = (): string => {
    if (!statistics) return "";

    const maxScore = Math.max(
      ...statistics.targetCompanyCategoryScoreList.map(
        (cat) => cat.companyScore
      )
    );
    const strongest = statistics.targetCompanyCategoryScoreList.find(
      (cat) => cat.companyScore === maxScore
    );
    return strongest?.categoryName || "";
  };

  // 약점 카테고리 찾기
  const getWeakestCategory = (): string => {
    if (!statistics) return "";

    const minScore = Math.min(
      ...statistics.targetCompanyCategoryScoreList.map(
        (cat) => cat.companyScore
      )
    );
    const weakest = statistics.targetCompanyCategoryScoreList.find(
      (cat) => cat.companyScore === minScore
    );
    return weakest?.categoryName || "";
  };

  // 업계 평균 대비 백분율 계산
  const getIndustryComparison = (): string => {
    if (!totalScoreData) return "";

    const difference =
      totalScoreData.targetTotalScore - totalScoreData.competitorAvgTotalScore;
    const percentage =
      (difference / totalScoreData.competitorAvgTotalScore) * 100;

    if (percentage > 0) {
      return `+${percentage.toFixed(1)}%`;
    } else {
      return `${percentage.toFixed(1)}%`;
    }
  };

  // 프롬프트 데이터 변환
  const getPromptData = (): PromptData[] => {
    if (!detail) return [];

    return detail.qaList.map((qa) => ({
      question: qa.question,
      category: qa.targetCompanyInfo.companyName, // 임시로 회사명 사용
      score: qa.targetCompanyInfo.companyCategoryScore,
      analysis: qa.targetCompanyInfo.content || qa.targetCompanyInfo.summary,
      positiveKeywords: qa.targetCompanyInfo.positiveKeyword || [],
      negativeKeywords: qa.targetCompanyInfo.negativeKeyword || [],
      competitors: qa.competitorCompanyInfo.map((comp) => ({
        name: comp.companyName,
        score: comp.companyCategoryScore,
        description: comp.summary,
      })),
    }));
  };

  return {
    analysisId,
    totalScoreData,
    statistics,
    detail,
    loading,
    error,
    getCategoryChartData,
    getStrongestCategory,
    getWeakestCategory,
    getIndustryComparison,
    getPromptData,
  };
}
