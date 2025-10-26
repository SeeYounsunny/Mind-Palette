# 컬러일기(Color Diary) — **MVP 요구사항 정의서 (SRS)**

## 0 문서 개요
- **목적**: 기획 요약서의 내용을 정확히 개발 사양으로 변환하여, **1주 내 MVP**를 설계·구현·발표할 수 있게 함.
- **대상 플랫폼**: 웹(데스크톱·모바일 대응, PWA 고려).  
- **권장 스택(1주 완성용)**: `Streamlit + Python + SQLite`(단일 배포로 개발속도↑), 이미지 생성은 `Pillow`/`matplotlib`, 내보내기 `pandas`/`reportlab`.  
  - 대안(후속): `Next.js + Supabase/Postgres + FastAPI`.

---

## 1 제품 목표와 범위
- **핵심 목표**: “색채를 통해 나를 이해하는 감정 리플렉션 도구”
- **핵심 컨셉**: Color × Emotion × Diary × Visualization
- **MVP 범위(MoSCoW)**
  - **Must**: 오늘의 컬러 선택(33색), 감정/날씨/날씨느낌, 간단 일기, 캘린더 뷰, 기간별 감정 팔레트 자동 생성, 공유용 이미지, CSV/PDF 내보내기
  - **Should**: 회피 컬러 입력, 검색/필터, 한 날짜 복수 일기 표시(다중 색 도트), 초기 캘리브레이션(3분), 기본 알림(브라우저/PWA)
  - **Could**: AI 컬러 인사이트(텍스트 감정 분석), “오늘의 추천 컬러”, 목표 위젯
  - **Won’t (이번 스프린트 제외)**: 음성 인식(STT), 소셜 로그인/팔로우, 기업용 팀 팔레트

---

## 2 사용자 플로우(UX 시나리오)
1. 진입 → (게스트 자동 생성 혹은 닉네임) → 홈
2. **오늘의 컬러**:  
   - ① 지금 끌리는 컬러(필수, 1개)  
   - ② 오늘 회피하고 싶은 컬러(선택, 1개)
3. **지금 느낌**: 12개 감정 중 선택(단일) + 강도(슬라이더 1~5)  
   - 기쁘다/행복하다/즐겁다/뿌듯하다/평온하다/피곤하다/화난다/슬프다/짜증난다/불안하다/우울하다/기타(텍스트)
4. **에피소드**: 140자~자유 입력
5. **날씨 & 느낌**: 날씨(맑다/흐리다/비가 온다/바람이 분다/눈이 온다/기타(텍스트)), 날씨 느낌(따뜻하다/덥다/후덥지근하다/건조하다/시원하다/춥다/서늘하다/쌀쌀하다/습하다/기타(텍스트))
6. 저장 → **캘린더 뷰**(월)에서 색 도트로 시각화
7. **나의 컬러팔레트**: 1·3개월 요약 팔레트 및 감정 비중 도넛
8. **공유**: “이번 달의 감정 팔레트” 이미지 생성 → 저장/업로드
9. (선택) 텍스트 기반 **AI 인사이트/추천 컬러**

---

## 3 기능 요구사항 (기능ID, 설명, 우선순위, 수용 기준)

### FR-01 로그인/프로필(게스트)
- **설명**: 최초 접속 시 임시 사용자 ID 발급(로컬 저장). 닉네임 변경 가능.
- **우선순위**: Must
- **수용 기준**: 새로고침 후에도 동일 사용자로 데이터 조회 가능.

### FR-02 컬러 선택(끌림/회피)
- **설명**: 33색 팔레트에서 1개 필수 선택(끌림), 회피 1개 선택가능.
- **수용 기준**: 선택 색 미리보기, HEX 표기, 저장 시 기록됨.

### FR-03 감정 선택 + 강도
- **설명**: 감정 12택1 + 강도 1~5 슬라이더.
- **수용 기준**: 저장 시 값 유지, 캘린더·분석에 반영.

### FR-04 날씨·날씨느낌
- **설명**: 날씨 1택1, 날씨 느낌 1택1.
- **수용 기준**: 저장/조회/필터 가능.

