# 🎨 Mind Palette - 컬러 일기

**색채를 통해 나를 이해하는 감정 리플렉션 도구**

Mind Palette는 색상과 감정을 연결하여 매일의 감정을 기록하고 시각화하는 창의적인 감정 트래킹 앱입니다. 그라디언트 컬러 피커를 통해 원하는 어떤 색이든 정밀하게 선택하여 미묘한 감정까지 표현하고, 시간이 지나면서 변화하는 감정 패턴을 발견할 수 있습니다.

## 🎯 서비스 목적

### 핵심 목표

**"색채를 통해 나를 이해하는 감정 리플렉션 도구"**

- **Color × Emotion × Diary × Visualization**의 융합
- 색상 선택을 통한 직관적인 감정 표현
- 시간에 따른 감정 패턴의 시각적 분석
- 개인 맞춤형 감정 팔레트 생성 및 공유

### 해결하고자 하는 문제

- 단순 텍스트로는 표현하기 어려운 복잡한 감정의 기록
- 감정의 변화 패턴을 체계적으로 파악하기 어려움
- 감정 기록의 지속성 부족
- 자신의 감정 상태를 시각적으로 인식하고 공유할 수 있는 도구 부족

## ✨ 주요 기능

### 🎨 컬러 선택 및 감정 기록

- **그라디언트 컬러 피커**: 원하는 어떤 색이든 무한대로 정밀하게 선택 가능 (필수)
- **미묘한 감정 표현**: 제한된 색상에서 벗어나 세밀한 감정의 뉘앙스까지 표현
- **회피 컬러 선택**: 오늘 피하고 싶은 색상도 그라디언트 피커로 선택 (선택)
- **감정 선택**: 12가지 감정 중 선택 + 동적 강도 조절 (1-5)
- **에피소드 기록**: 자유로운 텍스트로 오늘의 이야기 기록
- **날씨 & 느낌**: 날씨와 날씨에 대한 감정 기록

### 🧭 Plan B(Figma) 기반 내비게이션 UI

- **홈(HomeScreen)**: 오늘의 감정 기록 진입, 최근 기록 요약
- **일기 작성(DiaryWriteScreen)**: 색상/감정/날씨를 단계별로 기록
- **감정 보기(EmotionViewScreen)**: 기록 목록과 요약 뷰
- **하단 내비게이션(BottomNavigation)**: 홈/일기/감정 간 탭 이동
- 기본 앱 진입 시 Plan B UI가 활성화됨(`ColorDiaryAppFigma`)

### ✍️ 다이어리 작성(Plan B)

- **그라디언트 컬러 피커(1/2)**: 무한 색상 선택이 가능한 직관적인 색상·톤 선택
  - 수평 방향: 색상(Hue) 그라디언트 (빨강→노랑→초록→청록→파랑→보라→빨강)
  - 수직 방향: 명도(Value) 그라디언트 (상단 밝음 → 하단 어둠)
  - 어떤 미묘한 색상이든 정밀하게 선택하여 감정의 뉘앙스까지 표현 가능
- **동적 강도 슬라이더(2/2)**: 선택한 색조에 맞춰 자동으로 조정되는 강도 조절
- 단계별 입력 흐름(색상 → 감정/강도 → 메모/날씨/시간대)

### 📅 캘린더 뷰

- **월별 캘린더**: 날짜별 색상 도트로 감정 시각화
- **다중 일기 표시**: 하루 최대 4개의 일기 작성 가능
- **상세 보기**: 날짜 클릭 시 해당 날짜의 모든 일기 확인
- **색상 도트**: 여러 일기가 있는 날은 컬러 그라데이션으로 표시

### 📊 감정 팔레트 분석

- **기간별 분석**: 1주, 1개월, 3개월 단위 감정 분석
- **상위 색상 팔레트**: 가장 자주 선택한 색상 TOP 5
- **감정 분포**: 가장 많이 느낀 감정 및 강도 분석
- **AI 인사이트**: 데이터 기반 감정 패턴 분석 결과 제공
- **데이터 내보내기**: CSV 파일로 전체 데이터 백업

### 😊 Emotion 화면(Plan B)

