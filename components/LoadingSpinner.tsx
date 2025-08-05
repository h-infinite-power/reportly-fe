export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[#4989DD]/20 border-t-[#4989DD] rounded-full animate-spin"></div>
      </div>
      <p className="text-[#D0D6E0] text-base">분석 결과를 불러오는 중...</p>
    </div>
  );
}
