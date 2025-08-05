"use client";

import { useState } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import InsightCard from "@/components/InsightCard";
import CategoryChart from "@/components/CategoryChart";
import RadarChart from "@/components/RadarChart";
import PromptItem from "@/components/PromptItem";
import CollapsedPromptItem from "@/components/CollapsedPromptItem";
import Footer from "@/components/Footer";
import type { CategoryData, PromptData } from "@/types";

export default function ResultsPage() {
  const [expandedPrompts, setExpandedPrompts] = useState<number[]>([0]);

  const togglePrompt = (index: number) => {
    setExpandedPrompts((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const categoryData: CategoryData[] = [
    { name: "인지도", ourScore: 92, competitorScore: 84 },
    { name: "차별점", ourScore: 76, competitorScore: 56 },
    { name: "신뢰도", ourScore: 52, competitorScore: 48 },
    { name: "가성비", ourScore: 84, competitorScore: 76 },
    { name: "만족도", ourScore: 87, competitorScore: 93 },
    { name: "트렌드", ourScore: 80, competitorScore: 83 },
    { name: "이미지", ourScore: 76, competitorScore: 88 },
  ];

  const prompts: PromptData[] = [
    {
      question: "브랜드의 제품 혁신 전략은 얼마나 일관되고 경쟁력이 있는가?",
      category: "인지도",
      score: 92,
      analysis:
        "삼성전자는 스마트 가전과 모바일 생태계를 중심으로 한 AI·IoT 융합 전략을 지속적으로 강화하며 글로벌 시장에서 혁신성을 유지하고 있습니다. 8K TV, 스마트 냉장고, 갤럭시 생태계를 핵심 축으로, 하이엔드 시장에서의 프리미엄 이미지를 공고히 하고 있습니다. 매출의 8~9%를 R&D에 투자하며, 신기술 상용화를 통한 차별화를 이어가는 점이 강점입니다. 다만, 고가 제품군 중심의 포트폴리오로 인해 가격 경쟁력과 고객 저변 확대에는 한계가 있으며, 일부 시장에서 UX 및 서비스 연계성이 단절되는 문제도 지적됩니다.",
      positiveKeywords: ["AI 연동", "R&D 투자", "프리미엄"],
      negativeKeywords: ["고객 접점 부족", "가격 부담", "AS 지연"],
      competitors: [
        {
          name: "애플",
          score: 90,
          description:
            "스마트 가전과 모바일 생태계를 중심으로 높은 경쟁력 보유",
        },
        {
          name: "LG전자",
          score: 80,
          description:
            "AI·IoT 융합 전략을 지속적으로 강화하며 글로벌 시장에서 혁신성을 유지",
        },
        {
          name: "소니",
          score: 64,
          description:
            "스마트 가전과 모바일 생태계를 중심으로 한 AI·IoT 융합 전략을 지속적으로 강화",
        },
      ],
    },
  ];

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
            {/* Back Button & Header Info */}
            <div className="flex flex-col items-start gap-5 w-full">
              <button className="flex items-center p-2">
                <ChevronLeft className="w-4 h-4 text-[#F7F8F8]" />
              </button>

              <div className="flex flex-col items-start gap-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-[#8A8F98]">
                      2025년 07월 29일 분석됨
                    </p>
                    <div className="flex items-center gap-3">
                      <h2 className="text-[32px] font-bold leading-[110%] tracking-[-0.025em] text-[#F7F8F8]">
                        삼성전자
                      </h2>
                      <span className="px-4 py-[6px] bg-[#8BBDFF]/8 border border-white/10 backdrop-blur-[4px] rounded-3xl text-sm font-semibold text-[#8BBDFF]">
                        전자제품
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
              <MetricCard
                title="종합 점수"
                value="84.2점"
                subtitle="업계 평균 대비 +2.3%"
                hasInfo
              />
              <MetricCard
                title="경쟁력 순위"
                value="2위"
                subtitle="4개의 브랜드 중"
                hasInfo
              />
              <MetricCard
                title="강점 카테고리"
                value="트렌드"
                subtitle="92점 최고 득점"
              />
              <MetricCard
                title="약점 카테고리"
                value="차별점"
                subtitle="-12점 격차"
              />
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

              <div className="flex gap-6 w-full">
                <InsightCard
                  type="strength"
                  title="강점"
                  content="삼성전자는 뛰어난 제품 품질과 혁신성으로 경쟁사 대비 강력한 우위를 확보했습니다. 프리미엄 제품 라인을 중심으로 브랜드 신뢰도가 높습니다."
                />
                <InsightCard
                  type="weakness"
                  title="약점"
                  content="고객 경험 점수가 경쟁사 대비 낮아 서비스 품질 개선이 필요합니다. AS 처리 속도, 상담 접근성 향상이 요구됩니다."
                />
                <InsightCard
                  type="improvement"
                  title="개선제안"
                  content="실시간 고객 응대 시스템과 AI 기반 상담 채널을 도입해 빠르고 만족도 높은 고객 경험을 구축하세요. 브랜드 충성도를 높이는 데 기여할 것입니다."
                />
              </div>
            </div>

            {/* Charts Section */}
            <div className="flex gap-3 w-full">
              <CategoryChart data={categoryData} />
              <RadarChart />
            </div>

            {/* Prompt Analysis */}
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
                {[1, 2, 3, 4].map((index) => (
                  <CollapsedPromptItem
                    key={index}
                    question="브랜드의 제품 혁신 전략은 얼마나 일관되고 경쟁력이 있는가?"
                    category="인지도"
                    score={92}
                    onClick={() => togglePrompt(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
