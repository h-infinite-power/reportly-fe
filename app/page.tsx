"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCompetitors, setSelectedCompetitors] = useState(["", "", ""]);

  const isFormValid =
    selectedBrand && selectedIndustry && selectedCompetitors.every((c) => c);

  return (
    <div className="min-h-screen w-full bg-[#08090A] relative overflow-hidden">
      {/* Background Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(80% 50% at 50% -20%, rgba(120, 119, 198, 0.3) 0%, rgba(120, 119, 198, 0) 100%),
            radial-gradient(60% 50% at 80% 20%, rgba(78, 73, 221, 0.15) 0%, rgba(78, 73, 221, 0) 100%),
            #08090A
          `,
        }}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen">
        {/* Header */}
        <header className="w-full flex justify-between items-center px-8 py-4 h-[72px] bg-black/8 backdrop-blur-[10px]">
          <h1 className="text-[26px] font-bold leading-[110%] tracking-[-0.025em] text-[#F7F8F8]">
            Reportly
          </h1>
          <div className="w-[112px] h-10 bg-gradient-to-r from-[#4989DD] to-[#4E49DD] rounded-lg hidden" />
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center gap-40 flex-1 w-full max-w-[1920px] pt-20">
          <div className="flex flex-col items-center gap-14 w-full">
            {/* Hero Section */}
            <div className="flex flex-col items-center gap-8 w-[376px]">
              {/* Badge */}
              <div className="flex items-center gap-2 px-4 py-[9px] bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-3xl">
                <div className="w-2 h-2 bg-[#8BBDFF] rounded-full" />
                <span className="text-sm font-semibold leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
                  AI가 보는 당신의 브랜드
                </span>
              </div>

              {/* Title and Description */}
              <div className="flex flex-col items-center gap-5 w-full">
                <h2
                  className="text-[38px] font-bold leading-[115%] text-center tracking-[-0.025em] w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, #FFFFFF 0%, #9CA3AF 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <p>LLM이 진단하는</p>
                  <p>우리 브랜드의 진짜 경쟁력</p>
                </h2>
                <p className="text-base leading-[150%] text-center tracking-[-0.025em] text-[#D0D6E0] w-[322px]">
                  GPT-4가 인식하는 자사 브랜드의 이미지를 분석하고, 경쟁사와의
                  포지셔닝을 한눈에 파악하세요.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex flex-col gap-8 w-[480px]">
              <div className="flex flex-col gap-6">
                {/* Brand Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
                    브랜드명
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full h-[52px] px-4 py-[15px] bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent"
                    >
                      <option value="">분석할 브랜드를 선택해 주세요.</option>
                      <option value="apple">Apple</option>
                      <option value="samsung">Samsung</option>
                      <option value="google">Google</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8] pointer-events-none rotate-0" />
                  </div>
                </div>

                {/* Industry Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
                    업종
                  </label>
                  <div className="relative">
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full h-[52px] px-4 py-[15px] bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent"
                    >
                      <option value="">업종을 선택해 주세요.</option>
                      <option value="tech">기술</option>
                      <option value="retail">소매</option>
                      <option value="finance">금융</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8] pointer-events-none rotate-0" />
                  </div>
                </div>

                {/* Competitors Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-base font-medium leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
                    주요 경쟁사
                  </label>
                  <div className="flex flex-col gap-1">
                    {selectedCompetitors.map((competitor, index) => (
                      <div key={index} className="relative">
                        <select
                          value={competitor}
                          onChange={(e) => {
                            const newCompetitors = [...selectedCompetitors];
                            newCompetitors[index] = e.target.value;
                            setSelectedCompetitors(newCompetitors);
                          }}
                          className="w-full h-[52px] px-4 py-[15px] bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent"
                        >
                          <option value="">경쟁사를 선택해 주세요.</option>
                          <option value="competitor1">경쟁사 1</option>
                          <option value="competitor2">경쟁사 2</option>
                          <option value="competitor3">경쟁사 3</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8] pointer-events-none rotate-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                disabled={!isFormValid}
                className={`w-full h-14 px-[30px] py-[17px] rounded-xl text-base font-semibold leading-[140%] tracking-[-0.025em] transition-all duration-200 ${
                  isFormValid
                    ? "bg-gradient-to-r from-[#4989DD] to-[#4E49DD] text-white hover:opacity-90 cursor-pointer"
                    : "bg-[#232326] text-[#8A8F98] cursor-not-allowed"
                }`}
              >
                AI 분석 시작하기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
