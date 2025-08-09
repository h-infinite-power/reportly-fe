"use client";

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
  const jobNo = searchParams.get("jobNo");
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!jobNo || !analysisId) {
          throw new Error("필수 파라미터가 없습니다.");
        }

        const [totalScore, statisticsData, detailData] = await Promise.all([
          apiClient.getTotalScoreList(jobNo),
          apiClient.getAnalysisResultStatistics(jobNo),
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
  }, [jobNo, analysisId]);

  // 카테고리 차트 데이터 변환
  const getCategoryChartData = (): CategoryData[] => {
    if (!statistics) return [];

    return statistics.targetCompanyCategoryScoreList.map((target) => {
      const competitor = statistics.competitorCategoryAvgScoreList.find(
        (comp) => comp.categoryNo === target.categoryNo
      );
      return {
        name: target.categoryName,
        ourScore: target.categoryScore,
        competitorScore: competitor?.categoryScore || 0,
      };
    });
  };

  // 강점 카테고리
  const getStrongestCategory = (): string => {
    if (!statistics) return "";
    const maxScore = Math.max(
      ...statistics.targetCompanyCategoryScoreList.map(
        (cat) => cat.categoryScore
      )
    );
    return (
      statistics.targetCompanyCategoryScoreList.find(
        (cat) => cat.categoryScore === maxScore
      )?.categoryName || ""
    );
  };

  // 약점 카테고리
  const getWeakestCategory = (): string => {
    if (!statistics) return "";
    const minScore = Math.min(
      ...statistics.targetCompanyCategoryScoreList.map(
        (cat) => cat.categoryScore
      )
    );
    return (
      statistics.targetCompanyCategoryScoreList.find(
        (cat) => cat.categoryScore === minScore
      )?.categoryName || ""
    );
  };

  // 업계 평균 대비 백분율
  const getIndustryComparison = (): string => {
    if (!totalScoreData) return "";
    const diff =
      totalScoreData.targetTotalScore - totalScoreData.competitorAvgTotalScore;
    const percent = (diff / totalScoreData.competitorAvgTotalScore) * 100;
    return `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`;
  };

  // 프롬프트 데이터 변환
  const getPromptData = (): PromptData[] => {
    if (!detail) return [];
    return detail.qaList.map((qa) => ({
      question: qa.question,
      category: qa.targetCompanyInfo.companyName,
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
    jobNo,
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
