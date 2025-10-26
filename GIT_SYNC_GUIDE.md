# Git 동기화 가이드

## 🎯 목적
GitHub의 최신 내용(main 브랜치)을 자신의 브랜치에 받아서 작업하기

## 📋 상황별 동기화 방법

### **시나리오 1: 이미 브랜치가 있는 경우**

#### Step 1: 현재 상태 확인
```bash
# 현재 브랜치 확인
git branch

# 현재 상태 확인
git status
```

#### Step 2: 자신의 브랜치에서 작업 중단
```bash
# 현재 작업 커밋 (만약 수정된 파일이 있다면)
git add .
git commit -m "작업 중간 저장"
```

#### Step 3: main 브랜치로 이동
```bash
git checkout main
```

#### Step 4: GitHub에서 최신 내용 받기
```bash
git pull origin main
```

#### Step 5: 자신의 브랜치로 돌아가기
```bash
git checkout feature/자신의이름-역할
```

#### Step 6: main의 최신 내용을 자신의 브랜치에 병합
```bash
git merge main
```

#### Step 7: GitHub에 업데이트된 내용 푸시
```bash
git push origin feature/자신의이름-역할
```

---

### **시나리오 2: 브랜치가 아직 없는 경우 (김가령)**

#### Step 1: main 브랜치로 이동
```bash
git checkout main
```

#### Step 2: GitHub에서 최신 내용 받기
```bash
git pull origin main
```

#### Step 3: 새로운 브랜치 생성
```bash
git checkout -b feature/garyeong-ai
```

#### Step 4: GitHub에 브랜치 푸시
```bash
git push origin feature/garyeong-ai
```

---

## 🔥 충돌 해결 방법

### 충돌이 발생한 경우

#### Step 1: 충돌 확인
```bash
git status
```

충돌이 발생하면 다음과 같은 메시지가 나타납니다:
```
Both modified: 파일명.txt
```

#### Step 2: 파일 열어서 충돌 해결
파일에서 충돌 표시를 찾아 수정:
```
<<<<<<< HEAD
현재 브랜치의 내용
=======
main 브랜치의 내용
>>>>>>> main
```

#### Step 3: 충돌 해결 완료
```bash
# 수정된 파일 추가
git add .

# 충돌 해결 커밋
git commit -m "resolve: Merge conflicts with main branch"
```

#### Step 4: GitHub에 푸시
```bash
git push origin feature/자신의이름-역할
```

---

## 🛠️ 팀원별 명령어 모음

### 김하나 (PM)
```bash
git checkout feature/hana-pm
git pull origin main
git merge main
git push origin feature/hana-pm
```

### 권은영 (UX/UI 디자이너)
```bash
git checkout feature/eunyoung-design
git pull origin main
git merge main
git push origin feature/eunyoung-design
```

### 황희정 (프론트엔드 개발자)
```bash
git checkout feature/heejung-frontend
git pull origin main
git merge main
git push origin feature/heejung-frontend
```

### 박연선 (발표 담당)
```bash
git checkout feature/younsun-presentation
git pull origin main
git merge main
git push origin feature/younsun-presentation
```

### 김가령 (AI·데이터) - 브랜치 생성 필요
```bash
git checkout main
git pull origin main
git checkout -b feature/garyeong-ai
git push origin feature/garyeong-ai
```

---

## 📝 워크플로우 체크리스트

### 매일 작업 시작 전
- [ ] main 브랜치의 최신 내용 확인
- [ ] 자신의 브랜치에 최신 내용 병합
- [ ] 충돌 확인 및 해결
- [ ] 작업 시작

### 작업 완료 후
- [ ] 변경사항 커밋
- [ ] GitHub에 푸시
- [ ] main 브랜치에 최신 내용 병합 (필요시)

---

## 🚨 자주 발생하는 문제와 해결

### 문제 1: "Your branch is ahead of origin"
**해결**: `git push origin feature/자신의브랜치명`

### 문제 2: "Please commit your changes or stash them"
**해결**: 
```bash
git add .
git commit -m "임시 저장"
```

### 문제 3: "Updates were rejected"
**해결**: 
```bash
git pull origin feature/자신의브랜치명
git push origin feature/자신의브랜치명
```

### 문제 4: 파일 삭제/수정했는데 되돌리고 싶음
**해결**: 
```bash
git checkout -- 파일명
```

### 문제 5: 모든 것을 되돌리고 싶음
**해결**: 
```bash
git reset --hard HEAD
```

---

## 💡 유용한 팁

### 현재 작업 상태 확인
```bash
git status
```

### 브랜치 목록 확인
```bash
git branch -a
```

### 최근 커밋 히스토리 확인
```bash
git log --oneline --graph --all
```

### 특정 파일의 변경사항 확인
```bash
git diff 파일명
```

### 충돌 시 도움 받기
- 팀 채팅방에 상황 설명
- 스크린샷 첨부
- 에러 메시지 전체 복사

---

## 🎯 간단 요약 (자신의 브랜치가 있을 때)

```bash
# 1. main 최신 내용 받기
git checkout main
git pull origin main

# 2. 자신의 브랜치로 돌아가서 병합
git checkout feature/자신의브랜치명
git merge main

# 3. 충돌 있으면 해결하고 푸시
git push origin feature/자신의브랜치명
```

**끝!** 이제 최신 내용으로 작업할 수 있습니다! 🎉
