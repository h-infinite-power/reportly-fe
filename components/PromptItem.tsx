"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { PromptData } from "@/types";
import KeywordTag from "./KeywordTag";
import CompetitorCard from "./CompetitorCard";

interface PromptItemProps {
  prompt: PromptData;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function PromptItem({
  prompt,
  isExpanded,
  onToggle,
}: PromptItemProps) {
  const [showMoreContent, setShowMoreContent] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      {/* Question Header */}
      <div className="bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-xl overflow-hidden">
        {/* Question Header */}
        <div
          className={`flex items-center justify-between w-full cursor-pointer ${
            isMobile ? "p-4 gap-4" : "p-6 gap-10"
          }`}
          onClick={onToggle}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`flex justify-center items-center bg-[#8BBDFF]/8 rounded-full ${
                isMobile ? "w-8 h-8" : "w-10 h-10"
              }`}
            >
              <div
                className={`bg-gradient-to-r from-[#B0ADFF] to-[#4E49DD] rounded-full border border-[#8BBDFF]/8 shadow-[0px_0px_4px_rgba(0,0,0,0.16),inset_0px_0px_2px_rgba(128,148,246,0.4)] ${
                  isMobile ? "w-4 h-4" : "w-5 h-5"
                }`}
              />
            </div>
            <div className="flex flex-col justify-center gap-1 flex-1">
              <h4
                className={`font-semibold text-[#F7F8F8] ${
                  isMobile ? "text-sm" : "text-base"
                }`}
              >
                {prompt.question}
              </h4>
              <div
                className={`flex items-center gap-2 ${
                  isMobile ? "flex-wrap gap-1" : ""
                }`}
              >
                <span
                  className={`px-2 py-1 bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-full font-medium text-[#D0D6E0] ${
                    isMobile ? "text-xs" : "text-[13px]"
                  }`}
                >
                  {prompt.category}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={`font-medium text-[#8BBDFF] ${
                      isMobile ? "text-sm" : "text-base"
                    }`}
                  >
                    {prompt.score}
                  </span>
                  <span
                    className={`font-medium text-[#8A8F98] ${
                      isMobile ? "text-xs" : "text-[13px]"
                    }`}
                  >
                    / 100
                  </span>
                </div>
              </div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp
              className={`text-[#F7F8F8] ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
            />
          ) : (
            <ChevronDown
              className={`text-[#F7F8F8] ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
            />
          )}
        </div>

        {/* Answer Content */}
        {isExpanded && (
          <div
            className={`flex flex-col justify-center items-start w-full bg-black/20 border-white/10 ${
              isMobile ? "p-4 gap-3" : "p-8 gap-4"
            }`}
          >
            <div
              className={`flex flex-col w-full ${isMobile ? "gap-4" : "gap-6"}`}
            >
              <div
                className={`flex flex-col w-full ${
                  isMobile ? "gap-3" : "gap-4"
                }`}
              >
                {/* Brand Analysis */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <h5
                      className={`font-semibold text-[#F7F8F8] ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      우리 브랜드 분석
                    </h5>
                    <span
                      className={`px-2 py-1 bg-[#8BBDFF]/8 border border-white/10 backdrop-blur-[4px] rounded-3xl font-medium text-[#8BBDFF] ${
                        isMobile ? "text-xs" : "text-[13px]"
                      }`}
                    >
                      {prompt.score}점
                    </span>
                  </div>
                  <div
                    className={`flex flex-col gap-2 ${
                      isMobile ? "p-3" : "p-4"
                    }`}
                  >
                    <p
                      className={`leading-[160%] text-[#D0D6E0] ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      {showMoreContent
                        ? prompt.analysis
                        : `${prompt.analysis.slice(0, 200)}...`}
                    </p>
                    <button
                      onClick={() => setShowMoreContent(!showMoreContent)}
                      className={`flex items-start gap-[2px] font-medium text-[#8A8F98] hover:text-[#D0D6E0] transition-colors ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      내용 더 보기
                      <ChevronDown
                        className={`rotate-90 ${
                          isMobile ? "w-3 h-3" : "w-4 h-4"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Keywords */}
                <div
                  className={`flex gap-2 w-full ${
                    isMobile ? "flex-wrap gap-1" : ""
                  }`}
                >
                  <div className="flex items-end gap-2">
                    {prompt.positiveKeywords.slice(0, 3).map((keyword, i) => (
                      <KeywordTag key={i} keyword={keyword} type="positive" />
                    ))}
                  </div>
                  <div className="flex items-start gap-2">
                    {prompt.negativeKeywords.slice(0, 3).map((keyword, i) => (
                      <KeywordTag key={i} keyword={keyword} type="negative" />
                    ))}
                  </div>
                </div>

                {/* Competitor Comparison */}
                <div className="flex flex-col gap-2 w-full">
                  <h5
                    className={`font-semibold text-[#F7F8F8] ${
                      isMobile ? "text-sm" : "text-base"
                    }`}
                  >
                    경쟁사 비교
                  </h5>
                  <div
                    className={`flex gap-4 w-full ${
                      isMobile ? "flex-col gap-3" : ""
                    }`}
                  >
                    {prompt.competitors.map((competitor, i) => (
                      <CompetitorCard key={i} competitor={competitor} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