### FR-05 일기 메모
- **설명**: 텍스트 입력(최소 1자, 최대 2,000자).
- **수용 기준**: 개행/이모지 허용, 저장·수정·삭제.

### FR-06 저장/수정/삭제(CRUD)
- **설명**: 당일 복수 일기 작성 가능.
- **수용 기준**: 저장 성공 토스트, 취소 확인 모달, 삭제 시 복구 불가 안내.

### FR-07 컬러 캘린더 뷰
- **설명**: 월 달력, 날짜별 원형 색 도트. 복수 일기는 다중 도트(최대3).
- **수용 기준**: 날짜 클릭 → 상세 패널(모든 항목 노출).

### FR-08 나의 감정 팔레트(기간 요약)
- **설명**: 기간(1/3개월) 상위 감정색/빈도 기반 팔레트 자동 생성 + 감정 도넛 차트.
- **수용 기준**: 팔레트 색칩/HEX 노출, 다운로드(PNG).

### FR-09 공유 이미지
- **설명**: “○월의 감정 팔레트/이번 주 톱3” 템플릿 이미지 생성.
- **수용 기준**: 1080×1920/1080×1080 두 사이즈 저장.

### FR-10 검색/필터
- **설명**: 감정/색/날씨/날씨느낌/텍스트 키워드 필터.
- **수용 기준**: 필터 적용 시 리스트·캘린더 동기 반영.

### FR-11 초기 캘리브레이션(3분)
- **설명**: 편안/집중/에너지 각 2색 선택 + 싫은색 2개 → 기본 팔레트 프로필.
- **수용 기준**: 완료 후 홈 추천 위젯에 반영.

### FR-12 데이터 내보내기
- **설명**: CSV(원시데이터), PDF(월간 리포트), PNG(팔레트 카드).
- **수용 기준**: 파일 저장 확인, 기본 저장 위치 안내.

### FR-13 알림(기본)
- **설명**: 일기 작성 리마인드(사용자 설정 시각 1회/일). PWA 푸시 또는 브라우저 알림.
- **수용 기준**: 시간 설정/ON·OFF 가능, 중복 알림 방지.

### FR-14 AI 컬러 인사이트/추천(베타)
- **설명**: 일기 텍스트를 감정 점수로 보조 분석 → “오늘의 추천 컬러(1~3)” 제시.
- **수용 기준(베타)**: 텍스트 미입력 시 비활성, 추천 사유 한 줄 설명.

---

## 4 비기능 요구사항
- **성능**: 저장/조회 평균 < 300ms(로컬·SQLite 기준), 캘린더 렌더 < 1s(1,000건 내).
- **가용성**: 오프라인 캐시(최소 최근 30건) 읽기 가능.
- **접근성**: WCAG 2.1 AA, 키보드 탐색, 색약 모드(도형/패턴 보조표시).
- **보안/개인정보**: 이메일 등 PII 미수집(MVP). 데이터는 사용자 로컬/앱 DB에 저장. 내보내기 시 암호화 선택(옵션).
- **국제화**: 한국어 기본, 텍스트 리소스 분리(i18n 준비).
- **법적 고지**: “비의료 멘탈케어 보조 도구” 명시.

---

## 5 데이터 체계(스키마/ERD 텍스트)

### 5.1 테이블
- `users(user_id PK, nickname TEXT, created_at DATETIME)`
- `colors(color_id PK, name_ko TEXT, hex TEXT, order_no INT)` ← 33색 마스터
- `emotions(emotion_id PK, label TEXT, valence INT)`  
  - 매핑(권장): 기쁘다+2, 행복+2, 즐겁다+2, 뿌듯+1, 평온+1, 피곤−1, 화남−2, 슬픔−2, 짜증−1, 불안−1, 우울−2, 기타0
