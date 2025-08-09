import type { CategoryData } from "@/types";

interface Company {
  companyNo: string;
  companyName: string;
}

interface CategoryChartProps {
  data: CategoryData[];
  companies: Company[]; // 경쟁사 목록
  selectedCompetitor: string; // 선택된 경쟁사 번호
  onCompetitorChange: (value: string) => void; // 변경 핸들러
}

export default function CategoryChart({
  data,
  companies,
  selectedCompetitor,
  onCompetitorChange,
}: CategoryChartProps) {
  return (
    <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-[2]">
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-lg font-bold text-[#F7F8F8]">
          경쟁사 카테고리 별 점수
        </h3>

        {/* 경쟁사 select 박스 */}
        <div className="relative w-full">
          <select
            value={selectedCompetitor}
            onChange={(e) => onCompetitorChange(e.target.value)}
            className="w-full h-[36px] px-3 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-md text-sm font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent"
          >
            <option value="">경쟁사를 선택해 주세요.</option>
            {companies.map((company) => (
              <option key={company.companyNo} value={company.companyNo}>
                {company.companyName}
              </option>
            ))}
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
        {data.map((category) => (
          <div
            key={category.name}
            className="flex flex-col justify-center items-center p-2 gap-2 w-20 h-full"
          >
            <div className="flex items-center gap-2 w-16 h-[140px]">
              <div className="relative w-7 h-[140px]">
                <div className="absolute w-7 h-[140px] bg-white/6 rounded-[4px]" />
                <div
                  className="absolute w-7 bg-gradient-to-t from-[#4E49DD] to-[#6E9CBD] rounded-[4px] flex items-end justify-center pb-1"
                  style={{
                    height: `${(category.ourScore / 100) * 128}px`,
                    bottom: "0px",
                  }}
                >
                  <span className="text-sm font-semibold text-[#F7F8F8]">
                    {category.ourScore}
                  </span>
                </div>
              </div>
              <div className="relative w-7 h-[140px]">
                <div className="absolute w-7 h-[140px] bg-white/6 rounded-[4px]" />
                <div
                  className="absolute w-7 bg-white/10 rounded-[4px] flex items-end justify-center pb-1"
                  style={{
                    height: `${(category.competitorScore / 100) * 128}px`,
                    bottom: "0px",
                  }}
                >
                  <span className="text-sm font-semibold text-[#8A8F98]">
                    {category.competitorScore}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-[13px] font-medium text-[#D0D6E0] text-center">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
