import type { CategoryData } from "@/types"

interface CategoryChartProps {
  data: CategoryData[]
}

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-[2]">
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-lg font-bold text-[#F7F8F8]">카테고리 별 점수</h3>
        <p className="text-sm leading-[150%] text-[#8A8F98]">
          LLM 분석을 기반으로 각 카테고리의 평균 점수를 산출했습니다. 경쟁사 대비 강점과 약점을 한눈에 확인할 수
          있습니다.
        </p>
      </div>

      <div className="flex justify-between items-end w-full h-[197px]">
        {data.map((category, index) => (
          <div key={category.name} className="flex flex-col justify-center items-center p-2 gap-2 w-20 h-full">
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
                  <span className="text-sm font-semibold text-[#F7F8F8]">{category.ourScore}</span>
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
                  <span className="text-sm font-semibold text-[#8A8F98]">{category.competitorScore}</span>
                </div>
              </div>
            </div>
            <span className="text-[13px] font-medium text-[#D0D6E0] text-center">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
