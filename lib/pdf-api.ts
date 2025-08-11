// 서버 API를 통한 PDF 생성 유틸리티

export interface PDFGenerationOptions {
  url: string;
  filename?: string;
}

export const generatePDFViaAPI = async (
  options: PDFGenerationOptions
): Promise<void> => {
  try {
    const { url, filename = "reportly-report.pdf" } = options;

    // API 호출
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, filename }),
    });

    if (!response.ok) {
      // 오류 응답인 경우 JSON으로 파싱
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || "PDF 생성에 실패했습니다.");
      } catch (parseError) {
        // JSON 파싱 실패 시 텍스트로 읽기 시도
        try {
          const errorText = await response.text();
          throw new Error(errorText || "PDF 생성에 실패했습니다.");
        } catch {
          throw new Error(`PDF 생성에 실패했습니다. (HTTP ${response.status})`);
        }
      }
    }

    // 성공 응답인 경우 Content-Type 확인
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/pdf")) {
      // PDF가 아닌 응답인 경우 오류 처리
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || "PDF 생성에 실패했습니다.");
      } catch {
        throw new Error("PDF 생성에 실패했습니다. 잘못된 응답 형식입니다.");
      }
    }

    // Content-Length 확인
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) === 0) {
      throw new Error("PDF 생성에 실패했습니다. 빈 파일이 생성되었습니다.");
    }

    // PDF 파일 다운로드
    const blob = await response.blob();

    // Blob 유효성 검사
    if (!blob || blob.size === 0) {
      throw new Error("PDF 생성에 실패했습니다. 빈 파일이 생성되었습니다.");
    }

    if (blob.type !== "application/pdf") {
      throw new Error("PDF 생성에 실패했습니다. 잘못된 파일 형식입니다.");
    }

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 메모리 정리
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    throw error;
  }
};

// 현재 페이지 URL을 기반으로 PDF 생성
export const generateCurrentPagePDF = async (
  filename?: string
): Promise<void> => {
  const currentUrl = window.location.href;
  const defaultFilename =
    filename || `reportly-${new Date().toISOString().split("T")[0]}.pdf`;

  await generatePDFViaAPI({
    url: currentUrl,
    filename: defaultFilename,
  });
};

// 특정 URL의 PDF 생성
export const generateURLPDF = async (
  url: string,
  filename?: string
): Promise<void> => {
  const defaultFilename =
    filename || `reportly-${new Date().toISOString().split("T")[0]}.pdf`;

  await generatePDFViaAPI({
    url,
    filename: defaultFilename,
  });
};
