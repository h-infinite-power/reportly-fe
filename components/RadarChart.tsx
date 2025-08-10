"use client";

import { Info } from "lucide-react";

interface RadarChartProps {
  ourData: { name: string; ourScore: number }[];
  competitorData: { name: string; competitorScore: number }[];
}

export default function RadarChart({
  ourData,
  competitorData,
}: RadarChartProps) {
  // 실제 데이터에서 카테고리 목록 생성
  const categories = Array.from(
    new Set([
      ...ourData.map((d) => d.name),
      ...competitorData.map((d) => d.name),
    ])
  ).filter(Boolean);

  // 데이터가 없으면 기본 카테고리 사용
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1">
        <div className="flex items-center gap-1">
          <h3 className="text-lg font-bold text-[#F7F8F8]">
            경쟁사 비교 그래프
          </h3>
          <Info className="w-4 h-4 text-white/10" />
        </div>
        <div className="flex justify-center items-center w-[276px] h-[254px]">
          <p className="text-[#8A8F98] text-sm">카테고리 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 모든 점수가 0인지 확인
  const allScoresZero =
    ourData.every((d) => d.ourScore === 0) &&
    competitorData.every((d) => d.competitorScore === 0);

  if (allScoresZero) {
    return (
      <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1">
        <div className="flex items-center gap-1">
          <h3 className="text-lg font-bold text-[#F7F8F8]">
            경쟁사 비교 그래프
          </h3>
          <Info className="w-4 h-4 text-white/10" />
        </div>
        <div className="flex justify-center items-center w-[276px] h-[254px]">
          <p className="text-[#8A8F98] text-sm">점수 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  const center = { x: 138, y: 120 };
  const maxRadius = 90; // 가장 큰 그리드 반지름
  const levels = 5; // 그리드 단계 수

  function getPoint(score: number, idx: number, radiusScale = 1) {
    const angle = ((2 * Math.PI) / categories.length) * idx - Math.PI / 2;
    const r = radiusScale * maxRadius * (score / 100);
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    };
  }

  // 그리드 레벨별 폴리곤 생성
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const r = ((levels - level) / levels) * maxRadius;
    const points = categories
      .map((_, i) => {
        const angle = ((2 * Math.PI) / categories.length) * i - Math.PI / 2;
        return `${center.x + r * Math.cos(angle)},${
          center.y + r * Math.sin(angle)
        }`;
      })
      .join(" ");
    return (
      <polygon
        key={level}
        points={points}
        fill="none"
        stroke="#3E3E44"
        strokeWidth="1"
      />
    );
  });

  // 축 라인
  const axes = categories.map((_, i) => {
    const angle = ((2 * Math.PI) / categories.length) * i - Math.PI / 2;
    return (
      <line
        key={`axis-${i}`}
        x1={center.x}
        y1={center.y}
        x2={center.x + maxRadius * Math.cos(angle)}
        y2={center.y + maxRadius * Math.sin(angle)}
        stroke="#3E3E44"
        strokeWidth="1"
      />
    );
  });

  // 데이터 좌표
  const ourPoints = categories.map((cat, i) => {
    const found = ourData.find((d) => d.name === cat);
    return getPoint(found ? found.ourScore : 0, i, 1);
  });
  const competitorPoints = categories.map((cat, i) => {
    const found = competitorData.find((d) => d.name === cat);
    return getPoint(found ? found.competitorScore : 0, i, 1);
  });

  const toPointsString = (points: { x: number; y: number }[]) =>
    points.map((p) => `${p.x},${p.y}`).join(" ");

  // 라벨 위치
  const labels = categories.map((cat, i) => {
    const labelPos = getPoint(130, i, 1); // 바깥쪽
    return (
      <text
        key={cat}
        x={labelPos.x}
        y={labelPos.y}
        fontSize="12"
        fill="#D0D6E0"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {cat}
      </text>
    );
  });

  return (
    <div className="flex flex-col items-start p-6 gap-4 bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1">
      <div className="flex items-center gap-1">
        <h3 className="text-lg font-bold text-[#F7F8F8]">경쟁사 비교 그래프</h3>
        <Info className="w-4 h-4 text-white/10" />
      </div>

      <div className="flex justify-center items-center w-[276px] h-[254px]">
        <svg
          width="276"
          height="240"
          viewBox="0 0 276 240"
          className="w-full h-full"
        >
          {gridPolygons}
          {axes}

          {/* 우리 데이터 */}
          <polygon
            points={toPointsString(ourPoints)}
            fill="rgba(171, 248, 173, 0.5)"
            stroke="#39A13C"
            strokeWidth="2"
            opacity="0.6"
          />
          {/* 경쟁사 데이터 */}
          <polygon
            points={toPointsString(competitorPoints)}
            fill="rgba(150, 183, 255, 0.5)"
            stroke="#4E49DD"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* 우리 점 */}
          {ourPoints.map((p, i) => (
            <circle
              key={`our-${i}`}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#ABF8AD"
              stroke="#F7F8F8"
              strokeWidth="1"
            />
          ))}

          {/* 경쟁사 점 */}
          {competitorPoints.map((p, i) => (
            <circle
              key={`comp-${i}`}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#16BFD6"
              stroke="#F7F8F8"
              strokeWidth="1"
            />
          ))}

          {labels}
        </svg>
      </div>
    </div>
  );
}
