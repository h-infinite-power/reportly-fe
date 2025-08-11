import { useIsMobile } from "@/hooks/use-mobile";
import { generateCurrentPagePDF } from "@/lib/pdf-api";

interface HeaderProps {
  showDownloadButton?: boolean;
  onDownloadClick?: () => void;
  isGeneratingPDF?: boolean;
  pdfProgress?: string;
}

export default function Header({
  showDownloadButton = false,
  onDownloadClick,
  isGeneratingPDF = false,
  pdfProgress = "",
}: HeaderProps) {
  const isMobile = useIsMobile();

  const handleDownloadClick = async () => {
    if (onDownloadClick) {
      onDownloadClick();
    } else {
      try {
        // 기본적으로 현재 페이지를 PDF로 변환
        await generateCurrentPagePDF();
      } catch (error) {
        alert("PDF 다운로드에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <header
      className={`w-full flex justify-between items-center py-4 h-[72px] bg-black/8 backdrop-blur-[10px] ${
        isMobile ? "px-4" : "px-8"
      }`}
    >
      <h1
        className={`font-bold leading-[110%] tracking-[-0.025em] text-[#F7F8F8] ${
          isMobile ? "text-xl" : "text-[26px]"
        }`}
      >
        Reportly
      </h1>
      {showDownloadButton ? (
        <button
          onClick={handleDownloadClick}
          disabled={isGeneratingPDF}
          className={`bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-xl font-semibold text-[#D0D6E0] hover:bg-white/8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isMobile ? "px-3 py-2 text-sm" : "px-5 py-[13px] text-base"
          }`}
        >
          {isGeneratingPDF ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#D0D6E0] border-t-transparent rounded-full animate-spin"></div>
              {pdfProgress || "PDF 생성 중..."}
            </div>
          ) : (
            "리포트 다운"
          )}
        </button>
      ) : (
        <div className={`h-10 ${isMobile ? "w-12" : "w-[68px]"}`} />
      )}
    </header>
  );
}
