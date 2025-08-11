"use client";

import { Suspense, useState, useEffect, useCallback, useRef } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { apiClient } from "@/lib/api"; // API 클라이언트 import 필요
import { AnalysisResultScores } from "@/types"; // 타입 import 필요
import { generateCurrentPagePDF } from "@/lib/pdf-api";

function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedPrompts, setExpandedPrompts] = useState<number[]>([0]);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<string>("");
  const isMobile = useIsMobile();
  const contentRef = useRef<HTMLDivElement>(null);

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
    getCompetitorScores,
  } = useResultData();



  const [competitorScores, setCompetitorScores] = useState<
    AnalysisResultScores[]
  >([]);

  const fetchCompetitorScores = useCallback(async () => {
    if (!selectedCompetitor) {
      setCompetitorScores([]);
      return;
    }
    // 선택된 경쟁사의 카테고리별 점수 조회
    try {
      const scores = await getCompetitorScores(selectedCompetitor);
      setCompetitorScores(scores);
    } catch (error) {
      setCompetitorScores([]);
    }
  }, [selectedCompetitor, getCompetitorScores]);

  useEffect(() => {
    fetchCompetitorScores();
  }, [fetchCompetitorScores]);

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

  // PDF 다운로드 핸들러
  const handleDownloadClick = async () => {
    if (!contentRef.current) {
      alert("PDF 생성에 필요한 콘텐츠를 찾을 수 없습니다.");
      return;
    }

    setIsGeneratingPDF(true);
    setPdfProgress("페이지 준비 중...");

    try {
      const companyName = getFirstCompanyName() || "기업";
      const filename = `reportly-${companyName}-분석결과.pdf`;

      // 진행 상황 업데이트를 위한 타이머 설정
      const progressTimer = setInterval(() => {
        setPdfProgress((prev) => {
          if (prev === "페이지 준비 중...") return "차트 렌더링 중...";
          if (prev === "차트 렌더링 중...") return "이미지 변환 중...";
          if (prev === "이미지 변환 중...") return "PDF 생성 중...";
          return "PDF 생성 중...";
        });
      }, 2000);

      await generateCurrentPagePDF(filename);

      clearInterval(progressTimer);
      setPdfProgress("완료!");

      // 완료 메시지를 잠시 표시 후 초기화
      setTimeout(() => {
        setPdfProgress("");
      }, 1000);
    } catch (error) {

      let errorMessage = "PDF 생성에 실패했습니다.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setPdfProgress("오류 발생");
      alert(`PDF 생성에 실패했습니다: ${errorMessage}`);

      // 오류 메시지를 잠시 표시 후 초기화
      setTimeout(() => {
        setPdfProgress("");
      }, 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 경쟁사 목록 (companyInfo에서 가져오기, detail이 있다면 병합)
  const companies =
    companyInfo.length > 0
      ? companyInfo
      : detail?.competitorCompanyInfoList || [];

  // 경쟁사 첫 번째 값으로 default 설정 (analysisResultNo가 있는 경우에만)
  useEffect(() => {
    if (companies.length > 0 && !selectedCompetitor) {
      const firstCompany = companies[0];
      if ("analysisResultNo" in firstCompany && firstCompany.analysisResultNo) {
        setSelectedCompetitor(firstCompany.analysisResultNo);
      }
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
          <Header
            showDownloadButton
            onDownloadClick={handleDownloadClick}
            isGeneratingPDF={isGeneratingPDF}
          />
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
              radial-gradient(60% 50% at 80% 20%, rgba(78, 73, 221, 0.15) 0%, rgba(120, 119, 198, 0) 100%),
              #08090A
            `,
          }}
        />
        <div className="relative z-10 flex flex-col items-center min-h-screen">
          <Header
            showDownloadButton
            onDownloadClick={handleDownloadClick}
            isGeneratingPDF={isGeneratingPDF}
          />
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
          <Header
            showDownloadButton
            onDownloadClick={handleDownloadClick}
            isGeneratingPDF={isGeneratingPDF}
          />
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
        <Header
          showDownloadButton
          onDownloadClick={handleDownloadClick}
          isGeneratingPDF={isGeneratingPDF}
          pdfProgress={pdfProgress}
        />

        {/* Main Content */}
        <main
          ref={contentRef}
          id="result-page-content"
          className={`flex flex-col items-center gap-40 flex-1 w-full max-w-[960px] pt-14 ${
            isMobile ? "px-4 gap-20" : ""
          }`}
        >
          <div
            className={`flex flex-col items-center gap-14 w-full ${
              isMobile ? "gap-8" : ""
            }`}
          >
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
            <div
              className={`flex flex-col items-start gap-5 w-full ${
                isMobile ? "gap-4" : ""
              }`}
            >
              <button
                onClick={handleBackClick}
                className="flex items-center p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-[#F7F8F8]" />
              </button>

              <div
                className={`flex flex-col items-start gap-4 w-full ${
                  isMobile ? "gap-3" : ""
                }`}
              >
                <div
                  className={`flex justify-between items-center w-full ${
                    isMobile ? "flex-col items-start gap-3" : ""
                  }`}
                >
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-[#8A8F98]">
                      {new Date().toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      분석됨
                    </p>
                    <div
                      className={`flex items-center gap-3 ${
                        isMobile ? "flex-wrap" : ""
                      }`}
                    >
                      <h2
                        className={`font-bold leading-[110%] tracking-[-0.025em] text-[#F7F8F8] ${
                          isMobile ? "text-2xl" : "text-[32px]"
                        }`}
                      >
                        {getFirstCompanyName()}
                      </h2>
                      <span className="px-4 py-[6px] bg-[#8BBDFF]/8 border border-white/10 backdrop-blur-[4px] rounded-3xl text-sm font-semibold text-[#8BBDFF]">
                        {statistics?.targetCompanyCategoryScoreList[0]
                          ?.categoryName ||
                          statistics?.competitorCategoryAvgScoreList[0]
                            ?.categoryName ||
                          "업종"}
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
            <div
              className={`flex gap-3 w-full ${
                isMobile ? "flex-col gap-4" : ""
              }`}
            >
              {totalScoreData && (
                <>
                  <MetricCard
                    title="종합 점수"
                    value={`${Math.round(totalScoreData.targetTotalScore)}점`}
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
            <div
              className={`flex flex-col justify-center items-start p-6 gap-6 w-full bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl ${
                isMobile ? "p-4 gap-4" : ""
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-[6px]">
                  <div className="w-5 h-5 bg-gradient-to-r from-[#B0ADFF] to-[#4E49DD] rounded-xl" />
                  <span
                    className={`font-bold text-[#F7F8F8] ${
                      isMobile ? "text-base" : "text-lg"
                    }`}
                  >
                    AI 인사이트 요약
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#F7F8F8] rotate-[-90deg]" />
              </div>

              {detail && (
                <div
                  className={`flex gap-6 w-full ${
                    isMobile ? "flex-col gap-4" : ""
                  }`}
                >
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
              <div
                className={`flex gap-3 w-full ${
                  isMobile ? "flex-col gap-6" : ""
                }`}
              >
                <CategoryChart
                  data={categoryData}
                  companies={companies}
                  selectedCompetitor={selectedCompetitor}
                  onCompetitorChange={handleCompetitorChange}
                  competitorData={categoryData.map((category) => ({
                    name: category.name,
                    competitorScore: category.competitorScore,
                  }))}
                  analysisId={
                    selectedCompetitor || analysisResultNo || undefined
                  }
                  getCompetitorScores={getCompetitorScores}
                />
                <RadarChart
                  ourData={
                    statistics?.targetCompanyCategoryScoreList.map((cat) => ({
                      name: cat.categoryName,
                      ourScore: cat.categoryScore,
                    })) || []
                  }
                  competitorData={
                    statistics?.competitorCategoryAvgScoreList.map((cat) => ({
                      name: cat.categoryName,
                      competitorScore: cat.categoryScore,
                    })) || []
                  }
                />
              </div>
            )}

            {/* Prompt Analysis */}
            {prompts.length > 0 && (
              <div
                className={`flex flex-col items-start p-6 gap-4 w-full bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl ${
                  isMobile ? "p-4 gap-3" : ""
                }`}
              >
                <h3
                  className={`font-bold text-[#F7F8F8] ${
                    isMobile ? "text-base" : "text-lg"
                  }`}
                >
                  프롬프트 분석
                </h3>

                <div className="flex flex-col w-full gap-3">
                  {prompts.map((prompt, index) => (
                    <PromptItem
                      key={index}
                      prompt={prompt}
                      isExpanded={expandedPrompts.includes(index)}
                      onToggle={() => togglePrompt(index)}
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
