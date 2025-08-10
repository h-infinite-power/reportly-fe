"use client";

import { Suspense, useState, useEffect } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import InsightCard from "@/components/InsightCard";
import CategoryChart from "@/components/CategoryChart";
import RadarChart from "@/components/RadarChart";
import PromptItem from "@/components/PromptItem";
import CollapsedPromptItem from "@/components/CollapsedPromptItem";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import Footer from "@/components/Footer";
import { useResultData } from "@/hooks/use-result-data";
import { apiClient } from "@/lib/api"; // API 클라이언트 import 필요
import { AnalysisResultScores } from "@/types"; // 타입 import 필요

function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedPrompts, setExpandedPrompts] = useState<number[]>([0]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("");

  // URL에서 브랜드명 제거 - 이제 API에서 가져온 첫 번째 기업 이름 사용
  // const brandName = searchParams.get("brandName") || "";

  const {
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
  } = useResultData();

  // 디버깅을 위한 로그
  console.log("🔍 Result Page Debug:", {
    analysisResultNo,
    totalScoreData: !!totalScoreData,
    statistics: !!statistics,
    detail: !!detail,
    loading,
    error,
  });

  // 통계 데이터 디버깅
  if (statistics) {
    console.log("📊 Statistics Debug:", {
      targetCompanyCategories: statistics.targetCompanyCategoryScoreList.length,
      competitorCategories: statistics.competitorCategoryAvgScoreList.length,
      targetData: statistics.targetCompanyCategoryScoreList,
      competitorData: statistics.competitorCategoryAvgScoreList,
    });
  }

  const [competitorScores, setCompetitorScores] = useState<
    AnalysisResultScores[]
  >([]);

  useEffect(() => {
    async function fetchCompetitorScores() {
      if (!selectedCompetitor || !analysisResultNo) {
        setCompetitorScores([]);
        return;
      }
      // 선택된 경쟁사 카테고리별 점수 조회
      const scores = await apiClient.getAnalysisResultScores(
        analysisResultNo,
        selectedCompetitor
      );
      setCompetitorScores(scores);
    }
    fetchCompetitorScores();
  }, [selectedCompetitor, analysisResultNo]);

  const togglePrompt = (index: number) => {
    setExpandedPrompts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleBackClick = () => {
    router.push("/");
  };

  const handleCompetitorChange = (value: string) => {
    setSelectedCompetitor(value);
    // 필요하면 경쟁사 선택시 추가 로직 작성 가능
  };

  // 경쟁사 목록 (detail에 데이터가 없다면 빈 배열로 초기화)
  const companies = detail?.competitorCompanyInfoList || [];

  // 경쟁사 첫 번째 값으로 default 설정
  useEffect(() => {
    if (companies.length > 0 && !selectedCompetitor) {
      setSelectedCompetitor(companies[0].companyNo);
    }
  }, [companies, selectedCompetitor]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#08090A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(80% 50% at 50% -20%, rgba(120, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0) 100%),
              radial-gradient(60% 50% at 80% 20%, rgba(78, 73, 221, 0.15) 0%, rgba(78, 73, 221, 0) 100%),
              #08090A
            `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center min-h-screen">
          <Header showDownloadButton />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#08090A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(80% 50% at 50% -20%, rgba(120, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0) 100%),
              radial-gradient(60% 50% at 80% 20%, rgba(78, 73, 221, 0.15) 0%, rgba(78, 73, 221, 0) 100%),
              #08090A
            `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center min-h-screen">
          <Header showDownloadButton />
          <ErrorDisplay
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // 일부 데이터라도 있으면 페이지 렌더링 시도
  const hasAnyData = totalScoreData || statistics || detail;

  if (!hasAnyData && !loading) {
    return (
      <div className="min-h-screen w-full bg-[#08090A] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(80% 50% at 50% -20%, rgba(120, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0) 100%),
              radial-gradient(60% 50% at 80% 20%, rgba(78, 73, 221, 0.15) 0%, rgba(120, 119, 198, 0) 100%),
              #08090A
            `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center min-h-screen">
          <Header showDownloadButton />
          <ErrorDisplay message="분석 결과를 찾을 수 없습니다." />
        </div>
      </div>
    );
  }

  const categoryData = getCategoryChartData();
  const prompts = getPromptData();
  const strongestCategory = getStrongestCategory();
  const weakestCategory = getWeakestCategory();
  const industryComparison = getIndustryComparison();

  return (
    <div className="min-h-screen w-full bg-[#08090A] relative overflow-hidden">
      {/* Background Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(80% 50% at 50% -20%, rgba(120, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0) 100%),
            radial-gradient(60% 50% at 80% 20%, rgba(78, 73, 221, 0.15) 0%, rgba(78, 73, 221, 0) 100%),
            #08090A
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen">
        <Header showDownloadButton />

        {/* Main Content */}
        <main className="flex flex-col items-center gap-40 flex-1 w-full max-w-[960px] pt-14">
          <div className="flex flex-col items-center gap-14 w-full">
            {/* Data Status Indicator */}
            {!hasAnyData && loading && (
              <div className="w-full p-6 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-center">
                <p className="text-[#F7F8F8]">데이터를 불러오는 중입니다...</p>
              </div>
            )}

            {!hasAnyData && !loading && (
              <div className="w-full p-6 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-center">
                <p className="text-[#F7F8F8]">
                  분석 데이터가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.
                </p>
              </div>
            )}
            {/* Back Button & Header Info */}
            <div className="flex flex-col items-start gap-5 w-full">
              <button
                onClick={handleBackClick}
                className="flex items-center p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#F7F8F8]" />
              </button>

              <div className="flex flex-col items-start gap-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-[#8A8F98]">
                      {new Date().toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      분석됨
                    </p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-[32px] font-bold leading-[110%] tracking-[-0.025em] text-[#F7F8F8]">
                        {getFirstCompanyName()}
                      </h2>
                      <span className="px-4 py-[6px] bg-[#8BBDFF]/8 border border-white/10 backdrop-blur-[4px] rounded-3xl text-sm font-semibold text-[#8BBDFF]">
                        {statistics?.targetCompanyCategoryScoreList[0]
                          ?.categoryName || "업종"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm leading-[150%] text-[#8A8F98] w-full">
                  아래 지표는 절대적 사실이 아닌 LLM을 기반으로 인식되는 AI의
                  답변 결과만을 토대로 만들어진 지표이며, 실제 순위나 점수
                  등과는 무관하며 특정 브랜드의 명예 훼손 등을 목적으로 제작되지
                  않았습니다.
                </p>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="flex gap-3 w-full">
              {totalScoreData && (
                <>
                  <MetricCard
                    title="종합 점수"
                    value={`${totalScoreData.targetTotalScore}점`}
                    subtitle={`업계 평균 대비 ${industryComparison}`}
                    hasInfo
                  />
                  <MetricCard
                    title="경쟁력 순위"
                    value={`${totalScoreData.targetRank}위`}
                    subtitle={`${totalScoreData.totalCompanyCount}개의 브랜드 중`}
                    hasInfo
                  />
                </>
              )}
              {statistics && (
                <>
                  <MetricCard
                    title="강점 카테고리"
                    value={strongestCategory}
                    subtitle={
                      statistics.targetCompanyCategoryScoreList.length > 0
                        ? `${Math.round(
                            Math.max(
                              ...statistics.targetCompanyCategoryScoreList.map(
                                (cat) => cat.categoryScore
                              )
                            )
                          )}점 최고 득점`
                        : `${Math.round(
                            Math.max(
                              ...statistics.competitorCategoryAvgScoreList.map(
                                (cat) => cat.categoryScore
                              )
                            )
                          )}점 최고 득점`
                    }
                    subtitleClassName="text-[#ABF8AD]"
                  />
                  <MetricCard
                    title="약점 카테고리"
                    value={weakestCategory}
                    subtitle={
                      statistics.targetCompanyCategoryScoreList.length > 0
                        ? `${Math.round(
                            Math.min(
                              ...statistics.targetCompanyCategoryScoreList.map(
                                (cat) => cat.categoryScore
                              )
                            )
                          )}점 최저 득점`
                        : `${Math.round(
                            Math.min(
                              ...statistics.competitorCategoryAvgScoreList.map(
                                (cat) => cat.categoryScore
                              )
                            )
                          )}점 격차`
                    }
                    subtitleClassName="text-[#FF9696]"
                  />
                </>
              )}
            </div>

            {/* AI Insights */}
            <div className="flex flex-col justify-center items-start p-6 gap-6 w-full bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[6px]">
                  <div className="w-5 h-5 bg-gradient-to-r from-[#B0ADFF] to-[#4E49DD] rounded-full border border-[#8BBDFF]/8 shadow-[0px_0px_4px_rgba(0,0,0,0.16),inset_0px_0px_2px_rgba(128,148,246,0.4)]" />
                  <span className="text-lg font-bold text-[#F7F8F8]">
                    AI 인사이트 요약
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#F7F8F8] rotate-[-90deg]" />
              </div>

              {detail && (
                <div className="flex gap-6 w-full">
                  <InsightCard
                    type="strength"
                    title="강점"
                    content={detail.strongPoint}
                  />
                  <InsightCard
                    type="weakness"
                    title="약점"
                    content={detail.weakPoint}
                  />
                  <InsightCard
                    type="improvement"
                    title="개선제안"
                    content={detail.improvements}
                  />
                </div>
              )}
            </div>

            {/* Charts Section */}
            {categoryData.length > 0 && (
              <div className="flex gap-3 w-full">
                <CategoryChart
                  data={categoryData}
                  companies={companies}
                  selectedCompetitor={selectedCompetitor}
                  onCompetitorChange={handleCompetitorChange}
                  competitorData={competitorScores.map((score) => ({
                    name: score.categoryName,
                    competitorScore: score.companyScore,
                  }))}
                  analysisId={analysisResultNo || undefined}
                />
                <RadarChart
                  ourData={categoryData}
                  competitorData={categoryData} // 업계 평균 데이터를 경쟁사 데이터로도 사용
                />
              </div>
            )}

            {/* Prompt Analysis */}
            {prompts.length > 0 && (
              <div className="flex flex-col items-start p-6 gap-4 w-full bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl">
                <h3 className="text-lg font-bold text-[#F7F8F8]">
                  프롬프트 분석
                </h3>

                <div className="flex flex-col w-full gap-0">
                  {prompts.map((prompt, index) => (
                    <PromptItem
                      key={index}
                      prompt={prompt}
                      isExpanded={expandedPrompts.includes(index)}
                      onToggle={() => togglePrompt(index)}
                    />
                  ))}

                  {/* Additional collapsed prompts */}
                  {prompts.slice(1).map((prompt, index) => (
                    <CollapsedPromptItem
                      key={index + 1}
                      question={prompt.question}
                      category={prompt.category}
                      score={prompt.score}
                      onClick={() => togglePrompt(index + 1)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
export default function ResultsPageWrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ResultsPage />
    </Suspense>
  );
}
