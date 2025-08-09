"use client";

import { ChevronDown } from "lucide-react";
import { useAnalysisForm } from "@/hooks/use-analysis-form";
import { useSearchParams } from "next/navigation";

export function AnalysisForm() {
  const searchParams = useSearchParams();
  const jobNo = searchParams.get("jobNo") ?? "";

  const {
    companies,
    industries,
    formData,
    loading,
    error,
    isFormValid,
    handleBrandChange,
    handleIndustryChange,
    handleCompetitorChange,
    handleSubmit,
    newCompanyName,
    setNewCompanyName,
    newIndustryName,
    setNewIndustryName,
    handleAddCompany,
    handleAddIndustry,
  } = useAnalysisForm(jobNo);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[480px] px-4 sm:px-0 mx-auto">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Brand Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
            브랜드명
          </label>
          <div className="relative">
            <select
              value={formData.targetCompanyNo}
              onChange={(e) => handleBrandChange(e.target.value)}
              disabled={loading}
              className="w-full h-[52px] px-4 py-[15px] bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">분석할 브랜드를 선택해 주세요.</option>
              {companies.map((company) => (
                <option key={company.companyNo} value={company.companyNo}>
                  {company.companyName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8] pointer-events-none rotate-0" />
          </div>
          {/* 브랜드명 입력 + 추가하기 */}
          <div className="flex flex-wrap gap-2 mt-2">
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="브랜드명 입력"
              className="flex-1 min-w-[200px] h-[52px] px-3 bg-white/4 border border-white/10 rounded-lg text-base text-[#D0D6E0] focus:outline-none focus:ring-2 focus:ring-[#4989DD]"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddCompany}
              disabled={loading || !newCompanyName.trim()}
              className={`h-[52px] px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                newCompanyName.trim() && !loading
                  ? "bg-gradient-to-r from-[#4989DD] to-[#4E49DD] text-white hover:opacity-90"
                  : "bg-[#232326] text-[#8A8F98] cursor-not-allowed"
              }`}
            >
              추가하기
            </button>
          </div>
        </div>

        {/* Industry Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
            업종
          </label>
          <div className="relative">
            <select
              value={formData.industryNo}
              onChange={(e) => handleIndustryChange(e.target.value)}
              disabled={loading}
              className="w-full h-[52px] px-4 py-[15px] bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">업종을 선택해 주세요.</option>
              {industries.map((industry) => (
                <option key={industry.industryNo} value={industry.industryNo}>
                  {industry.industryName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8] pointer-events-none rotate-0" />
          </div>
          {/* 업종명 입력 + 추가하기 */}
          <div className="flex flex-wrap gap-2 mt-2">
            <input
              type="text"
              value={newIndustryName}
              onChange={(e) => setNewIndustryName(e.target.value)}
              placeholder="업종명 입력"
              className="flex-1 min-w-[200px] h-[52px] px-3 bg-white/4 border border-white/10 rounded-lg text-base text-[#D0D6E0] focus:outline-none focus:ring-2 focus:ring-[#4989DD]"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddIndustry}
              disabled={loading || !newIndustryName.trim()}
              className={`h-[52px] px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                newIndustryName.trim() && !loading
                  ? "bg-gradient-to-r from-[#4989DD] to-[#4E49DD] text-white hover:opacity-90"
                  : "bg-[#232326] text-[#8A8F98] cursor-not-allowed"
              }`}
            >
              추가하기
            </button>
          </div>
        </div>

        {/* Competitors Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-medium leading-[140%] tracking-[-0.025em] text-[#D0D6E0]">
            주요 경쟁사 (최대 3개)
          </label>
          <div className="flex flex-col gap-1">
            {formData.competitorCompanyNoList.map((competitor, index) => (
              <div key={index} className="relative">
                <select
                  value={competitor}
                  onChange={(e) =>
                    handleCompetitorChange(index, e.target.value)
                  }
                  disabled={loading}
                  className="w-full h-[52px] px-4 py-[15px] bg-white/4 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-medium leading-[140%] tracking-[-0.025em] text-[#62666D] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4989DD] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">경쟁사를 선택해 주세요.</option>
                  {companies
                    .filter(
                      (company) =>
                        company.companyNo !== formData.targetCompanyNo &&
                        (formData.competitorCompanyNoList[index] ===
                          company.companyNo ||
                          !formData.competitorCompanyNoList.includes(
                            company.companyNo
                          ))
                    )
                    .map((company) => (
                      <option key={company.companyNo} value={company.companyNo}>
                        {company.companyName}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7F8F8] pointer-events-none rotate-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={!isFormValid || loading}
        onClick={handleSubmit}
        className={`w-full h-[56px] px-[30px] py-[17px] rounded-xl text-base font-semibold leading-[140%] tracking-[-0.025em] transition-all duration-200 ${
          isFormValid && !loading
            ? "bg-gradient-to-r from-[#4989DD] to-[#4E49DD] text-white hover:opacity-90 cursor-pointer"
            : "bg-[#232326] text-[#8A8F98] cursor-not-allowed"
        }`}
      >
        {loading ? "분석 중..." : "AI 분석 시작하기"}
      </button>
    </div>
  );
}
