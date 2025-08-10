import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Company, Industry, AnalysisFormData } from "@/types";
import { apiClient } from "@/lib/api";

export function useAnalysisForm(jobNo: string) {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AnalysisFormData>({
    targetCompanyNo: "",
    industryNo: "",
    competitorCompanyNoList: ["", "", ""],
  });

  const [newCompanyName, setNewCompanyName] = useState("");
  const [newIndustryName, setNewIndustryName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 필요 시 jobNo 기반 API로 교체 가능
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
  }, [jobNo]);

  const isFormValid =
    formData.targetCompanyNo &&
    formData.industryNo &&
    formData.competitorCompanyNoList.some((comp) => comp !== "");

  const handleBrandChange = (companyNo: string) => {
    setFormData((prev) => ({ ...prev, targetCompanyNo: companyNo }));
  };

  const handleIndustryChange = (industryNo: string) => {
    setFormData((prev) => ({ ...prev, industryNo }));
  };

  const handleCompetitorChange = (index: number, companyNo: string) => {
    setFormData((prev) => ({
      ...prev,
      competitorCompanyNoList: prev.competitorCompanyNoList.map((comp, i) =>
        i === index ? companyNo : comp
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      setLoading(true);
      setError(null);

      const competitorList = formData.competitorCompanyNoList.filter(
        (comp) => comp !== ""
      );

      const result = await apiClient.createAnalysisResult(jobNo, {
        targetCompanyNo: formData.targetCompanyNo,
        industryNo: formData.industryNo,
        competitorCompanyNoList: competitorList,
      });

      console.log("🚀 API Response:", result);
      console.log(
        "🔗 Navigating to:",
        `/result?jobNo=${result.no}&analysisResultNo=${result.no}`
      );

      // 선택된 브랜드명을 URL 파라미터로 전달
      const selectedBrand = companies.find(
        (company) => company.companyNo === formData.targetCompanyNo
      );
      const brandName = selectedBrand
        ? encodeURIComponent(selectedBrand.companyName)
        : "";

      router.push(
        `/result?jobNo=${result.no}&analysisResultNo=${result.no}&brandName=${brandName}`
      );
    } catch (err) {
      setError("분석을 시작하는데 실패했습니다.");
      console.error("Failed to start analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return;
    setLoading(true);
    try {
      const added = await apiClient.addCompany(newCompanyName.trim());
      setCompanies((prev) => [...prev, added]);
      setNewCompanyName("");
    } catch (err) {
      setError("브랜드 추가 실패");
      console.error("브랜드 추가 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIndustry = async () => {
    if (!newIndustryName.trim()) return;
    setLoading(true);
    try {
      const added = await apiClient.addIndustry(newIndustryName.trim());
      setIndustries((prev) => [...prev, added]);
      setNewIndustryName("");
    } catch (err) {
      setError("업종 추가 실패");
      console.error("업종 추가 실패:", err);
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
    newCompanyName,
    setNewCompanyName,
    newIndustryName,
    setNewIndustryName,
    handleAddCompany,
    handleAddIndustry,
  };
}