- `entries(entry_id PK, user_id FK, ts DATETIME, main_color_id FK, avoid_color_id FK NULL, emotion_id FK, intensity INT, memo TEXT, weather TEXT, weather_feel TEXT, time_block TEXT, created_at DATETIME, updated_at DATETIME)`
- `entry_colors(entry_id FK, color_id FK, role TEXT)`  // 복수 팔레트 확장용
- `calibration(user_id FK, comfort_colors TEXT, focus_colors TEXT, energy_colors TEXT, dislike_colors TEXT, created_at DATETIME)`
- `insights(insight_id PK, user_id FK, period TEXT, top_colors TEXT, emotion_dist JSON, note TEXT, created_at DATETIME)`
- `share_media(media_id PK, user_id FK, type TEXT, file_path TEXT, created_at DATETIME)`
- `settings(user_id FK, reminder_time TEXT, locale TEXT, theme TEXT)`

> `time_block`: 새벽/아침/오전/점심/오후/저녁/밤/심야  
> `weather_feel`: 따뜻하다/덥다/후덥지근하다/건조하다/시원하다/춥다/서늘하다/쌀쌀하다/습하다/기타

### 5.2 JSON 스키마(엔트리 예)
```json
{
  "entry_id": "uuid",
  "user_id": "uuid",
  "ts": "2025-10-26T09:32:00+09:00",
  "main_color_id": 17,
  "avoid_color_id": 21,
  "emotion_id": 2,
  "intensity": 4,
  "memo": "회의 앞두고 살짝 긴장. 그래도 괜찮음.",
  "weather": "흐림",
  "weather_feel": "차분함",
  "time_block": "오전"
}
```

### 5.3 파생지표(앱 내부 계산)
- `valence_score = emotions.valence * (intensity/5.0)`
- `color_affinity[color] = 지수감가(최근 가중) 평균(valence_score)`
- 기간별 `top_colors`: 빈도+valence 가중 상위 N

---

## 6 알고리즘/규칙(간단 버전)

### 6.1 기간 팔레트 생성
1) 기간내 색별 `score = 0.7*빈도정규화 + 0.3*평균 valence_score`  
2) 상위 5개 추출 → 톤온톤 정렬(명도/채도)로 배치

### 6.2 추천 컬러(베타)
- 입력: 오늘 감정·강도·날씨·캘리브레이션
- 규칙:
  1) **서포트**: 내 `color_affinity` 상위 + 같은 날씨에서 `valence_score`가 높았던 색
  2) **부스터**(피곤/우울): 사용자별 과거 성과↑ 색
  3) **회피 제안**: 해당 감정에서 평균 음수였던 색은 비추천 라벨

---

## 7 화면 목록(와이어프레임 지침)
- **홈**: 오늘 기록 버튼, 주간 팔레트 카드, 리마인드 배너
- **기록 화면(1~5스텝)**: 컬러 → 감정(+강도) → 메모 → 날씨/느낌 → 저장
- **캘린더(월)**: 날짜별 도트, 하단 요약(총n건/톱색)
- **상세(일자)**: 일기 카드 리스트(색칩, 감정, 날씨, 메모)
- **나의 팔레트**: 1/3개월 탭, 팔레트 이미지/감정 도넛/문장형 인사이트
- **검색/필터**: 상단 바 + 조건칩
- **설정**: 닉네임, 알림 시간, 데이터 내보내기, 접근성 옵션
- **온보딩(캘리브레이션)**

---

## 8 API/모듈(로컬 앱 기준 함수 시그니처)
- `save_entry(entry: dict) -> entry_id`
- `list_entries(user_id, period, filters) -> [entry]`
- `get_calendar_matrix(year, month) -> [[date, [colors...]]]`
- `build_palette_summary(user_id, period) -> {colors:[], emotion_dist:{}, notes:""}`
- `generate_share_image(type, data) -> filepath`
- `export_csv(user_id, period) -> filepath`
- `export_pdf_report(user_id, month) -> filepath`
- `recommend_colors(user_id, context) -> [{color_id, reason}]`

---

## 9 1주 개발 일정(마일스톤 & 산출물)

**D1(설계/셋업)**  
- 저장소/브랜치 전략, 색·감정 마스터 정의, SQLite DDL 생성  
- 화면 스켈레톤(홈/기록/캘린더/팔레트)  
- **산출물**: DB 스키마, 컬러 33 JSON, 기본 테마

