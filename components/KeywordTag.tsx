import { useIsMobile } from "@/hooks/use-mobile";
import type { KeywordTagProps } from "@/types";

export default function KeywordTag({ keyword, type }: KeywordTagProps) {
  const isMobile = useIsMobile();

  const config = {
    positive: {
      bgColor: "bg-[#ABF8AD]/8",
      textColor: "text-[#ABF8AD]",
    },
    negative: {
      bgColor: "bg-[#FF9696]/8",
      textColor: "text-[#FF9696]",
    },
  };

  const { bgColor, textColor } = config[type];

  return (
    <span
      className={`px-2 py-1 ${bgColor} border border-white/10 backdrop-blur-[4px] rounded font-medium ${textColor} ${
        isMobile ? "text-xs" : "text-[13px]"
      }`}
    >
      {keyword}
    </span>
  );
}