- **월 선택자 + 3개 요약 카드**: 핵심 지표를 한눈에
- **섹션 구성**: 자주 느낀 감정 점(dot), 시간대, 날씨 분포
- **세부 분포/리스트**: 감정/색/일자별 정렬과 스크롤 폴리시 적용
- **카드 간격/그림자 통일**: 일관된 가독성 및 시각적 위계

### 📸 공유 이미지 생성

- **공유 미리보기 모달**: 캘린더와 감정 정보를 포함한 미리보기 제공
- **이미지 저장 기능**: html2canvas를 활용한 고품질 이미지 생성 및 저장
- **파스텔 그라디언트 배경**: SNS 공유에 최적화된 시각적 디자인
- **감정 통계 포함**: 총 기록 수, 주요 감정, 색상 분포 등 통계 정보 표시

## 🚀 기술 스택

### Frontend

- **React 18**: 모던 UI 프레임워크
- **Vite**: 빠른 개발 환경 및 빌드 도구
- **Lucide React**: 아이콘 라이브러리
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **html2canvas**: 이미지 캡처 및 저장 기능

추가사항:

- **Plan B(Figma) UI 컴포넌트**: `HomeScreen`, `DiaryWriteScreen`, `EmotionViewScreen`, `BottomNavigation`
- **입력 위젯**: `GradientColorPicker` (무한 색상 선택)
- **공유 기능**: `SharePreviewModal` (html2canvas 기반 이미지 생성)

### 데이터 관리

- **LocalStorage**: 브라우저 로컬 저장소를 활용한 데이터 저장
- **StorageManager**: 데이터 저장/조회 로직 관리
- **EmotionEntry**: 구조화된 감정 데이터 모델

### 개발 도구

- **Playwright**: E2E 테스트 자동화
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Git/GitHub**: 버전 관리 및 협업

## 📅 프로젝트 정보

### 개발 기간

- **MVP 개발**: 2025년 10월 (1주 집중 개발)
- **방식**: 애자일 스프린트 개발
- **IMVP 목표**: 핵심 기능 완성 및 사용자 테스트

### 팀 구성

| 역할                 | 이름   | 담당 영역                        |
| -------------------- | ------ | -------------------------------- |
| 📋 PM                | 김하나 | 프로젝트 관리, 기획, 문서화      |
| 🎨 UX/UI 디자이너    | 권은영 | 사용자 인터페이스, 디자인 시스템 |
| 💻 프론트엔드 개발자 | 황희정 | React 컴포넌트, 상태관리         |
| 🤖 AI·데이터 전문가  | 김가령 | AI 모델 통합, 데이터 처리        |
| 🎤 발표 담당         | 박연선 | 발표자료 제작, 데모 준비         |

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

# 개발 서버 실행 (포트 3000)
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 앱을 사용할 수 있습니다.

> 포트가 사용 중이면 Vite가 자동으로 `3001`, `3002` 등으로 변경합니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 테스트 실행

```bash
# Playwright 테스트 실행
npm test

# UI 모드로 테스트 실행
npm run test:ui

# 테스트 보고서 확인
npx playwright show-report
```

## 📁 프로젝트 구조

```
Mind-Palette/
├── src/
│   ├── components/                  # React 컴포넌트
│   │   ├── ColorDiaryApp.jsx              # 기존 메인 앱(캘린더/분석/공유)
│   │   ├── ColorDiaryAppFigma.jsx         # Plan B(Figma) UI 엔트리
│   │   ├── HomeScreen.jsx                 # Plan B 홈 화면
│   │   ├── DiaryWriteScreen.jsx           # Plan B 일기 작성 화면
│   │   ├── EmotionViewScreen.jsx          # Plan B 감정 보기 화면
│   │   ├── BottomNavigation.jsx           # Plan B 하단 내비게이션
│   │   ├── GradientColorPicker.jsx        # Plan B 그라디언트 컬러 피커
│   │   ├── SharePreviewModal.jsx          # 공유 미리보기 모달 (html2canvas)
│   │   ├── EmotionPaletteAnalysis.jsx     # 감정 분석 컴포넌트
│   │   └── ShareImageGenerator.jsx        # 공유 이미지 생성 컴포넌트
│   ├── data/                # 데이터 모델 및 관리
│   │   ├── dataModels.js    # EmotionEntry 데이터 모델
│   │   └── storageManager.js # LocalStorage 관리
│   ├── services/            # API 서비스
│   │   └── api.js           # 백엔드 API 연동 (향후 확장)
│   ├── App.jsx              # 메인 App 컴포넌트
│   ├── main.jsx             # 앱 진입점
│   └── index.css            # 전역 스타일
├── presentation/            # 발표 관련 파일
├── tests/                   # Playwright 테스트
├── vite.config.js           # Vite 설정
├── package.json             # 프로젝트 의존성
├── PLAN_B_IMPLEMENTATION.md # Plan B 구현 메모
├── .playwright-mcp/         # 스크린샷/프로토타입 참고 이미지
└── README.md                # 프로젝트 문서
```

