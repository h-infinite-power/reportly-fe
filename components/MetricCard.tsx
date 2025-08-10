import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { MetricCardProps } from "@/types";

export default function MetricCard({
  title,
  value,
  subtitle,
  hasInfo = false,
  subtitleClassName,
}: MetricCardProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex flex-col justify-center items-start bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1 ${
        isMobile ? "p-4 gap-2" : "p-6 gap-3"
      }`}
    >
      <div className="flex items-center gap-1">
        <span
          className={`font-medium text-[#D0D6E0] ${
            isMobile ? "text-xs" : "text-sm"
          }`}
        >
          {title}
        </span>
        {hasInfo && (
          <Info
            className={`text-white/10 ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span
          className={`font-bold text-[#F7F8F8] ${
            isMobile ? "text-xl" : "text-2xl"
          }`}
        >
          {value}
        </span>
        <span
          className={`font-medium ${subtitleClassName || "text-[#8A8F98]"} ${
            isMobile ? "text-xs" : "text-sm"
          }`}
        >
          {subtitle}
        </span>
      </div>
    </div>
  );
}
