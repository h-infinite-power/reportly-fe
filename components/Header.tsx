import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  showDownloadButton?: boolean;
}

export default function Header({ showDownloadButton = false }: HeaderProps) {
  const isMobile = useIsMobile();

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
          className={`bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-xl font-semibold text-[#D0D6E0] hover:bg-white/8 transition-colors ${
            isMobile ? "px-3 py-2 text-sm" : "px-5 py-[13px] text-base"
          }`}
        >
          리포트 다운
        </button>
      ) : (
        <div className={`h-10 ${isMobile ? "w-12" : "w-[68px]"}`} />
      )}
    </header>
  );
}
