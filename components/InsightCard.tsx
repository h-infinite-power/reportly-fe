import { useIsMobile } from "@/hooks/use-mobile";
import type { InsightCardProps } from "@/types";

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
};

export default function InsightCard({
  type,
  title,
  content,
}: InsightCardProps) {
  const config = typeConfig[type];
  const isMobile = useIsMobile();

  return (
    <div className={`flex flex-col gap-3 flex-1 ${isMobile ? "gap-2" : ""}`}>
      <div
        className={`px-3 py-1 ${config.bgColor} border border-white/10 backdrop-blur-[4px] rounded-3xl w-fit`}
      >
        <span
          className={`font-semibold ${config.textColor} ${
            isMobile ? "text-xs" : "text-sm"
          }`}
        >
          {config.label}
        </span>
      </div>
      <p
        className={`leading-[160%] text-[#D0D6E0] ${
          isMobile ? "text-xs" : "text-sm"
        }`}
      >
        {content}
      </p>
    </div>
  );
}
