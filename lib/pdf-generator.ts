import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface PDFOptions {
  filename?: string;
  format?: "a4" | "letter";
  orientation?: "portrait" | "landscape";
  quality?: "low" | "medium" | "high";
}

export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    // PDF 생성을 위한 임시 스타일 적용
    const originalClasses = element.className;
    element.classList.add("pdf-export");
    
    // 스크롤 위치를 맨 위로 이동
    element.scrollTop = 0;
    
    // SVG 요소들이 제대로 렌더링되도록 대기
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 차트와 이미지가 로드될 때까지 대기
    const charts = element.querySelectorAll('svg, canvas, [class*="chart"]');
    if (charts.length > 0) {
      console.log(`차트 요소 ${charts.length}개 발견, 추가 대기...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // HTML을 캔버스로 변환
    const canvas = await html2canvas(element, {
      scale: options.quality === 'high' ? 3 : options.quality === 'medium' ? 2 : 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      foreignObjectRendering: false,
      removeContainer: true,
      imageTimeout: 20000,
      onclone: (clonedDoc) => {
        // 클론된 문서에서 PDF 전용 스타일 적용
        const clonedElement = clonedDoc.querySelector(`[class*="${element.className.split(' ')[0]}"]`) as HTMLElement;
        if (clonedElement) {
          clonedElement.classList.add('pdf-export');
        }
        
        // SVG 요소들의 스타일 조정
        const svgElements = clonedDoc.querySelectorAll('svg');
        svgElements.forEach(svg => {
          svg.style.backgroundColor = '#ffffff';
          svg.style.color = '#000000';
        });
        
        // 차트 컨테이너들의 스타일 조정
        const chartContainers = clonedDoc.querySelectorAll('[class*="chart"], [class*="Chart"]');
        chartContainers.forEach(container => {
          if (container instanceof HTMLElement) {
            container.style.backgroundColor = '#ffffff';
            container.style.color = '#000000';
          }
        });
      }
    });

    // 원래 클래스 복원
    element.classList.remove('pdf-export');

    // 캔버스를 이미지로 변환
    const imgData = canvas.toDataURL('image/png', 1.0);

    // PDF 생성
    const { format = 'a4', orientation = 'portrait' } = options;
    const pdf = new jsPDF({
      format,
      orientation,
      unit: 'mm',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 이미지가 페이지보다 클 경우 여러 페이지로 분할
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
    pageCount++;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      pageCount++;
    }

    // PDF 다운로드
    const filename = options.filename || `reportly-report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);

    console.log(`PDF 생성 완료: ${pageCount}페이지, ${filename}`);

  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    
    // 원래 클래스 복원 (에러 발생 시에도)
    element.classList.remove('pdf-export');
    
    throw new Error('PDF 생성에 실패했습니다. 다시 시도해주세요.');
  }
};

// 특정 요소만 PDF로 변환하는 함수
export const generateElementPDF = async (
  selector: string,
  options: PDFOptions = {}
): Promise<void> => {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error('지정된 요소를 찾을 수 없습니다.');
  }
  
  await generatePDF(element, options);
};

// 전체 페이지를 PDF로 변환하는 함수
export const generatePagePDF = async (
  options: PDFOptions = {}
): Promise<void> => {
  const element = document.body;
  await generatePDF(element, options);
};

// 메인 콘텐츠만 PDF로 변환하는 함수 (결과지 페이지용)
export const generateResultsPDF = async (
  options: PDFOptions = {}
): Promise<void> => {
  try {
    // 메인 콘텐츠 영역 찾기
    const mainContent = document.querySelector('main');
    if (mainContent) {
      await generatePDF(mainContent as HTMLElement, {
        filename: `reportly-results-${new Date().toISOString().split('T')[0]}.pdf`,
        format: 'a4',
        orientation: 'portrait',
        quality: 'high',
        ...options
      });
    } else {
      // 메인 콘텐츠를 찾을 수 없는 경우 전체 페이지 변환
      await generatePagePDF({
        filename: `reportly-results-${new Date().toISOString().split('T')[0]}.pdf`,
        format: 'a4',
        orientation: 'portrait',
        quality: 'high',
        ...options
      });
    }
  } catch (error) {
    console.error('결과지 PDF 생성 실패:', error);
    throw error;
  }
};
