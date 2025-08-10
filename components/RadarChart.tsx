"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface RadarChartProps {
  ourData: { name: string; ourScore: number }[];
  competitorData: { name: string; competitorScore: number }[];
}

export default function RadarChart({
  ourData,
  competitorData,
}: RadarChartProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    category: string;
    ourScore: number;
    competitorScore: number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    category: "",
    ourScore: 0,
    competitorScore: 0,
  });

  const isMobile = useIsMobile();

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
      <div
        className={`flex flex-col items-start bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1 relative ${
          isMobile ? "p-4 gap-3" : "p-6 gap-4"
        }`}
      >
        <div className="flex items-center gap-1">
          <h3
            className={`font-bold text-[#F7F8F8] ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            경쟁사 비교 그래프
          </h3>
          <Info
            className={`text-white/10 ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
          />
        </div>
        <div
          className={`flex justify-center items-center ${
            isMobile ? "w-full h-[200px]" : "w-[276px] h-[254px]"
          }`}
        >
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
      <div
        className={`flex flex-col items-start bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1 relative ${
          isMobile ? "p-4 gap-3" : "p-6 gap-4"
        }`}
      >
        <div className="flex items-center gap-1">
          <h3
            className={`font-bold text-[#F7F8F8] ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            경쟁사 비교 그래프
          </h3>
          <Info
            className={`text-white/10 ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
          />
        </div>
        <div
          className={`flex justify-center items-center ${
            isMobile ? "w-full h-[200px]" : "w-[276px] h-[254px]"
          }`}
        >
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

  // 데이터 좌표 - 카테고리별로 매칭하여 점수 계산
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

  // 마우스 이벤트 핸들러
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 각 카테고리 영역에서 마우스 위치 확인
    for (let i = 0; i < categories.length; i++) {
      const ourPoint = ourPoints[i];
      const competitorPoint = competitorPoints[i];
      const category = categories[i];

      // 마우스가 점 근처에 있는지 확인 (20px 반지름으로 증가)
      const distanceToOur = Math.sqrt(
        Math.pow(mouseX - ourPoint.x, 2) + Math.pow(mouseY - ourPoint.y, 2)
      );
      const distanceToCompetitor = Math.sqrt(
        Math.pow(mouseX - competitorPoint.x, 2) +
          Math.pow(mouseY - competitorPoint.y, 2)
      );

      if (distanceToOur < 20 || distanceToCompetitor < 20) {
        const ourScore =
          ourData.find((d) => d.name === category)?.ourScore || 0;
        const competitorScore =
          competitorData.find((d) => d.name === category)?.competitorScore || 0;

        // 기존 툴팁과 같은 카테고리면 위치만 업데이트
        if (tooltip.visible && tooltip.category === category) {
          setTooltip((prev) => ({
            ...prev,
            x: mouseX,
            y: mouseY,
          }));
        } else {
          // 새로운 카테고리거나 툴팁이 숨겨진 상태면 새로 생성
          setTooltip({
            visible: true,
            x: mouseX,
            y: mouseY,
            category,
            ourScore: Math.round(ourScore),
            competitorScore: Math.round(competitorScore),
          });
        }
        return;
      }
    }

    // 마우스가 모든 점에서 멀어졌을 때만 툴팁 숨김
    if (tooltip.visible) {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      className={`flex flex-col items-start bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl flex-1 relative ${
        isMobile ? "p-4 gap-3" : "p-6 gap-4"
      }`}
    >
      <div className="flex items-center gap-1">
        <h3
          className={`font-bold text-[#F7F8F8] ${
            isMobile ? "text-base" : "text-lg"
          }`}
        >
          경쟁사 비교 그래프
        </h3>
        <Info className={`text-white/10 ${isMobile ? "w-3 h-3" : "w-4 h-4"}`} />
      </div>

      <div
        className={`flex justify-center items-center ${
          isMobile ? "w-full h-[200px]" : "w-[276px] h-[254px]"
        }`}
      >
        <svg
          width="276"
          height="240"
          viewBox="0 0 276 240"
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {gridPolygons}
          {axes}

          {/* 타겟 회사 데이터 (우리 회사) */}
          <polygon
            points={toPointsString(ourPoints)}
            fill="rgba(171, 248, 173, 0.5)"
            stroke="#39A13C"
            strokeWidth="2"
            opacity="0.6"
          />
          {/* 경쟁사 평균 데이터 */}
          <polygon
            points={toPointsString(competitorPoints)}
            fill="rgba(150, 183, 255, 0.5)"
            stroke="#4E49DD"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* 타겟 회사 점 */}
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

          {/* 경쟁사 평균 점 */}
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

      {/* 툴팁 */}
      {tooltip.visible && (
        <div
          className="absolute z-10 flex flex-col items-start p-2 gap-1 bg-[rgba(35,35,38,0.8)] border border-[rgba(255,255,255,0.1)] shadow-[0px_0px_20px_rgba(0,0,0,0.32)] backdrop-blur-[4px] rounded-lg"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 20}px`,
          }}
        >
          <div className="text-[#F7F8F8] text-xs font-semibold leading-[140%] tracking-[-0.025em]">
            {tooltip.category}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[#8BBDFF] text-xs font-medium leading-[140%] tracking-[-0.025em]">
              우리 브랜드 : {tooltip.ourScore}
            </div>
            <div className="text-[#ABF8AD] text-xs font-medium leading-[140%] tracking-[-0.025em]">
              경쟁사 평균 : {tooltip.competitorScore}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
