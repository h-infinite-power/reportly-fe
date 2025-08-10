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
  const analysisResultNo = searchParams.get("analysisResultNo");

  // 디버깅을 위한 로그
  console.log("🔍 useResultData Debug:", { jobNo, analysisResultNo });

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

        // jobNo가 있으면 기본 데이터 로드 시도
        if (jobNo) {
          console.log("📊 기본 데이터 로드 시도:", jobNo);
          try {
            const [totalScore, statisticsData] = await Promise.all([
              apiClient.getTotalScoreList(jobNo),
              apiClient.getAnalysisResultStatistics(jobNo),
            ]);
            console.log("✅ 기본 데이터 로드 성공:", {
              totalScore: !!totalScore,
              statistics: !!statisticsData,
            });
            setTotalScoreData(totalScore);
            setStatistics(statisticsData);
          } catch (err) {
            console.warn("❌ 기본 데이터 로드 실패:", err);
          }
        }

        // analysisResultNo가 있으면 상세 데이터 로드 시도
        if (analysisResultNo) {
          console.log("📋 상세 데이터 로드 시도:", analysisResultNo);
          try {
            const detailData = await apiClient.getAnalysisResultDetail(
              analysisResultNo
            );
            console.log("✅ 상세 데이터 로드 성공:", !!detailData);
            setDetail(detailData);
          } catch (err) {
            console.warn("❌ 상세 데이터 로드 실패:", err);
          }
        }

        // 일부 데이터라도 로드되었으면 에러 상태 해제
        if (totalScoreData || statistics || detail) {
          setError(null);
        }
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
        // 전체 실패시에만 에러 상태 설정
        if (!totalScoreData && !statistics && !detail) {
          setError("결과 데이터를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobNo, analysisResultNo]);

  // 카테고리 차트 데이터 변환
  const getCategoryChartData = (): CategoryData[] => {
    if (!statistics) return [];

    // targetCompanyCategoryScoreList가 비어있으면 competitor 데이터만 사용
    if (statistics.targetCompanyCategoryScoreList.length === 0) {
      return statistics.competitorCategoryAvgScoreList.map((comp) => ({
        name: comp.categoryName,
        ourScore: 0, // 타겟 데이터가 없으므로 0으로 설정
        competitorScore: comp.categoryScore,
      }));
    }

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

    // targetCompanyCategoryScoreList가 비어있으면 competitor 데이터에서 가장 높은 점수 카테고리 반환
    if (statistics.targetCompanyCategoryScoreList.length === 0) {
      const maxScore = Math.max(
        ...statistics.competitorCategoryAvgScoreList.map(
          (cat) => cat.categoryScore
        )
      );
      return (
        statistics.competitorCategoryAvgScoreList.find(
          (cat) => cat.categoryScore === maxScore
        )?.categoryName || ""
      );
    }

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

    // targetCompanyCategoryScoreList가 비어있으면 competitor 데이터에서 가장 낮은 점수 카테고리 반환
    if (statistics.targetCompanyCategoryScoreList.length === 0) {
      const minScore = Math.min(
        ...statistics.competitorCategoryAvgScoreList.map(
          (cat) => cat.categoryScore
        )
      );
      return (
        statistics.competitorCategoryAvgScoreList.find(
          (cat) => cat.categoryScore === minScore
        )?.categoryName || ""
      );
    }

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
    analysisResultNo,
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
