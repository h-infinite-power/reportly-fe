import type { CategoryData } from "@/types";
import { useEffect, useState, useCallback } from "react";

interface Company {
  companyNo: string;
  companyName: string;
}

interface CategoryChartProps {
  data: any[];
  companies: any[];
  selectedCompetitor: string;
  onCompetitorChange: (value: string) => void;
  competitorData: { name: string; competitorScore: number }[]; // 추가
  analysisId?: string; // analysisId 추가 (옵션)
  getCompetitorScores: (analysisResultNo: string) => Promise<any[]>; // 경쟁사 점수 조회 함수 추가
}

export default function CategoryChart({
  data,
  companies,
  selectedCompetitor,
  onCompetitorChange,
  competitorData,
  analysisId, // analysisId 추가
  getCompetitorScores, // 경쟁사 점수 조회 함수 추가
}: CategoryChartProps) {
  const [competitorScores, setCompetitorScores] = useState<any[]>([]);

  const fetchCompetitorScores = useCallback(async () => {
    if (!selectedCompetitor || !getCompetitorScores) {
      setCompetitorScores([]);
      return;
    }
    try {
      const scores = await getCompetitorScores(selectedCompetitor);
      console.log("경쟁사 점수", scores); // ← 콘솔로 값 확인
      setCompetitorScores(scores);
    } catch (error) {
      console.error("경쟁사 점수 조회 실패:", error);
      setCompetitorScores([]);
    }
  }, [selectedCompetitor, getCompetitorScores]);

  useEffect(() => {
    fetchCompetitorScores();
  }, [fetchCompetitorScores]);

  // 선택된 경쟁사의 점수 데이터를 카테고리별로 매핑
  const getCompetitorScoreForCategory = (categoryName: string) => {
    if (!selectedCompetitor || competitorScores.length === 0) {
      // 경쟁사가 선택되지 않았으면 점수 표시하지 않음
      return 0;
    }

    // 선택된 경쟁사의 개별 점수 사용
    const score = competitorScores.find((s) => s.categoryName === categoryName);
    return score ? Math.round(score.companyScore) : 0;
  };

  return (
    <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-[2]">
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-lg font-bold text-[#F7F8F8]">
          카테고리별 점수 비교
        </h3>

        {/* 경쟁사 select 박스 */}
        <div className="relative w-full">
          <select
            value={selectedCompetitor}
            onChange={(e) => onCompetitorChange(e.target.value)}
            className="w-full h-[36px] px-3 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-md text-sm font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent"
          >
            {companies.map((company) => {
              // analysisResultNo가 있고 targetCompanyYn이 N인 경우에만 옵션 표시
              if (
                "analysisResultNo" in company &&
                company.analysisResultNo &&
                "targetCompanyYn" in company &&
                company.targetCompanyYn === "N"
              ) {
                return (
                  <option
                    key={company.analysisResultNo}
                    value={company.analysisResultNo}
                  >
                    {company.companyName}
                  </option>
                );
              }
              return null;
            })}
          </select>

          <svg
            className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between items-end w-full h-[197px]">
        {data.map((category) => {
          const competitorScore = getCompetitorScoreForCategory(category.name);
          return (
            <div
              key={category.name}
              className="flex flex-col justify-center items-center p-2 gap-2 w-20 h-full"
            >
              <div className="flex items-center gap-2 w-16 h-[140px]">
                {/* 우리 회사 점수 */}
                <div className="relative w-7 h-[140px]">
                  <div className="absolute w-7 h-[140px] bg-white/6 rounded-[4px]" />
                  <div
                    className="absolute w-7 bg-gradient-to-t from-[#4E49DD] to-[#6E9CBD] rounded-[4px] flex items-end justify-center pb-1"
                    style={{
                      height: `${(category.ourScore / 100) * 128}px`,
                      bottom: "0px",
                      transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)", // 애니메이션 추가
                    }}
                  >
                    <span className="text-sm font-semibold text-[#F7F8F8]">
                      {category.ourScore}
                    </span>
                  </div>
                </div>
                {/* 경쟁사 점수 */}
                <div className="relative w-7 h-[140px]">
                  <div className="absolute w-7 h-[140px] bg-white/6 rounded-[4px]" />
                  {competitorScore > 0 && (
                    <div
                      className="absolute w-7 bg-white/10 rounded-[4px] flex items-end justify-center pb-1"
                      style={{
                        height: `${(competitorScore / 100) * 128}px`,
                        bottom: "0px",
                        transition: "height 0.4s cubic-bezier(0.4,0,0.2,1)", // 애니메이션 추가
                      }}
                    >
                      <span className="text-sm font-semibold text-[#8A8F98]">
                        {competitorScore}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[13px] font-medium text-[#D0D6E0] text-center">
                {category.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
