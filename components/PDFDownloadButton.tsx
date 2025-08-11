import { useState } from "react";
import { Download, CheckCircle, AlertCircle } from "lucide-react";
import { generateResultsPDF } from "@/lib/pdf-generator";
import { useIsMobile } from "@/hooks/use-mobile";

interface PDFDownloadButtonProps {
  className?: string;
}

export default function PDFDownloadButton({
  className = "",
}: PDFDownloadButtonProps) {
  const [status, setStatus] = useState<
    "idle" | "generating" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  const handleDownload = async () => {
    if (status === "generating") return;

    try {
      setStatus("generating");
      setProgress(0);

      // 진행 상황 시뮬레이션
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // PDF 생성
      await generateResultsPDF({
        filename: `reportly-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`,
        format: "a4",
        orientation: "portrait",
        quality: "high",
      });

      clearInterval(progressInterval);
      setProgress(100);
      setStatus("success");

      // 성공 상태를 잠시 표시 후 초기화
      setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 2000);
    } catch (error) {
      setStatus("error");
      setProgress(0);

      // 에러 상태를 잠시 표시 후 초기화
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case "generating":
        return (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>PDF 생성 중... {progress}%</span>
            </div>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>다운로드 완료!</span>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>생성 실패</span>
          </>
        );
      default:
        return (
          <>
            <Download className="w-4 h-4" />
            <span>리포트 다운</span>
          </>
        );
    }
  };

  const getButtonClasses = () => {
    const baseClasses = `flex items-center justify-center gap-2 bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-xl font-semibold text-[#D0D6E0] transition-all duration-300 ${
      isMobile ? "px-3 py-2 text-sm" : "px-5 py-[13px] text-base"
    }`;

    switch (status) {
      case "generating":
        return `${baseClasses} bg-blue-500/20 border-blue-500/30 text-blue-300 cursor-not-allowed`;
      case "success":
        return `${baseClasses} bg-green-500/20 border-green-500/30 text-green-300`;
      case "error":
        return `${baseClasses} bg-red-500/20 border-red-500/30 text-red-300`;
      default:
        return `${baseClasses} hover:bg-white/8 hover:scale-105 active:scale-95`;
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === "generating"}
      className={`${getButtonClasses()} ${className}`}
    >
      {getButtonContent()}
    </button>
  );
}
