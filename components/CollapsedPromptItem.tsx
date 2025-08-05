"use client"

import { ChevronDown } from "lucide-react"

interface CollapsedPromptItemProps {
  question: string
  category: string
  score: number
  onClick: () => void
}

export default function CollapsedPromptItem({ question, category, score, onClick }: CollapsedPromptItemProps) {
  return (
    <div
      className="flex items-center justify-between p-6 gap-10 w-full bg-white/3 backdrop-blur-[4px] rounded-xl cursor-pointer hover:bg-white/4 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="flex justify-center items-center w-10 h-10 bg-[#8BBDFF]/8 rounded-full">
          <div className="w-5 h-5 bg-gradient-to-r from-[#B0ADFF] to-[#4E49DD] rounded-full border border-[#8BBDFF]/8 shadow-[0px_0px_4px_rgba(0,0,0,0.16),inset_0px_0px_2px_rgba(128,148,246,0.4)]" />
        </div>
        <div className="flex flex-col justify-center gap-1 flex-1">
          <h4 className="text-base font-semibold text-[#D0D6E0]">{question}</h4>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-full text-[13px] font-medium text-[#D0D6E0]">
              {category}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-base font-semibold text-[#8BBDFF]">{score}</span>
              <span className="text-[13px] font-medium text-[#8A8F98]">/ 100</span>
            </div>
          </div>
        </div>
      </div>
      <ChevronDown className="w-4 h-4 text-[#F7F8F8] rotate-90" />
    </div>
  )
}
