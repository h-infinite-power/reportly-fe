🧭 Next.js 코드 컨벤션 가이드
이 문서는 팀 내 일관된 코드 스타일을 유지하고 유지보수성을 높이기 위한 Next.js 프로젝트의 개발 컨벤션입니다. src/ 디렉토리는 사용하지 않는 구조를 기준으로 작성되었습니다.

🗂️ 1. 디렉토리 구조
bash
복사
편집
.
├── app/ # App Router 기준 페이지 디렉토리
│ └── page.tsx
├── components/ # 공통 UI 컴포넌트
├── features/ # 도메인 기반 폴더 (예: auth, post)
│ └── [도메인명]/ # 각 도메인의 기능 및 로직 포함
│ ├── components/ # 해당 도메인에 특화된 컴포넌트
│ ├── hooks/ # 도메인 전용 커스텀 훅
│ └── service.ts # API 또는 비즈니스 로직
├── hooks/ # 공용 커스텀 훅
├── lib/ # API client, 유틸 함수 등
├── types/ # 전역 타입 정의
├── constants/ # 상수 모음
├── config/ # 환경 설정, 설정값 등
└── styles/ # 전역 스타일 파일 (예: globals.css, tailwind.css)
💅 2. 코드 스타일
문법: ES2020+ 기반

언어: TypeScript 필수 사용

탭 너비: 2 spaces

따옴표: 작은따옴표 (')

import 순서:

외부 라이브러리

절대 경로 import (예: lib/, features/)

상대 경로 import (예: ../, ./)

파일명: kebab-case 사용 (예: user-profile.tsx)

컴포넌트명: PascalCase (예: UserProfile)

함수/변수명: camelCase

📦 3. 컴포넌트 작성
컴포넌트 위치: components/ 또는 도메인 내 features/[name]/components/

파일 구조:

파일 하나에 하나의 컴포넌트만 작성

Props는 interface로 별도 선언

예시:

tsx
복사
편집
// components/button.tsx
interface ButtonProps {
label: string
onClick: () => void
}

export default function Button({ label, onClick }: ButtonProps) {
return <button onClick={onClick}>{label}</button>
}
🌐 4. 페이지 구성 (App Router 기준)
app/ 디렉토리 내에 페이지 구성

page.tsx, layout.tsx, loading.tsx, error.tsx 등은 Next.js 규칙 준수

라우팅 구조는 폴더명 기준으로 명확하게 정의

bash
복사
편집
app/
├── page.tsx # 홈 페이지
├── about/
│ └── page.tsx # /about
├── post/
│ ├── [id]/
│ │ └── page.tsx # /post/1
│ └── new/
│ └── page.tsx # /post/new
🧪 5. 테스트
테스트 프레임워크: Jest 또는 Vitest (선택)

컴포넌트 테스트는 **tests**/ 또는 .test.tsx 파일에 작성

테스트 파일은 해당 파일과 같은 위치 또는 tests/ 폴더 내에 위치

🛠️ 6. 기타 설정
환경 변수: .env.local, process.env.NEXT*PUBLIC* prefix 사용

절대 경로 설정: tsconfig.json의 paths 옵션 사용 권장

Lint & Format:

ESLint: next lint

Prettier: 커스텀 .prettierrc 설정 사용

Git 커밋 메시지: Conventional Commits 규칙 권장 (예: feat:, fix:, refactor:)

📎 7. 추천 설정 파일
.prettierrc
json
복사
편집
{
"singleQuote": true,
"semi": false,
"tabWidth": 2,
"printWidth": 100,
"trailingComma": "es5"
}
.eslintrc.json
json
복사
편집
{
"extends": ["next/core-web-vitals", "eslint:recommended", "plugin:@typescript-eslint/recommended"],
"plugins": ["@typescript-eslint"],
"rules": {
"semi": ["error", "never"],
"quotes": ["error", "single"]
}
}
