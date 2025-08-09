import { Info } from "lucide-react";

interface RadarChartProps {
  ourData: any[];
  competitorData: { name: string; competitorScore: number }[]; // 추가
}

export default function RadarChart({
  ourData,
  competitorData,
}: RadarChartProps) {
  // ourData와 competitorData를 모두 사용해서 그래프를 그림
  // 예시: 두 데이터 세트를 비교해서 시각화
  return (
    <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1">
      <div className="flex items-center gap-1">
        <h3 className="text-lg font-bold text-[#F7F8F8]">경쟁사 비교 그래프</h3>
        <Info className="w-4 h-4 text-white/10" />
      </div>

      <div className="flex flex-col justify-center items-center gap-2 w-full h-[254px]">
        <svg
          width="276"
          height="240"
          viewBox="0 0 276 240"
          className="w-full h-full"
        >
          {/* Grid lines */}
          <g stroke="#3E3E44" strokeWidth="1" fill="none">
            <polygon points="138,30 200,70 200,170 138,210 76,170 76,70" />
            <polygon points="138,50 180,80 180,160 138,190 96,160 96,80" />
            <polygon points="138,70 160,90 160,150 138,170 116,150 116,90" />
            <polygon points="138,90 140,100 140,140 138,150 136,140 136,100" />
          </g>

          {/* Data areas */}
          <polygon
            points="138,45 185,75 175,155 125,185 95,145 115,85"
            fill="rgba(171, 248, 173, 0.5)"
            stroke="#39A13C"
            strokeWidth="2"
            opacity="0.6"
          />
          <polygon
            points="138,55 175,85 165,145 135,175 105,135 125,95"
            fill="rgba(150, 183, 255, 0.5)"
            stroke="#4E49DD"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Data points */}
          <circle
            cx="192"
            cy="78"
            r="2"
            fill="#ABF8AD"
            stroke="#F7F8F8"
            strokeWidth="1"
          />
          <circle cx="186" cy="135" r="2" fill="#ABF8AD" />
          <circle cx="160" cy="177" r="2" fill="#ABF8AD" />
          <circle cx="97" cy="194" r="2" fill="#ABF8AD" />
          <circle cx="52" cy="141" r="2" fill="#ABF8AD" />
          <circle cx="78" cy="81" r="2" fill="#ABF8AD" />
          <circle cx="133" cy="63" r="2" fill="#ABF8AD" />

          <circle cx="67" cy="74" r="2" fill="#16BFD6" />
          <circle cx="71" cy="136" r="2" fill="#16BFD6" />
          <circle cx="103" cy="181" r="2" fill="#16BFD6" />
          <circle cx="213" cy="141" r="2" fill="#16BFD6" />
          <circle cx="150" cy="157" r="2" fill="#16BFD6" />
          <circle
            cx="198"
            cy="74"
            r="2"
            fill="#16BFD6"
            stroke="#F7F8F8"
            strokeWidth="1"
          />
          <circle cx="134" cy="44" r="2" fill="#16BFD6" />

          {/* Labels */}
          <text x="122" y="15" fontSize="12" fill="#D0D6E0" textAnchor="middle">
            인지도
          </text>
          <text x="224" y="55" fontSize="12" fill="#D0D6E0" textAnchor="middle">
            이미지
          </text>
          <text
            x="245"
            y="142"
            fontSize="12"
            fill="#D0D6E0"
            textAnchor="middle"
          >
            트렌드
          </text>
          <text
            x="178"
            y="218"
            fontSize="12"
            fill="#D0D6E0"
            textAnchor="middle"
          >
            만족도
          </text>
          <text x="62" y="218" fontSize="12" fill="#D0D6E0" textAnchor="middle">
            가성비
          </text>
          <text x="31" y="142" fontSize="12" fill="#D0D6E0" textAnchor="middle">
            신뢰도
          </text>
          <text x="17" y="55" fontSize="12" fill="#D0D6E0" textAnchor="middle">
            차별점
          </text>
        </svg>
      </div>
    </div>
  );
}
