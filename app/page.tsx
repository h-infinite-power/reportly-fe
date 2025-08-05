"use client";

import { AnalysisForm } from "@/components/AnalysisForm";

export default function Home() {
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
            <AnalysisForm />
          </div>
        </main>
      </div>
    </div>
  );
}
