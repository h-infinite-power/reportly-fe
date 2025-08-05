import type { CompetitorData } from "@/types"

interface CompetitorCardProps {
  competitor: CompetitorData
}

export default function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <div className="flex flex-col p-4 gap-4 bg-white/3 rounded-xl flex-1">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#D0D6E0]">{competitor.name}</span>
            <span className="px-2 py-1 bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-3xl text-[13px] font-medium text-[#D0D6E0]">
              {competitor.score}점
            </span>
          </div>
          <p className="text-sm leading-[160%] text-[#D0D6E0]">{competitor.description}</p>
        </div>
      </div>
    </div>
  )
}