**D2(입력 플로우 완성)**  
- 컬러 선택(끌림/회피), 감정+강도, 날씨·느낌, 메모, 저장  
- **산출물**: FR-02~05,07 중 저장까지 E2E

**D3(캘린더/상세/CRUD)**  
- 월 캘린더, 다중 도트, 상세 카드, 수정/삭제  
- **산출물**: FR-06,07 완료

**D4(팔레트 요약/내보내기)**  
- 1/3개월 팔레트·감정 도넛, CSV/PDF  
- **산출물**: FR-08,12

**D5(공유 이미지/검색·필터)**  
- 스토리 템플릿 이미지, 검색/필터  
- **산출물**: FR-09,10

**D6(캘리브레이션/알림/품질)**  
- 3분 온보딩, 알림(기본), 접근성·모바일 최적화  
- **산출물**: FR-11,13 + 버그픽스

**D7(인사이트·데모)**  
- 간단 추천 규칙, 데모 시나리오/스크립트, 데이터 샘플  
- **산출물**: FR-14(베타), 발표 슬라이드·데모 계정

---

## 10 수용 테스트(샘플 시나리오)
1. 신규 유저가 오늘의 컬러/감정/메모/날씨를 저장 → 캘린더에 즉시 반영된다.  
2. 같은 날에 3건 작성 시 캘린더에 3개의 도트가 보인다.  
3. 1개월 팔레트 생성 시 상위 5색과 감정 도넛이 보이며 PNG 저장이 된다.  
4. “10월의 감정 팔레트” 공유 이미지를 1080×1920으로 저장한다.  
5. “우울하다, 강도5” 기록이 많은 달에 추천색에 따뜻·밝은군이 포함된다(사유 문구 출력).  
6. CSV 내보내기 파일에 모든 필드가 포함된다.  
7. 알림 시간 설정 후 다음날 정시에 브라우저 알림이 온다.

---

## 11 분석/로그 설계(이벤트)
- `entry_saved`, `entry_deleted`, `calendar_day_opened`, `palette_generated`, `share_image_saved`, `export_csv`, `export_pdf`, `recommend_shown`, `reminder_shown`, `reminder_clicked`
- 속성: user_id, ts, filters, counts 등  
- KPI: 7일 잔존, 주당 기록일수, 평균 강도, 추천 클릭률, 공유 저장률

---

## 12 접근성/시각 설계 가이드
- 색약 모드: 도트에 **윤곽/패턴** 추가(예: 스트라이프=회피색).  
- 명도 대비: 텍스트 대비율 4.5:1 이상, 포커스 링 명확.  
- 애니메이션 최소화 토글(민감 사용자 배려).

---

## 13 리스크 & 대응
- **시간 부족**: AI 분석은 룰베이스(Beta)로 축소, STT/로그인은 다음 스프린트.  
- **데이터 손실**: 저장 시 즉시 디스크 커밋, 자동 백업(JSON, 주1회).  
- **색 인식 편향**: 사용자별 캘리브레이션으로 개인화 보정.

---

## 15 부록: SQLite DDL(요약)
```sql
CREATE TABLE users (user_id TEXT PRIMARY KEY, nickname TEXT, created_at TEXT);
CREATE TABLE colors (color_id INTEGER PRIMARY KEY, name_ko TEXT, hex TEXT, order_no INTEGER);
CREATE TABLE emotions (emotion_id INTEGER PRIMARY KEY, label TEXT, valence INTEGER);
CREATE TABLE entries (
  entry_id TEXT PRIMARY KEY, user_id TEXT, ts TEXT,
  main_color_id INTEGER, avoid_color_id INTEGER,
  emotion_id INTEGER, intensity INTEGER,
  memo TEXT, weather TEXT, weather_feel TEXT, time_block TEXT,
  created_at TEXT, updated_at TEXT
);
CREATE TABLE calibration (user_id TEXT PRIMARY KEY,
  comfort_colors TEXT, focus_colors TEXT, energy_colors TEXT, dislike_colors TEXT, created_at TEXT);
```
