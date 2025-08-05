interface HeaderProps {
  showDownloadButton?: boolean
}

export default function Header({ showDownloadButton = false }: HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 h-[72px] bg-black/8 backdrop-blur-[10px]">
      <h1 className="text-[26px] font-bold leading-[110%] tracking-[-0.025em] text-[#F7F8F8]">Reportly</h1>
      {showDownloadButton ? (
        <button className="px-5 py-[13px] bg-white/6 border border-white/10 backdrop-blur-[4px] rounded-xl text-base font-semibold text-[#D0D6E0] hover:bg-white/8 transition-colors">
          리포트 다운
        </button>
      ) : (
        <div className="w-[68px] h-10" />
      )}
    </header>
  )
}