## 🎯 사용 방법

### Plan B(Figma) UI와 기존 UI 전환 방법

기본값은 Plan B(Figma) UI입니다. `src/App.jsx`에서 다음과 같이 전환할 수 있습니다.

```javascript
// src/App.jsx
// import ColorDiaryApp from './components/ColorDiaryApp' // 기존 UI (캘린더/분석/공유)
import ColorDiaryAppFigma from "./components/ColorDiaryAppFigma"; // Plan B (Figma)

function App() {
  return (
    <div>
      <ColorDiaryAppFigma />
      {/* 기존 UI 사용 시: <ColorDiaryApp /> */}
    </div>
  );
}
export default App;
```

### 일기 작성하기 (Plan B UI)

1. 하단 탭에서 **일기**로 이동
2. **1단계**: 그라디언트 컬러 피커에서 원하는 색상 선택
   - 끌리는 색상과 피하고 싶은 색상 각각 선택
   - 수평으로 색상 선택, 수직으로 명도 조절
   - 선택한 색상은 HEX 코드와 함께 확인 가능
3. **2단계**: 감정 선택 및 강도 조절
   - 12가지 감정 중 선택 또는 커스텀 입력
   - 선택한 색상에 맞춰 자동으로 조정되는 동적 강도 슬라이더
4. **3단계**: 메모, 날씨, 시간대 등 추가 정보 입력
5. 저장을 눌러 기록 완료

> 기존 캘린더/분석/공유 플로우는 `ColorDiaryApp`에서 동일하게 제공됩니다.

### 일기 보기

- **캘린더 뷰**: 상단의 "일기 보기" 버튼 클릭
- **날짜별 상세**: 캘린더에서 색칠된 날짜 클릭하여 해당 날의 모든 일기 확인
- **하루 최대 4개**: 같은 날에 최대 4개의 일기 작성 가능

### 감정 분석

- **감정 분석**: 상단의 "감정 분석" 버튼 클릭
- **기간 선택**: 1주, 1개월, 3개월 중 선택
- **인사이트 확인**: AI가 분석한 감정 패턴과 인사이트 확인
- **데이터 내보내기**: CSV 파일로 전체 데이터 다운로드

### 공유하기

- **공유 미리보기**: Emotion 화면에서 공유 버튼 클릭
- **미리보기 확인**: 캘린더와 감정 통계가 포함된 미리보기 모달 표시
- **이미지 저장**: html2canvas를 통해 고품질 이미지로 변환하여 저장
- **SNS 공유**: 저장된 이미지를 다운로드하여 SNS에 공유

### 스크린샷

- 참고 이미지 경로(저장소 내):
  - `.playwright-mcp/figma-prototype.png`
  - `.playwright-mcp/figma-diary-write.png`
  - `.playwright-mcp/emotion-view-screen.png`
  - `.playwright-mcp/figma-emotion-view.png`
  - `.playwright-mcp/figma-emotion-view-current.png`
  - `.playwright-mcp/figma-emotion-view-detailed.png`

이미지는 Plan B 레이아웃 및 스타일 기준의 참조 화면입니다.

## 🌈 컬러 피커 시스템

### 무한 색상 선택

앱은 그라디언트 컬러 피커를 통해 무한대의 색상을 선택할 수 있도록 제공합니다:

- **색상(Hue) 선택**: 수평 방향의 무지개 그라디언트에서 원하는 색상 선택
  - 빨강 → 노랑 → 초록 → 청록 → 파랑 → 보라 → 빨강 (순환)
- **명도(Value) 선택**: 수직 방향의 밝기 조절
  - 상단: 밝고 부드러운 톤
  - 하단: 어둡고 깊은 톤
- **정밀한 선택**: 픽셀 단위로 정확하게 원하는 색상 선택 가능
- **미묘한 감정 표현**: 제한된 색상 팔레트가 아닌 자유로운 색상 선택으로 더 세밀한 감정의 뉘앙스를 표현

각 선택된 색상은 감정을 표현하는 매개체로 사용되며, 사용자의 선택에 따라 개인별 고유한 감정 팔레트가 형성됩니다.

## 📊 데이터 구조

### EmotionEntry 모델

```javascript
{
  id: string,              // 고유 ID
  color: string,            // 선택한 색상 (HEX)
  emotion: string,          // 감정 (기쁨, 슬픔 등)
  intensity: number,        // 감정 강도 (1-5)
  episode: string,         // 에피소드 텍스트
  timeOfDay: string,       // 시간대
  weather: string,         // 날씨
  weatherFeeling: string,  // 날씨에 대한 느낌
  date: string,            // 날짜 (YYYY-MM-DD)
  timestamp: string,       // 타임스탬프
  aiAnalysis: object      // AI 분석 데이터 (향후 확장)
}
```

## 🔒 개인정보 보호

- **로컬 저장**: 모든 데이터는 브라우저 LocalStorage에 저장
- **서버 전송 없음**: 사용자의 데이터는 서버로 전송되지 않음
- **개인정보 미수집**: 이메일, 이름 등 개인정보를 수집하지 않음
- **데이터 소유**: 사용자가 자신의 데이터를 완전히 소유

## 🚧 향후 계획

### 단기 계획 (1-3개월)

- [ ] **PWA 지원**: 오프라인 사용 및 앱 설치 기능
- [ ] **백업/복원**: 클라우드 기반 데이터 백업 기능
- [ ] **다크 모드**: 다크 테마 지원
- [ ] **다국어 지원**: 영어 등 추가 언어 지원
- [ ] **알림 기능**: 일기 작성 리마인드 알림

### 중기 계획 (3-6개월)

- [ ] **AI 분석 고도화**: 자연어 처리 기반 감정 분석 강화
- [ ] **소셜 기능**: 일기 공유 및 친구 기능 (선택)
- [ ] **모바일 앱**: iOS/Android 네이티브 앱 개발
- [ ] **데이터 통계**: 고급 통계 및 인사이트 제공
- [ ] **테마 커스터마이징**: 사용자별 색상 팔레트 커스터마이징

### 장기 계획 (6-12개월)

- [ ] **AI 추천**: 감정 상태에 따른 색상 추천 기능
- [ ] **음성 인식**: 음성으로 일기 작성 기능
- [ ] **그룹 분석**: 그룹별 감정 패턴 분석
- [ ] **기업용 버전**: 팀 단위 감정 관리 솔루션

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 특정 브라우저에서 테스트
npx playwright test --project=chromium

# 테스트 보고서 확인
npx playwright show-report
```

## 📝 변경 이력(요약)

- feat: Plan B(Figma) UI 도입(홈/일기/감정 + 하단 내비게이션)
- feat(diary): 그라디언트 컬러 피커 도입 - 33색 팔레트에서 무한 색상 선택으로 업그레이드
- feat(diary): 동적 강도 슬라이더 추가 - 선택한 색조에 맞춰 자동 조정
- feat(emotion): 월 선택자/요약 카드/분포 섹션 추가 및 스크롤 폴리시
- feat(share): 공유 미리보기 모달 추가 (html2canvas 기반 이미지 저장 기능)
- style(emotion): 카드 간격·그림자 통일, 미세 색상 조정
- style(share): 파스텔 그라디언트 배경 적용 (SNS 공유 최적화)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성하세요

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 GitHub Issues를 통해 문의해주세요.

---

**Mind Palette** - 색채로 기록하는 나의 감정 여정 🎨✨
