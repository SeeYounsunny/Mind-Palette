# 🎨 Mind Palette

**AI와 함께하는 창의적 사고 정리 플랫폼**

Mind Palette는 AI 에이전트와 인간의 창의적 협업을 통해 아이디어를 체계적으로 정리하고 관리할 수 있는 직관적인 플랫폼입니다.

## ✨ 주요 기능

- 🤖 **AI 에이전트 협업**: Cursor AI 에이전트와 실시간 협업
- 🎯 **직관적 인터페이스**: 사용자 친화적인 시각적 디자인
- 🔄 **자동 분류**: AI 기반 아이디어 자동 분류 및 태깅
- 👥 **팀 협업**: 실시간 팀 협업 기능
- 📱 **반응형 디자인**: 모바일 우선 반응형 웹 디자인

## 🚀 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript
- **AI Integration**: Cursor AI 에이전트
- **Testing**: Playwright 자동화 테스트
- **Collaboration**: Git 기반 협업 워크플로우
- **Development**: Node.js, npm

## 📅 프로젝트 정보

- **개발 기간**: 2025년 10월 25일 ~ 10월 31일 (7일간)
- **팀 구성**: 5명의 전문가 (PM, 디자이너, 프론트엔드, AI/데이터, 발표)
- **목표**: MVP 완성 + 발표자료 준비

## 👥 팀원

| 역할 | 이름 | 담당 영역 |
|------|------|-----------|
| 📋 PM | 김하나 | 프로젝트 관리, 기획, 문서화 |
| 🎨 UX/UI 디자이너 | 권은영 | 사용자 인터페이스, 디자인 시스템 |
| 💻 프론트엔드 개발자 | 황희정 | React 컴포넌트, 상태관리 |
| 🤖 AI·데이터 전문가 | 김가령 | AI 모델 통합, 데이터 처리 |
| 🎤 발표 담당 | 박연선 | 발표자료 제작, 데모 준비 |

## 🛠️ 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 8.0.0 이상
- Git

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/SeeYounsunny/Mind-Palette.git

# 프로젝트 디렉토리로 이동
cd Mind-Palette

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 테스트 실행

```bash
# Playwright 테스트 실행
npm test

# UI 모드로 테스트 실행
npm run test:ui
```

## 📁 프로젝트 구조

```
Mind-Palette/
├── presentation/          # 발표 관련 파일
│   ├── presentation_input.txt
│   └── claude_code_prompt.txt
├── tests/                 # Playwright 테스트
│   └── example.spec.ts
├── .vscode/              # VS Code 설정
├── .gitignore
├── package.json
├── playwright.config.ts
├── index.html
└── README.md
```

## 🔄 협업 워크플로우

### 브랜치 전략
- `main`: 안정적인 메인 브랜치
- `feature/팀원이름-역할`: 각 팀원별 기능 브랜치

### Pull Request 프로세스
1. 각자 브랜치에서 작업
2. Pull Request 생성
3. 코드 리뷰 및 승인
4. main 브랜치에 병합

## 🎯 사용법

### AI 에이전트와 협업
1. Cursor에서 AI 에이전트 활성화
2. 역할별 프롬프트 설정
3. 실시간 협업으로 개발 진행

### 아이디어 관리
1. 창의적 아이디어 입력
2. AI가 자동으로 분석 및 분류
3. 시각적으로 정리된 결과 확인
4. 팀원들과 실시간 공유

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 특정 브라우저에서 테스트
npx playwright test --project=chromium

# 테스트 보고서 확인
npx playwright show-report
```

## 📊 성과

- ✅ **7일간 집중 개발**로 MVP 완성
- ✅ **AI 에이전트 기반 협업** 모델 구현
- ✅ **자동화된 테스트** 환경 구축
- ✅ **Git 기반 체계적 협업** 프로세스

## 🚀 향후 계획

- [ ] 사용자 피드백 기반 기능 개선
- [ ] AI 모델 고도화
- [ ] 플랫폼 확장 및 상용화
- [ ] 모바일 앱 개발

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 📞 연락처

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

**Mind Palette** - 창의적 사고의 새로운 패러다임 🎨✨
