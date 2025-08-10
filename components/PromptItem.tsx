"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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

  return (
    <div className="w-full">
      {/* Question Header */}
      <div
        className="flex items-center justify-between p-6 gap-10 w-full bg-white/6 border border-white/10 backdrop-blur-[4px] cursor-pointer rounded-t-xl border-b-0"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex justify-center items-center w-10 h-10 bg-[#8BBDFF]/8 rounded-full">
            <div className="w-5 h-5 bg-gradient-to-r from-[#B0ADFF] to-[#4E49DD] rounded-full border border-[#8BBDFF]/8 shadow-[0px_0px_4px_rgba(0,0,0,0.16),inset_0px_0px_2px_rgba(128,148,246,0.4)]" />
          </div>
          <div className="flex flex-col justify-center gap-1 flex-1">
            <h4 className="text-base font-semibold text-[#F7F8F8]">
              {prompt.question}
            </h4>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-full text-[13px] font-medium text-[#D0D6E0]">
                {prompt.category}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-base font-medium text-[#8BBDFF]">
                  {prompt.score}
                </span>
                <span className="text-[13px] font-medium text-[#8A8F98]">
                  / 100
                </span>
              </div>
            </div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[#F7F8F8]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#F7F8F8]" />
        )}
      </div>

      {/* Answer Content */}
      {isExpanded && (
        <div className="flex flex-col justify-center items-start p-8 gap-4 w-full bg-black/4 border border-white/10 border-t-0 backdrop-blur-[4px] rounded-b-xl">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4 w-full">
              {/* Brand Analysis */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-2">
                  <h5 className="text-base font-semibold text-[#F7F8F8]">
                    우리 브랜드 분석
                  </h5>
                  <span className="px-2 py-1 bg-[#8BBDFF]/8 border border-white/10 backdrop-blur-[4px] rounded-3xl text-[13px] font-medium text-[#8BBDFF]">
                    {prompt.score}점
                  </span>
                </div>
                <div className="flex flex-col gap-2 rounded-full p-4 bg-white/4 border border-white/10">
                  <p className="text-sm leading-[160%] text-[#D0D6E0]">
                    {showMoreContent
                      ? prompt.analysis
                      : `${prompt.analysis.slice(0, 200)}...`}
                  </p>
                  <button
                    onClick={() => setShowMoreContent(!showMoreContent)}
                    className="flex items-start gap-[2px] text-sm font-medium text-[#8A8F98] hover:text-[#D0D6E0] transition-colors"
                  >
                    내용 더 보기
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex gap-2 w-full">
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
                <h5 className="text-base font-semibold text-[#F7F8F8]">
                  경쟁사 비교
                </h5>
                <div className="flex gap-4 w-full">
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
  );
}
