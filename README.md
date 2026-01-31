# 한국사 능력검정시험 OMR 퀴즈

온라인 한국사 능력검정시험 OMR 답안 작성 및 채점 시스템

## 🚀 빠른 시작 (GitHub Pages)

### 온라인에서 바로 사용하기
GitHub Pages로 배포하면 웹에서 바로 사용할 수 있습니다.

**배포된 페이지 주소:**
```
https://[your-username].github.io/[repository-name]/
```

## 📦 GitHub Pages 배포 방법

### 1. GitHub 레포지토리 생성

1. GitHub에 로그인
2. 새 레포지토리 생성 (예: `korean-history-quiz`)
3. Public으로 설정

### 2. 파일 업로드

```bash
cd /Users/incheol/Desktop/koreanHistory3

# Git 초기화
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 레포지토리 연결 (본인의 주소로 변경)
git remote add origin https://github.com/[your-username]/[repository-name].git

# 푸시
git branch -M main
git push -u origin main
```

### 3. GitHub Pages 활성화

1. GitHub 레포지토리 페이지로 이동
2. **Settings** 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source**에서 `main` 브랜치 선택
5. **Save** 클릭
6. 몇 분 후 `https://[your-username].github.io/[repository-name]/` 에서 접속 가능

### 4. 접속 방법

GitHub Pages 배포 후:
```
https://[your-username].github.io/[repository-name]/quiz-omr.html
```

또는 `index.html`로 이름 변경 시:
```
https://[your-username].github.io/[repository-name]/
```

## 💻 로컬에서 실행

### 서버 실행

```bash
cd /Users/incheol/Desktop/koreanHistory3
python3 -m http.server 8000
```

### 브라우저 접속

```
http://localhost:8000/quiz-omr.html
```

## 📱 기능

- ✅ 76회, 75회, 74회 시험 선택
- ✅ PDF 문제지 보기
- ✅ OMR 답안 작성
- ✅ 실시간 채점
- ✅ 정답/오답 표시
- ✅ 완벽한 반응형 (모바일/태블릿/PC)

## 📂 프로젝트 구조

```
koreanHistory3/
├── index.html (quiz-omr.html 복사본)
├── quiz-omr.html
├── quiz-omr.js
├── README.md
├── README-OMR.md
├── 76회 한국사_문제지(심화).pdf
├── 75회 한국사_문제지(심화).pdf
└── 74회 한국사_문제지(심화).pdf
```

## 📖 상세 가이드

자세한 사용법은 [README-OMR.md](README-OMR.md)를 참고하세요.

## 🔧 문제 해결

### PDF가 안 보여요
- GitHub Pages: 파일이 모두 업로드되었는지 확인
- 로컬: 웹서버를 실행했는지 확인 (`python3 -m http.server 8000`)
- `file://` 프로토콜로는 작동하지 않습니다

## 🎯 개발자

개발 관련 문의나 이슈는 GitHub Issues를 이용해주세요.
