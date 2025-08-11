import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

// 안전한 대기 함수
const safeWait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  let browser: any = null;

  try {
    const { url, filename = "reportly-report.pdf" } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 });
    }

    // URL 유효성 검사
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "유효하지 않은 URL입니다." },
        { status: 400 }
      );
    }

    // Puppeteer 브라우저 실행
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--single-process",
        "--disable-extensions",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });

    const page = await browser.newPage();

    try {
      // 페이지 설정 - 더 넓은 뷰포트로 설정
      await page.setViewport({ width: 1600, height: 1200 });
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // 요청 인터셉트하여 불필요한 리소스 차단
      await page.setRequestInterception(true);
      page.on("request", (req: any) => {
        const resourceType = req.resourceType();
        if (["image", "stylesheet", "font"].includes(resourceType)) {
          req.continue();
        } else if (resourceType === "script") {
          // 외부 스크립트만 차단
          if (
            req.url().startsWith("http") &&
            !req.url().includes("localhost")
          ) {
            req.abort();
          } else {
            req.continue();
          }
        } else {
          req.continue();
        }
      });

      // 페이지 로드
      try {
        await page.goto(url, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });
      } catch (navigationError) {
        // 기본 대기 후 계속 진행
        await safeWait(5000);
      }

      // 초기 렌더링 대기
      await safeWait(3000);

      // 스크롤을 맨 위로 이동
      try {
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
      } catch (scrollError) {
        // 스크롤 실패 시 무시하고 계속 진행
      }

      // 페이지 크기 동적 조정
      try {
        // 실제 콘텐츠 크기 확인
        const contentSize = await page.evaluate(() => {
          const body = document.body;
          const html = document.documentElement;

          // 스크롤 가능한 전체 크기 계산
          const scrollWidth = Math.max(
            body.scrollWidth,
            body.offsetWidth,
            html.clientWidth,
            html.scrollWidth,
            html.offsetWidth
          );

          const scrollHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
          );

          return { width: scrollWidth, height: scrollHeight };
        });

        if (contentSize.width && contentSize.height) {
          // 여백을 포함한 새로운 뷰포트 크기 계산
          const newWidth = Math.max(1600, contentSize.width + 200);
          const newHeight = Math.max(1200, contentSize.height + 200);

          await page.setViewport({ width: newWidth, height: newHeight });

          // 크기 조정 후 잠시 대기
          await safeWait(1000);
        }
      } catch (resizeError) {
        // 크기 조정 실패 시 기본 크기로 계속 진행
      }

      // 차트 요소들이 완전히 렌더링될 때까지 대기
      try {
        await page.waitForFunction(
          () => {
            // 차트 요소들이 존재하는지 확인
            const charts = document.querySelectorAll(
              '[data-testid*="chart"], .recharts-wrapper'
            );
            if (charts.length === 0) return true; // 차트가 없으면 바로 완료

            // 차트가 모두 렌더링되었는지 확인
            return Array.from(charts).every((chart) => {
              const rect = chart.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            });
          },
          { timeout: 15000 }
        );
      } catch (timeoutError) {
        // 차트 렌더링 타임아웃 시 계속 진행
      }

      // 동적 콘텐츠 로딩 확인
      try {
        await page.waitForFunction(
          () => {
            // 로딩 스피너가 사라졌는지 확인
            const loadingSpinners = document.querySelectorAll(
              '[class*="loading"], [class*="spinner"]'
            );
            if (loadingSpinners.length > 0) {
              return Array.from(loadingSpinners).every((spinner) => {
                const style = window.getComputedStyle(spinner);
                return (
                  style.display === "none" || style.visibility === "hidden"
                );
              });
            }
            return true;
          },
          { timeout: 10000 }
        );
      } catch (timeoutError) {
        // 로딩 확인 타임아웃 시 계속 진행
      }

      // 최종 안정화 시간
      await safeWait(2000);

      // PDF 생성 (재시도 로직 포함)
      let pdfBuffer: Buffer | null = null;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries && !pdfBuffer) {
        try {
          pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
              top: "5mm",
              right: "5mm",
              bottom: "5mm",
              left: "5mm",
            },
            preferCSSPageSize: false, // 페이지 크기 자동 조정 비활성화
            displayHeaderFooter: false,
            scale: 0.8, // 스케일 조정으로 전체 화면 포함
          });
        } catch (pdfError) {
          retryCount++;

          if (retryCount <= maxRetries) {
            await safeWait(2000);
          } else {
            throw new Error(
              `PDF 생성에 실패했습니다. ${maxRetries + 1}번 시도했지만 성공하지 못했습니다.`
            );
          }
        }
      }

      // PDF 버퍼 유효성 검사
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new Error("PDF 생성에 실패했습니다. 빈 버퍼가 생성되었습니다.");
      }

      // PDF 버퍼 크기 확인 (최소 1KB 이상)
      if (pdfBuffer.length < 1024) {
        throw new Error("PDF 생성에 실패했습니다. 파일이 너무 작습니다.");
      }

      // PDF 버퍼를 Uint8Array로 변환하여 ByteString 오류 방지
      let pdfArray: Uint8Array;
      try {
        pdfArray = new Uint8Array(pdfBuffer);
      } catch (conversionError) {
        throw new Error("PDF 데이터 변환에 실패했습니다.");
      }

      // 안전한 헤더 생성
      const safeFilename = filename.replace(/[^\x00-\x7F]/g, ""); // ASCII 문자만 허용

      const headers = new Headers();
      headers.set("Content-Type", "application/pdf");
      headers.set(
        "Content-Disposition",
        `attachment; filename="${safeFilename}"`
      );
      headers.set("Content-Length", pdfArray.length.toString());

      return new Response(pdfArray, { headers });
    } finally {
      await page.close();
    }
  } catch (error) {
    let errorMessage = "PDF 생성에 실패했습니다.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // 오류 응답은 항상 JSON 형식으로 반환
    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    // 브라우저 정리
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        // 브라우저 종료 오류는 무시
      }
    }
  }
}
