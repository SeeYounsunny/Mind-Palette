# Mind Palette - 기능 명세서 (Feature Specification)

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [핵심 사용자 플로우](#핵심-사용자-플로우)
3. [함수 정의](#함수-정의)
4. [모듈별 마일스톤](#모듈별-마일스톤)
5. [기술 요구사항](#기술-요구사항)

---

## 📱 프로젝트 개요

### 비전
Mind Palette는 사용자가 감정을 색상으로 표현하고 기록하는 감정 관리 애플리케이션입니다.

### 목표
- 사용자의 감정을 색상으로 시각화
- 일상의 감정을 캘린더 형태로 추적
- AI 기반 감정 분석 및 인사이트 제공

### 타겟 사용자
- 자신의 감정을 체계적으로 관리하고 싶은 사람
- 감정 패턴을 파악하고 싶은 사람
- 창의적이고 직관적인 방법으로 일기를 쓰고 싶은 사람

---

## 🎯 핵심 사용자 플로우

### 1. 감정 기록 플로우 (Emotion Logging Flow)

```
1. 사용자 앱 실행
   ↓
2. 메인 화면에서 "감정 기록하기" 버튼 클릭
   ↓
3. 색상 팔레트에서 현재 감정을 나타내는 색상 선택
   (추가: 강도 슬라이더 조정)
   ↓
4. "다음" 버튼 클릭
   ↓
5. AI가 선택한 색상 기반으로 감정 후보 목록 제시
   (예: "밝은 파란색" → [평온, 만족, 차분함, 안정감...])
   ↓
6. 사용자가 목록에서 가장 적합한 감정 선택
   ↓
7. 선택사항: 간단한 메모 추가
   ↓
8. "저장" 버튼 클릭하여 감정 데이터 저장
   ↓
9. 저장 완료 피드백 표시 후 캘린더 화면으로 이동
```

### 2. 색상 선택 플로우 (Color Selection Flow)

```
1. 사용자가 색상 팔레트 화면에서 원하는 색상을 클릭
   ↓
2. 선택된 색상이 미리보기로 표시됨
   ↓
3. 색상 강도 슬라이더로 감정의 강도를 조절
   ↓
4. "다음" 버튼으로 감정 선택 화면으로 이동
```

### 3. 캘린더 뷰 플로우 (Calendar View Flow)

```
1. 사용자가 캘린더 화면에 접근
   ↓
2. 월별 캘린더에서 기록된 날짜가 색상으로 표시됨
   ↓
3. 특정 날짜를 클릭하여 해당 날의 감정 기록 상세 보기
   ↓
4. "트렌드 분석" 버튼 클릭
   ↓
5. AI가 제공하는 감정 패턴 인사이트 표시
   (예: "이번 주는 주로 밝은 색상이 많았습니다")
   ↓
6. 통계 및 차트로 감정 패턴 시각화
```

---

## 🔧 함수 정의

### 프론트엔드 모듈

#### 1. ColorPicker Component

**목적**: 사용자가 감정을 나타내는 색상을 선택할 수 있는 UI 컴포넌트

**입력 (Inputs)**:
```typescript
interface ColorPickerProps {
  initialColor?: string; // 초기 선택 색상 (hex 코드)
  onColorChange: (color: string) => void; // 색상 변경 콜백
  intensity?: number; // 색상 강도 (0-100)
  onIntensityChange?: (intensity: number) => void; // 강도 변경 콜백
}
```

**출력 (Outputs)**:
```typescript
interface ColorPickerOutput {
  color: string; // 선택된 색상 (hex 코드)
  intensity: number; // 조정된 강도 (0-100)
  timestamp: Date; // 선택 시각
}
```

**기능**:
- 팔레트에서 색상 선택 (최대 64개 색상)
- 색상 강도 슬라이더로 밝기 조절
- 선택된 색상의 RGB, HSL 값 표시

---

#### 2. EmotionSelector Component

**목적**: 색상 선택 후 AI가 제시한 감정 후보 목록에서 사용자가 감정을 선택하는 컴포넌트

**입력 (Inputs)**:
```typescript
interface EmotionSelectorProps {
  selectedColor: string; // ColorPicker에서 선택된 색상
  intensity: number; // 선택된 강도
  emotionCandidates: EmotionCandidate[]; // AI가 제시한 감정 후보 목록
  onEmotionSelect: (emotion: string) => void; // 감정 선택 콜백
}
```

**출력 (Outputs)**:
```typescript
interface EmotionCandidate {
  emotion: string; // 감정 카테고리 ("평온", "만족", "기쁨" 등)
  description: string; // 감정 설명
  confidence: number; // AI 추천 신뢰도 (0-100)
}
```

**기능**:
- AI가 제시한 감정 후보 목록 표시
- 사용자가 감정 선택
- 선택된 감정의 상세 설명 표시

---

#### 3. EmotionLogger Component

**목적**: 선택된 색상과 감정을 받아 감정 기록을 생성하고 저장하는 컴포넌트

**입력 (Inputs)**:
```typescript
interface EmotionLoggerProps {
  selectedColor: string; // ColorPicker에서 선택된 색상
  intensity: number; // 선택된 강도
  selectedEmotion: string; // EmotionSelector에서 선택된 감정
  onSave: (emotion: EmotionData) => void; // 저장 콜백
}
```

**출력 (Outputs)**:
```typescript
interface EmotionData {
  id: string; // 고유 ID
  color: string; // hex 코드
  intensity: number; // 0-100
  emotion: string; // 사용자가 선택한 감정
  note?: string; // 사용자 메모 (선택사항)
  timestamp: Date; // 기록 시각
}
```

**기능**:
- 선택사항 메모 입력 필드 제공
- 데이터 저장 함수 호출
- 저장 완료 피드백 표시

---

#### 4. CalendarView Component

**목적**: 기록된 감정을 캘린더 형태로 시각화하는 컴포넌트

**입력 (Inputs)**:
```typescript
interface CalendarViewProps {
  emotionRecords: EmotionRecord[]; // 저장된 감정 기록 배열
  currentMonth: Date; // 현재 표시할 월
  onDateClick: (date: Date) => void; // 날짜 클릭 이벤트
  onMonthChange: (month: Date) => void; // 월 변경 이벤트
}

interface EmotionRecord {
  date: Date; // 기록된 날짜
  emotions: EmotionData[]; // 해당 날짜의 감정 기록들
  dominantColor?: string; // 주요 색상 (하루에 여러 기록 시)
}
```

**출력 (Outputs)**:
```typescript
interface CalendarDayData {
  date: Date; // 날짜
  color: string | null; // 표시할 색상 (null인 경우 기록 없음)
  emotionCount: number; // 해당 날짜의 기록 개수
  hasDetail: boolean; // 상세 정보 존재 여부
}
```

**기능**:
- 월별 캘린더 렌더링 (7x5 그리드)
- 기록된 날짜에 색상 점 표시
- 여러 감정 기록 시 혼합 색상 표시
- 월 네비게이션 (이전/다음)
- 날짜 클릭 시 상세 정보 표시

---

#### 5. TrendAnalysis Component

**목적**: 감정 패턴을 분석하고 트렌드를 시각화하는 컴포넌트

**입력 (Inputs)**:
```typescript
interface TrendAnalysisProps {
  emotionRecords: EmotionRecord[]; // 분석할 기록 배열
  dateRange: { start: Date; end: Date }; // 분석 기간
}
```

**출력 (Outputs)**:
```typescript
interface TrendData {
  dominantEmotions: { emotion: string; count: number }[]; // 주요 감정 목록
  colorTrend: string[]; // 기간별 주요 색상 트렌드
  patterns: string[]; // AI가 발견한 패턴 설명
  weeklyAverage: number; // 주간 평균 감정 점수
  monthlyInsight: string; // 월별 인사이트
}
```

**기능**:
- 기간별 감정 통계 계산
- 색상 트렌드 라인 차트 생성
- AI 기반 패턴 발견 및 설명
- 인사이트 카드로 요약 정보 표시

---

### AI 모듈

#### 6. EmotionAnalyzer Service

**목적**: 색상 데이터를 입력받아 감정을 분석하는 AI 서비스

**입력 (Inputs)**:
```typescript
interface EmotionAnalyzerInput {
  color: string; // hex 색상 코드
  intensity: number; // 0-100
  context?: string; // 선택적 메모 텍스트
}
```

**출력 (Outputs)**:
```typescript
interface EmotionAnalyzerOutput {
  candidates: EmotionCandidate[]; // 감정 후보 목록 (최대 8개)
  suggestions?: string[]; // 제안 메모 (옵션)
}

interface EmotionCandidate {
  emotion: string; // 감정 카테고리
  description: string; // 감정 설명
  confidence: number; // AI 추천 신뢰도 (0-100)
}
```

**기능**:
- 색상 → 감정 매핑 (머신러닝 모델 사용)
- 여러 감정 후보 생성 (최대 8개)
- 신뢰도 점수 산출
- 텍스트 컨텍스트 결합 분석 (옵션)

---

#### 7. TrendAnalyzer Service

**목적**: 여러 감정 기록을 분석하여 패턴을 발견하는 AI 서비스

**입력 (Inputs)**:
```typescript
interface TrendAnalyzerInput {
  records: EmotionRecord[]; // 분석할 감정 기록 배열
  dateRange: { start: Date; end: Date }; // 분석 기간
}
```

**출력 (Outputs)**:
```typescript
interface TrendAnalyzerOutput {
  dominantEmotions: { emotion: string; frequency: number }[]; // 주요 감정
  weeklyPattern: { day: string; avgMood: number }[]; // 요일별 패턴
  anomalies: { date: Date; description: string }[]; // 이상 패턴
  predictions: { nextEmotion: string; likelihood: number }[]; // 예측
  insights: string[]; // 발견된 인사이트 배열
}
```

**기능**:
- 시계열 데이터 분석
- 주요 패턴 탐지
- 이상치 감지
- 감정 변화 예측
- 자연어 기반 인사이트 생성

---

### 백엔드 모듈

#### 8. EmotionAPI Service

**목적**: 감정 데이터의 CRUD 작업을 처리하는 API

**엔드포인트**:

```
POST /api/ai/analyze-color
입력:
{
  "color": "#4A90E2",
  "intensity": 75,
  "context": "오늘 하루" (옵션)
}

출력:
{
  "candidates": [
    {
      "emotion": "평온",
      "description": "차분하고 안정된 느낌을 의미합니다",
      "confidence": 92
    },
    {
      "emotion": "만족",
      "description": "현재 상황에 만족감을 느끼고 있습니다",
      "confidence": 87
    },
    // ... 더 많은 후보들 (최대 8개)
  ]
}
```

```
POST /api/emotions
입력:
{
  "color": "#4A90E2",
  "intensity": 75,
  "emotion": "평온",
  "note": "오늘 하루 기분 좋음",
  "timestamp": "2025-10-25T10:30:00Z"
}

출력:
{
  "id": "emotion_123",
  "color": "#4A90E2",
  "intensity": 75,
  "emotion": "평온",
  "note": "오늘 하루 기분 좋음",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

```
GET /api/emotions?startDate=2025-10-01&endDate=2025-10-31
출력:
{
  "records": [
    {
      "id": "emotion_123",
      "color": "#4A90E2",
      "intensity": 75,
      "timestamp": "2025-10-25T10:30:00Z",
      "note": "오늘 하루 기분 좋음"
    },
    // ... 더 많은 기록
  ],
  "total": 45
}
```

```
GET /api/emotions/:id
출력:
{
  "id": "emotion_123",
  "color": "#4A90E2",
  "intensity": 75,
  "emotion": "평온",
  "note": "오늘 하루 기분 좋음",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

```
PUT /api/emotions/:id
입력:
{
  "note": "수정된 메모"
}

DELETE /api/emotions/:id
출력:
{
  "success": true,
  "message": "감정 기록이 삭제되었습니다"
}
```

---

## 📊 모듈별 마일스톤

### 🎨 UI/UX 모듈 (담당: 권은영)

#### 마일스톤 1: 디자인 시스템 구축 (Day 2-3)
- [ ] 디자인 시스템 가이드라인 작성
- [ ] 색상 팔레트 정의 (64개 색상)
- [ ] 타이포그래피 시스템 구축
- [ ] 아이콘 라이브러리 선정
- [ ] Figma 컴포넌트 라이브러리 생성

#### 마일스톤 2: 와이어프레임 설계 (Day 2-3)
- [ ] 메인 화면 와이어프레임
- [ ] 색상 선택 화면 와이어프레임
- [ ] 감정 선택 화면 와이어프레임
- [ ] 감정 기록 상세 화면 와이어프레임
- [ ] 캘린더 뷰 와이어프레임
- [ ] 트렌드 분석 화면 와이어프레임

#### 마일스톤 3: UI 디자인 (Day 4-5)
- [ ] 모든 화면의 고정밀 디자인 완료
- [ ] 인터랙션 디자인 완료
- [ ] 모바일 반응형 디자인 확인
- [ ] 접근성 검토 (WCAG 2.1 AA)

---

### 💻 프론트엔드 모듈 (담당: 황희정)

#### 마일스톤 1: 프로젝트 설정 (Day 2-3)
- [ ] React/TypeScript 프로젝트 초기화
- [ ] 라우팅 시스템 구축 (React Router)
- [ ] 상태 관리 라이브러리 설정 (Zustand/Redux)
- [ ] API 클라이언트 설정 (Axios/Fetch)
- [ ] 컴포넌트 폴더 구조 설계

#### 마일스톤 2: 핵심 컴포넌트 개발 (Day 4-5)
- [ ] ColorPicker 컴포넌트 구현
- [ ] EmotionSelector 컴포넌트 구현
- [ ] EmotionLogger 컴포넌트 구현
- [ ] CalendarView 컴포넌트 구현
- [ ] TrendAnalysis 컴포넌트 구현
- [ ] 공통 UI 컴포넌트 (Button, Input, Card 등)

#### 마일스톤 3: 통합 및 최적화 (Day 6)
- [ ] 모든 컴포넌트 통합
- [ ] API 연동 완료
- [ ] 로딩 상태 및 에러 처리
- [ ] 성능 최적화 (React.memo, useMemo 등)
- [ ] 반응형 디자인 적용

---

### 🤖 AI 모듈 (담당: 김가령)

#### 마일스톤 1: AI 모델 설계 (Day 2-3)
- [ ] 색상-감정 매핑 데이터셋 수집
- [ ] 감정 분석 모델 아키텍처 설계
- [ ] 트렌드 분석 알고리즘 설계
- [ ] API 서비스 구조 설계
- [ ] 의사결정: 자체 모델 vs 외부 API (Claude/OpenAI)

#### 마일스톤 2: AI 서비스 개발 (Day 4-5)
- [ ] EmotionAnalyzer 서비스 구현
- [ ] TrendAnalyzer 서비스 구현
- [ ] API 엔드포인트 구현
- [ ] 모델 훈련 또는 파인튜닝
- [ ] 성능 테스트 및 최적화

#### 마일스톤 3: 통합 및 배포 (Day 6)
- [ ] 프론트엔드와 API 연동
- [ ] 에러 핸들링 및 로깅 시스템
- [ ] 모델 성능 모니터링 설정
- [ ] 클라우드 배포 (AWS/Vercel)

---

### ⚙️ 백엔드 모듈 (담당: 황희정/김가령 공동)

#### 마일스톤 1: 데이터베이스 설계 (Day 2-3)
- [ ] 데이터베이스 스키마 설계
- [ ] 감정 기록 테이블 정의
- [ ] 사용자 인증 테이블 정의 (옵션)
- [ ] 인덱스 최적화 전략 수립
- [ ] 데이터베이스 선택 (PostgreSQL/MongoDB)

#### 마일스톤 2: API 개발 (Day 4-5)
- [ ] CRUD API 엔드포인트 구현
- [ ] 인증/인가 시스템 (JWT)
- [ ] 데이터 검증 및 에러 처리
- [ ] API 문서 작성 (Swagger/OpenAPI)

#### 마일스톤 3: 배포 및 운영 (Day 6)
- [ ] 데이터베이스 배포
- [ ] API 서버 배포
- [ ] 환경 변수 관리
- [ ] 로깅 및 모니터링 설정
- [ ] 백업 시스템 구축

---

### 🧪 품질 관리 (담당: 전체 팀)

#### 마일스톤 1: 테스트 작성 (Day 4-5)
- [ ] 프론트엔드 단위 테스트 (Jest)
- [ ] AI 서비스 단위 테스트
- [ ] API 통합 테스트
- [ ] E2E 테스트 시나리오 작성 (Cypress/Playwright)

#### 마일스톤 2: 통합 테스트 (Day 6)
- [ ] 전체 플로우 통합 테스트
- [ ] 버그 수정
- [ ] 성능 테스트
- [ ] 사용성 테스트
- [ ] 보안 취약점 점검

---

## 🛠 기술 요구사항

### 프론트엔드
- **프레임워크**: React 18+ / Next.js 14+
- **언어**: TypeScript
- **스타일링**: Tailwind CSS + Styled Components
- **상태관리**: Zustand 또는 Redux Toolkit
- **라우팅**: React Router
- **차트**: Chart.js 또는 Recharts
- **달력**: react-calendar 또는 custom 구현

### 백엔드
- **런타임**: Node.js 18+ 또는 Python 3.9+
- **프레임워크**: Express.js 또는 FastAPI
- **데이터베이스**: PostgreSQL 또는 MongoDB
- **ORM/ODM**: Prisma 또는 Mongoose
- **인증**: JWT (JSON Web Tokens)

### AI/ML
- **언어**: Python 3.9+
- **프레임워크**: TensorFlow 또는 PyTorch (자체 모델)
- **API**: OpenAI API 또는 Anthropic Claude API (외부 API)
- **분석**: Pandas, NumPy
- **시각화**: Matplotlib

### DevOps
- **버전 관리**: Git + GitHub
- **CI/CD**: GitHub Actions
- **클라우드**: Vercel (프론트엔드), AWS/Railway (백엔드)
- **모니터링**: Sentry 또는 LogRocket

### 개발 도구
- **에디터**: VS Code + Cursor
- **협업**: Discord/Zoom, Cursor Live Share
- **디자인**: Figma
- **프로젝트 관리**: Notion, GitHub Projects

---

## 📅 전체 일정 요약

| 기간 | 일정 | 주요 작업 |
|------|------|----------|
| Day 1 | 10/25 (토) | 프로젝트 킥오프, 환경 설정 |
| Day 2-3 | 10/26-27 (일-월) | 설계 및 기획 (디자인, 아키텍처) |
| Day 4-5 | 10/28-29 (화-수) | 핵심 기능 개발 |
| Day 6 | 10/30 (목) | 통합 및 테스트 |
| Day 7 | 10/31 (금) | 발표 준비 및 최종 점검 |

---

## ✅ 성공 기준

### 기능적 요구사항
- [ ] 사용자가 색상으로 감정을 기록할 수 있다
- [ ] 캘린더에서 기록된 감정을 시각적으로 확인할 수 있다
- [ ] AI가 감정을 분석하고 인사이트를 제공한다
- [ ] 감정 트렌드를 분석하고 차트로 시각화한다

### 비기능적 요구사항
- [ ] 모바일 반응형 디자인 지원
- [ ] 페이지 로딩 시간 2초 이내
- [ ] 사용자 만족도 4.5/5 이상
- [ ] 버그 개수 5개 이하

---

## 📝 참고 문서

- [TEAM_COLLABORATION.md](./TEAM_COLLABORATION.md) - 팀 협업 가이드
- [README.md](./README.md) - 프로젝트 개요
- Figma 디자인 파일 - UI/UX 스펙
- API 문서 - 백엔드 API 명세

---

**문서 버전**: 1.0  
**최종 수정일**: 2025-10-25  
**작성자**: PM (김하나) + AI Assistant
