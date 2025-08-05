## main 화면

### 1️⃣ 브랜드 API

### **GET /reportly-api/companies**

- **설명**
  - 메인 페이지에서 브랜드명을 기입하는 데 사용
  - 메인 페이지에서 `selectBox` 형태로 브랜드 목록을 조회할 때 사용
- **요청값**
  ```

  GET /reportly-api/companies
  ```
- **응답**
  - **200 OK**
    ```json

    [
      {
        "companyNo": "101",
        "companyName": "스타벅스"
      },
      {
        "companyNo": "102",
        "companyName": "이디야커피"
      }, ...
    ]

    ```
  - **400 Bad Request**
    ```json
    {
      "error": "브랜드 목록을 불러올 수 없습니다."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "예상치 못한 서버 에러입니다."
    }
    ```

---

### 2️⃣ 업종 API

### **GET /reportly-api/industries**

- **설명**
  - 메인 페이지의 업종 정보 조회
  - 메인 페이지에서 `selectBox` 형태로 업종 목록을 불러올 때 사용
- **요청값**
  ```

  GET /reportly-api/industries
  ```
- **응답**
  - **200 OK**
    ```json
    [
      {
        "industryNo": "1",
        "industryName": "외식"
      },
      {
        "industryNo": "2",
        "industryName": "프랜차이즈"
      }
    ]
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "업종 목록을 불러올 수 없습니다."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "예상치 못한 서버 에러입니다."
    }
    ```

## 3. 분석결과 API

### **POST /reportly-api/analysis-results**

- **설명**
  - 요청한 브랜드명, 경쟁사명, 업종명을 기반으로 API 질의 또는 캐싱된 응답을 활용해 분석결과 데이터를 저장
  - 분석 결과 저장 후 식별자(`analysisResultNo`)를 반환
- 개발 process
  - 요청 왔을 때 companyNo, industryNo, date 를 활용해서 AnalysisResult.companyNo, AnalysisResult.industryNo 에 값이 이미 있는 법인은 아무 행동을 하지 않고 break하고 그 외에 값이 없는 법인이면 getResult()라는 비어있는 메서드를 호출한다.
    - ex) (101, 10), (102, 10), (103, 10), (104, 10)
  - 모두 있다면 getResult()를 한번도 호출하지 않고 201을 반환한다.
- **사용처 예시**
  - 'AI 분석 시각' 기능에서 분석 요청 시 데이터 삽입
- **요청값**
  ```
  POST /reportly-api/analysis-results
  Content-Type: application/json

  {
    "targetCompanyNo": "101", /* 분석 대상 브랜드 번호 */
    "industryNo": "10", /*업종 번호 */
    "competitorCompanyNoList": ["102", "103", "104"] /* 경쟁사 브랜드 번호 목록*/
  }
  ```
- **응답**
  - **201 Created**
    ```json
    {
      "analysisResultNo": "1001"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "요청 값이 올바르지 않습니다."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "예상치 못한 서버 에러입니다."
    }
    ```
