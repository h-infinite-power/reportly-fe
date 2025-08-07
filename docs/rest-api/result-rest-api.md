## 결과지 조회

## 분석결과 API

### **GET /reportly-api/jobs/{jobNo}/total-score-list**

- **설명**
  - 경쟁사와 우리 회사의 절대 점수를 비교한 데이터 반환
    - 종합 점수
    - 경쟁력 순위
  - **사용처 예시**
    - 결과지 화면 최상단에서 종합 점수, 경쟁력 순위
- **요청값**
  - 없음
- **응답**
  - **200 OK**
    ```json
    {
      "targetRank": 1 /* 타겟회사 순위 */,
      "targetCompanyNo": "101" /* 타겟회사 기준 회사 번호*/,
      "targetTotalScore": 87 /* 타겟회사 총점*/,
      "competitorAvgTotalScore": 76 /* 타겟회사 기준 평균점수 (타겟 회사는 제외), 해당 값을 통해서 업계 평균 대비 백분율 계산*/,
      "totalCompanyCount": 4 /* 경쟁력 순위에서의 총 회사 수 */
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "분석결과를 찾을 수 없습니다."
    }
    ```
- 개발 프로세스
  -

---

### **GET /reportly-api/jobs/{jobNo}/analysis-result-score-statistics**

- **설명**
  - 경쟁사 및 타겟 회사의 카테고리별 평균 점수 통계 데이터 반환
- **사용처 예시**
  - 강점 카테고리
  - 약점 카테고리
  - 경쟁사 비교 그래프
- **요청값**
  - 없음
- **응답**
  - **200 OK**
  ```json

  {
  	"targetCompanyCategoryScoreList" : /* 타겟 회사의 카테고리별 점수 및 전체 평균 점수 -> competitorCategoryAvgScoreList와의 계산을 통해 '강점 카테고리', '약점 카테고리'에 사용 */
  		[
  			  {
  			    "categoryNo": "10",
  			    "categoryName": "브랜딩",
  			    "categoryScore": 92,
  			  },
  			  {
  			    "categoryNo": "11",
  			    "categoryName": "마케팅",
  			    "categoryScore": 88,
  			  } , ...
  		],
  		"competitorCategoryAvgScoreList" : /* 경쟁사들의 카테고리별 평균 점수 -> 경쟁사 비교 그래프 에서 사용 */
  		[
  			  {
  			    "categoryNo": "10",
  			    "categoryName": "브랜딩",
  			    "categoryScore": 92,
  			  },
  			  {
  			    "categoryNo": "11",
  			    "categoryName": "마케팅",
  			    "categoryScore": 88,
  			  }, ...
  		]
  }
  ```
  - **400 Bad Request**
    ```json
    {
      "error": "분석결과 통계를 찾을 수 없습니다."
    }
    ```

---

### **GET /reportly-api/jobs/{jobNo}/analysisResults/info**

- **설명**
  - `GET /reportly-api/analysis-results/{analysisResultNo}/analysis-result-scores` api 를 사용하기 위해 회사명, analysisResultNo 의 목록을 조회해주는 api
  - **사용처 예시**
    - `카테고리별 점수`의 select box
- **응답**

  - **200 OK**

    ```json
    [
      {
        "companyNo": "1",
        "companyName": "삼성전자",
        "analysisResultNo": "2",
        "targetCompanyYn" : "Y" /* 타겟 회사 여부 */
      },
      {
        "companyNo": "1",
        "companyName": "삼성전자",
        "analysisResultNo": "2",
        "targetCompanyYn" : "N" /* 타겟 회사 여부, 경쟁회사는 모두 N */,
      }, ...
    ]
    ```

---

### **GET /reportly-api/analysis-results/{analysisResultNo}/analysis-result-scores**

- **설명**
  - 셀렉트 박스로 선택된 경쟁사의 카테고리별 점수 조회
  - **사용처 예시**
    - `카테고리별 점수` 영역
- **응답**
  - **200 OK**
    ```json

    [
      {
        "categoryNo": "10",
        "categoryName": "브랜딩",
        "companyScore": 92,
      },
      {
        "categoryNo": "11",
        "categoryName": "마케팅",
        "companyScore": 92,
      }, ...
    ]

    ```
  - **400 Bad Request**
    ```json
    {
      "error": "카테고리 점수를 찾을 수 없습니다."
    }
    ```

---

### **GET /reportly-api/analysis-results/{analysisResultId}**

- **설명**
  - 질문/답변 및 AI 인사이트 요약 상세 조회
  - **사용처 예시**
    - AI 인사이트 요약(강점, 약점, 개선제안)
    - `프롬프트 분석` 영역
- **요청값**
  - `analysisResultId`: 분석결과 ID
- **응답**
  - **200 OK**
    ```json

    {
      "strongPoint": "제품 품질과 혁신성이 우월합니다.", /* 강점 */
      "weakPoint": "AS 처리속도, 접근성 향상이 요구됩니다.", /* 약점 */
      "improvements": "브랜드 충성도를 높이는 것을 제안합니다.", /* 개선제안 */
      "qaList": [
        {
    	    [
    			    {
    			    	"questionNo" : "1",
    				    "categoryNo" : "23",
    			      "question": "우리 회사의 강점은 무엇인가요?",
    				    "targetCompanyInfo" : {
    				    		"comnpanyNo": "1",
    							  "companyName": "삼성전자",
    						    "summary": "요약",
    					      "content": "브랜딩 전략이 경쟁사 대비 우수합니다.",
    					      "positiveKeyword" : ["반도체", "1등", "기획"],
    					      "negativeKeyword" : ["최악", "사망", "주가폭락"],
    					      "companyCategoryScore" : 92,
    					   },
    					   "competitorCompanyInfo" :
    					   [
    							   {
    									  "comnpanyNo": "2",
    									  "companyName": "애플",
    				 				    "summary": "요약",
    							      "companyCategoryScore" : 92,
    							   }, ...
    					   ]
    			    }, ...
    	    ]
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "분석결과 상세 정보를 찾을 수 없습니다."
    }
    ```
