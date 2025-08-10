import { useIsMobile } from "@/hooks/use-mobile";
import type { CompetitorData } from "@/types";

interface CompetitorCardProps {
  competitor: CompetitorData;
}

export default function CompetitorCard({ competitor }: CompetitorCardProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`flex flex-col bg-white/3 rounded-xl flex-1 ${
        isMobile ? "p-3 gap-3" : "p-4 gap-4"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold text-[#D0D6E0] ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {competitor.name}
            </span>
            <span
              className={`px-2 py-1 bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-3xl font-medium text-[#D0D6E0] ${
                isMobile ? "text-xs" : "text-[13px]"
              }`}
            >
              {competitor.score}점
            </span>
          </div>
          <p
            className={`leading-[160%] text-[#D0D6E0] ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            {competitor.description}
          </p>
        </div>
      </div>
    </div>
  );
}
