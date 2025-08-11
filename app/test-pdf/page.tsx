"use client";

import { useState } from "react";
import PDFDownloadButton from "@/components/PDFDownloadButton";

export default function TestPDFPage() {
  const [testData] = useState([
    { name: "카테고리 1", ourScore: 85, competitorScore: 72 },
    { name: "카테고리 2", ourScore: 92, competitorScore: 88 },
    { name: "카테고리 3", ourScore: 78, competitorScore: 85 },
    { name: "카테고리 4", ourScore: 95, competitorScore: 79 },
  ]);

  return (
    <div className="min-h-screen bg-[#08090A] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">PDF 생성 테스트</h1>

        <div className="bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            테스트 데이터
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testData.map((item, index) => (
              <div
                key={index}
                className="bg-white/6 border border-white/10 rounded-lg p-4 text-center"
              >
                <h3 className="text-white font-medium mb-2">{item.name}</h3>
                <div className="text-2xl font-bold text-[#4E49DD]">
                  {item.ourScore}
                </div>
                <div className="text-sm text-[#8A8F98]">
                  경쟁사: {item.competitorScore}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            PDF 다운로드 테스트
          </h2>
          <div className="flex gap-4">
            <PDFDownloadButton />
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              뒤로 가기
            </button>
          </div>
        </div>

        <div className="bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">사용법</h2>
          <ol className="text-white/80 space-y-2 list-decimal list-inside">
            <li>위의 "리포트 다운" 버튼을 클릭하세요</li>
            <li>PDF 생성이 시작되면 진행 상황을 확인할 수 있습니다</li>
            <li>생성이 완료되면 자동으로 다운로드됩니다</li>
            <li>생성된 PDF에서 차트와 데이터가 제대로 표시되는지 확인하세요</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
