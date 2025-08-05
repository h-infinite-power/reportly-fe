import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Company, Industry, AnalysisFormData } from "@/types";
import { apiClient } from "@/lib/api";

export function useAnalysisForm() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [formData, setFormData] = useState<AnalysisFormData>({
    targetCompanyNo: "",
    industryNo: "",
    competitorCompanyNoList: ["", "", ""],
  });

  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [companiesData, industriesData] = await Promise.all([
          apiClient.getCompanies(),
          apiClient.getIndustries(),
        ]);
        setCompanies(companiesData);
        setIndustries(industriesData);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 폼 유효성 검사
  const isFormValid =
    formData.targetCompanyNo &&
    formData.industryNo &&
    formData.competitorCompanyNoList.some((comp) => comp !== "");

  // 브랜드 선택 핸들러
  const handleBrandChange = (companyNo: string) => {
    setFormData((prev) => ({
      ...prev,
      targetCompanyNo: companyNo,
    }));
  };

  // 업종 선택 핸들러
  const handleIndustryChange = (industryNo: string) => {
    setFormData((prev) => ({
      ...prev,
      industryNo,
    }));
  };

  // 경쟁사 선택 핸들러
  const handleCompetitorChange = (index: number, companyNo: string) => {
    setFormData((prev) => ({
      ...prev,
      competitorCompanyNoList: prev.competitorCompanyNoList.map((comp, i) =>
        i === index ? companyNo : comp
      ),
    }));
  };

  // 분석 시작 핸들러
  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      setLoading(true);
      setError(null);

      const competitorList = formData.competitorCompanyNoList.filter(
        (comp) => comp !== ""
      );

      const result = await apiClient.createAnalysisResult({
        targetCompanyNo: formData.targetCompanyNo,
        industryNo: formData.industryNo,
        competitorCompanyNoList: competitorList,
      });

      // 결과 페이지로 이동
      router.push(`/result?analysisId=${result.analysisResultNo}`);
    } catch (err) {
      setError("분석을 시작하는데 실패했습니다.");
      console.error("Failed to start analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
