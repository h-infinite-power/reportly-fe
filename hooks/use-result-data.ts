"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  TotalScoreData,
  AnalysisResultStatistics,
  AnalysisResultDetail,
  CategoryData,
  PromptData,
  AnalysisResultScores,
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
  const [companyInfo, setCompanyInfo] = useState<
    {
      companyNo: string;
      companyName: string;
      analysisResultNo: string;
      targetCompanyYn: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // jobNo가 있으면 기본 데이터와 회사 정보 로드 시도
        if (jobNo) {
          console.log("📊 기본 데이터 로드 시도:", jobNo);
          try {
            const [totalScore, statisticsData, companyData] = await Promise.all(
              [
                apiClient.getTotalScoreList(jobNo),
                apiClient.getAnalysisResultStatistics(jobNo),
                apiClient.getAnalysisResultsInfo(jobNo),
              ]
            );
            console.log("✅ 기본 데이터 로드 성공:", {
              totalScore: !!totalScore,
              statistics: !!statisticsData,
              companyInfo: !!companyData,
            });
            setTotalScoreData(totalScore);
            setStatistics(statisticsData);
            setCompanyInfo(companyData);
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
        if (totalScoreData || statistics || detail || companyInfo.length > 0) {
          setError(null);
        }
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
        // 전체 실패시에만 에러 상태 설정
        if (
          !totalScoreData &&
          !statistics &&
          !detail &&
          companyInfo.length === 0
        ) {
          setError("결과 데이터를 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [jobNo, analysisResultNo]);

  // 첫 번째 기업 이름 가져오기 (대상 기업)
  const getFirstCompanyName = (): string => {
    if (companyInfo.length > 0) {
      // targetCompanyYn이 'Y'인 회사를 찾아서 반환
      const targetCompany = companyInfo.find(
        (company) => company.targetCompanyYn === "Y"
      );
      if (targetCompany) {
        return targetCompany.companyName;
      }
      // targetCompanyYn이 'Y'인 회사가 없으면 첫 번째 회사 반환
      return companyInfo[0].companyName;
    }
    return detail?.qaList[0]?.targetCompanyInfo.companyName || "분석 대상";
  };

  // 카테고리 차트 데이터 변환
  const getCategoryChartData = (): CategoryData[] => {
    if (!statistics) return [];

    // targetCompanyCategoryScoreList가 비어있으면 competitor 데이터만 사용
    if (statistics.targetCompanyCategoryScoreList.length === 0) {
      return statistics.competitorCategoryAvgScoreList.map((comp) => ({
        name: comp.categoryName,
        ourScore: Math.round(comp.categoryScore), // 업계 평균을 우리 점수로 사용 (비교를 위해)
        competitorScore: Math.round(comp.categoryScore), // 업계 평균을 경쟁사 점수로도 사용
      }));
    }

    // targetCompanyCategoryScoreList와 competitorCategoryAvgScoreList를 매칭해서 차트 데이터 생성
    return statistics.targetCompanyCategoryScoreList.map((target) => {
      const competitor = statistics.competitorCategoryAvgScoreList.find(
        (comp) => comp.categoryNo === target.categoryNo
      );
      return {
        name: target.categoryName,
        ourScore: Math.round(target.categoryScore), // 소수점 제거
        competitorScore: Math.round(competitor?.categoryScore || 0), // 소수점 제거
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
      category: qa.categoryName, // API에서 제공하는 categoryName 사용
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

  // 선택된 경쟁사의 카테고리별 점수 조회
  const getCompetitorScores = useCallback(
    async (analysisResultNo: string): Promise<AnalysisResultScores[]> => {
      try {
        return await apiClient.getAnalysisResultScores(analysisResultNo);
      } catch (error) {
        console.error("경쟁사 점수 조회 실패:", error);
        return [];
      }
    },
    []
  );

  return {
    jobNo,
    analysisResultNo,
    totalScoreData,
    statistics,
    detail,
    companyInfo,
    loading,
    error,
    getFirstCompanyName,
    getCategoryChartData,
    getStrongestCategory,
    getWeakestCategory,
    getIndustryComparison,
    getPromptData,
    getCompetitorScores,
  };
}
