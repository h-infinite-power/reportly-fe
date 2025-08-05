import type { InsightCardProps } from "@/types"

const typeConfig = {
  strength: {
    bgColor: "bg-[#ABF8AD]/8",
    textColor: "text-[#ABF8AD]",
    label: "강점",
  },
  weakness: {
    bgColor: "bg-[#FF9696]/8",
    textColor: "text-[#FF9696]",
    label: "약점",
  },
  improvement: {
    bgColor: "bg-[#D3ABF8]/8",
    textColor: "text-[#D3ABF8]",
    label: "개선제안",
  },
}

export default function InsightCard({ type, title, content }: InsightCardProps) {
  const config = typeConfig[type]

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className={`px-3 py-1 ${config.bgColor} border border-white/10 backdrop-blur-[4px] rounded-3xl w-fit`}>
        <span className={`text-sm font-semibold ${config.textColor}`}>{config.label}</span>
      </div>
      <p className="text-sm leading-[160%] text-[#D0D6E0]">{content}</p>
    </div>
  )
}
