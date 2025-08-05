import { Info } from "lucide-react";
import type { MetricCardProps } from "@/types";

export default function MetricCard({
  title,
  value,
  subtitle,
  hasInfo = false,
}: MetricCardProps) {
  return (
    <div className="flex flex-col justify-center items-start p-6 gap-3 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-[#D0D6E0]">{title}</span>
        {hasInfo && <Info className="w-4 h-4 text-white/10" />}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold text-[#F7F8F8]">{value}</span>
        <span className="text-sm font-medium text-[#8A8F98]">{subtitle}</span>
      </div>
    </div>
  );
}
