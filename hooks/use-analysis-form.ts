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

      // 분석 결과 생성 후, 해당 job의 분석 결과 정보를 가져와서 첫 번째 기업의 analysisResultNo 사용
      try {
        const analysisResultsInfo = await apiClient.getAnalysisResultsInfo(
          result.no
        );
        if (analysisResultsInfo && analysisResultsInfo.length > 0) {
          const firstCompanyAnalysisResultNo =
            analysisResultsInfo[0].analysisResultNo;
          router.push(
            `/result?jobNo=${result.no}&analysisResultNo=${firstCompanyAnalysisResultNo}`
          );
        } else {
          // API에서 데이터를 가져올 수 없는 경우 기존 방식 사용
          router.push(
            `/result?jobNo=${result.no}&analysisResultNo=${result.no}`
          );
        }
      } catch (infoError) {
        // API 호출 실패 시 기존 방식 사용
        router.push(`/result?jobNo=${result.no}&analysisResultNo=${result.no}`);
      }
    } catch (err) {
      setError("분석을 시작하는데 실패했습니다.");
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
