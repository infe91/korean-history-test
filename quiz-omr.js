// PDF.js 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

class OMRQuizApp {
    constructor() {
        this.pdfDoc = null;
        this.currentPage = 1;
        this.totalPages = 0;
        this.scale = 1.5;
        this.userAnswers = {}; // { questionNum: choiceIndex }
        this.isGraded = false;

        // 시험 데이터 배열
        this.examsData = this.getExamsData();

        // 현재 선택된 시험 (기본값: 76회)
        this.currentExam = this.loadCurrentExam() || this.examsData[0];

        // 현재 시험의 정답
        this.correctAnswers = this.getCurrentExamAnswers();

        this.init();
    }

    // 현재 선택된 시험 불러오기
    loadCurrentExam() {
        const savedRound = localStorage.getItem('currentExamRound');
        if (savedRound) {
            return this.examsData.find(exam => exam.round === parseInt(savedRound));
        }
        return null;
    }

    // 현재 선택된 시험 저장하기
    saveCurrentExam() {
        localStorage.setItem('currentExamRound', this.currentExam.round);
    }

    // 시험 선택 변경
    changeExam(round) {
        // 채점 중이면 경고
        if (this.isGraded) {
            if (!confirm('채점 결과가 초기화됩니다. 시험을 변경하시겠습니까?')) {
                // 드롭다운을 원래 값으로 되돌림
                document.getElementById('exam-selector').value = this.currentExam.round;
                return;
            }
        }

        // 답안이 있으면 경고
        if (Object.keys(this.userAnswers).length > 0) {
            if (!confirm('작성한 답안이 모두 사라집니다. 시험을 변경하시겠습니까?')) {
                // 드롭다운을 원래 값으로 되돌림
                document.getElementById('exam-selector').value = this.currentExam.round;
                return;
            }
        }

        // 시험 변경
        const newExam = this.examsData.find(exam => exam.round === parseInt(round));
        if (newExam) {
            this.currentExam = newExam;
            this.saveCurrentExam();
            this.correctAnswers = this.getCurrentExamAnswers();
            this.reset(true); // 초기화 (확인 없이)
            this.loadPDF(); // PDF 다시 로드

            // 헤더 제목 업데이트
            document.querySelector('.header h1').textContent =
                `제${this.currentExam.round}회 한국사능력검정시험 (심화)`;
        }
    }

    // 현재 시험의 정답 가져오기
    getCurrentExamAnswers() {
        const answers = {};
        this.currentExam.questions.forEach(q => {
            answers[q.no] = q.answer - 1; // 1-5를 0-4로 변환
        });
        return answers;
    }

    getExamsData() {
        // 모든 시험 데이터
        return [
            {
                "round": 76,
                "type": "Advanced",
                "pdfUrl": "76회 한국사_문제지(심화).pdf",
                "totalCount": 50,
                "questions": [
                    { "no": 1, "answer": 5, "score": 1 },
                    { "no": 2, "answer": 2, "score": 2 },
                    { "no": 3, "answer": 3, "score": 2 },
                    { "no": 4, "answer": 1, "score": 1 },
                    { "no": 5, "answer": 4, "score": 2 },
                    { "no": 6, "answer": 2, "score": 2 },
                    { "no": 7, "answer": 4, "score": 2 },
                    { "no": 8, "answer": 3, "score": 2 },
                    { "no": 9, "answer": 2, "score": 3 },
                    { "no": 10, "answer": 2, "score": 2 },
                    { "no": 11, "answer": 1, "score": 2 },
                    { "no": 12, "answer": 3, "score": 3 },
                    { "no": 13, "answer": 5, "score": 2 },
                    { "no": 14, "answer": 4, "score": 2 },
                    { "no": 15, "answer": 3, "score": 3 },
                    { "no": 16, "answer": 1, "score": 2 },
                    { "no": 17, "answer": 1, "score": 1 },
                    { "no": 18, "answer": 3, "score": 1 },
                    { "no": 19, "answer": 4, "score": 3 },
                    { "no": 20, "answer": 5, "score": 2 },
                    { "no": 21, "answer": 1, "score": 2 },
                    { "no": 22, "answer": 2, "score": 2 },
                    { "no": 23, "answer": 5, "score": 1 },
                    { "no": 24, "answer": 4, "score": 2 },
                    { "no": 25, "answer": 2, "score": 2 },
                    { "no": 26, "answer": 3, "score": 2 },
                    { "no": 27, "answer": 3, "score": 1 },
                    { "no": 28, "answer": 2, "score": 3 },
                    { "no": 29, "answer": 5, "score": 2 },
                    { "no": 30, "answer": 1, "score": 2 },
                    { "no": 31, "answer": 3, "score": 1 },
                    { "no": 32, "answer": 4, "score": 2 },
                    { "no": 33, "answer": 4, "score": 2 },
                    { "no": 34, "answer": 3, "score": 3 },
                    { "no": 35, "answer": 5, "score": 2 },
                    { "no": 36, "answer": 2, "score": 1 },
                    { "no": 37, "answer": 5, "score": 3 },
                    { "no": 38, "answer": 4, "score": 2 },
                    { "no": 39, "answer": 3, "score": 2 },
                    { "no": 40, "answer": 3, "score": 2 },
                    { "no": 41, "answer": 1, "score": 2 },
                    { "no": 42, "answer": 4, "score": 1 },
                    { "no": 43, "answer": 4, "score": 2 },
                    { "no": 44, "answer": 5, "score": 3 },
                    { "no": 45, "answer": 5, "score": 1 },
                    { "no": 46, "answer": 5, "score": 3 },
                    { "no": 47, "answer": 1, "score": 2 },
                    { "no": 48, "answer": 1, "score": 2 },
                    { "no": 49, "answer": 2, "score": 2 },
                    { "no": 50, "answer": 5, "score": 3 }
                ]
            },
            {
                "round": 75,
                "type": "Advanced",
                "pdfUrl": "75회 한국사_문제지(심화).pdf",
                "totalCount": 50,
                "questions": [
                    { "no": 1, "answer": 4, "score": 1 },
                    { "no": 2, "answer": 1, "score": 2 },
                    { "no": 3, "answer": 5, "score": 2 },
                    { "no": 4, "answer": 1, "score": 2 },
                    { "no": 5, "answer": 2, "score": 2 },
                    { "no": 6, "answer": 4, "score": 2 },
                    { "no": 7, "answer": 4, "score": 3 },
                    { "no": 8, "answer": 2, "score": 2 },
                    { "no": 9, "answer": 3, "score": 2 },
                    { "no": 10, "answer": 1, "score": 3 },
                    { "no": 11, "answer": 5, "score": 2 },
                    { "no": 12, "answer": 5, "score": 1 },
                    { "no": 13, "answer": 3, "score": 2 },
                    { "no": 14, "answer": 3, "score": 2 },
                    { "no": 15, "answer": 5, "score": 2 },
                    { "no": 16, "answer": 5, "score": 2 },
                    { "no": 17, "answer": 4, "score": 1 },
                    { "no": 18, "answer": 3, "score": 2 },
                    { "no": 19, "answer": 1, "score": 2 },
                    { "no": 20, "answer": 5, "score": 2 },
                    { "no": 21, "answer": 2, "score": 2 },
                    { "no": 22, "answer": 2, "score": 3 },
                    { "no": 23, "answer": 2, "score": 2 },
                    { "no": 24, "answer": 3, "score": 2 },
                    { "no": 25, "answer": 1, "score": 1 },
                    { "no": 26, "answer": 1, "score": 2 },
                    { "no": 27, "answer": 4, "score": 2 },
                    { "no": 28, "answer": 5, "score": 2 },
                    { "no": 29, "answer": 1, "score": 1 },
                    { "no": 30, "answer": 2, "score": 3 },
                    { "no": 31, "answer": 3, "score": 3 },
                    { "no": 32, "answer": 2, "score": 2 },
                    { "no": 33, "answer": 3, "score": 1 },
                    { "no": 34, "answer": 5, "score": 2 },
                    { "no": 35, "answer": 2, "score": 2 },
                    { "no": 36, "answer": 5, "score": 1 },
                    { "no": 37, "answer": 1, "score": 2 },
                    { "no": 38, "answer": 3, "score": 3 },
                    { "no": 39, "answer": 4, "score": 2 },
                    { "no": 40, "answer": 3, "score": 3 },
                    { "no": 41, "answer": 4, "score": 3 },
                    { "no": 42, "answer": 1, "score": 1 },
                    { "no": 43, "answer": 2, "score": 2 },
                    { "no": 44, "answer": 2, "score": 1 },
                    { "no": 45, "answer": 4, "score": 3 },
                    { "no": 46, "answer": 2, "score": 2 },
                    { "no": 47, "answer": 5, "score": 2 },
                    { "no": 48, "answer": 3, "score": 1 },
                    { "no": 49, "answer": 5, "score": 3 },
                    { "no": 50, "answer": 4, "score": 2 }
                ]
            },
            {
                "round": 74,
                "type": "Advanced",
                "pdfUrl": "74회 한국사_문제지(심화).pdf",
                "totalCount": 50,
                "questions": [
                    { "no": 1, "answer": 3, "score": 1 },
                    { "no": 2, "answer": 5, "score": 2 },
                    { "no": 3, "answer": 2, "score": 2 },
                    { "no": 4, "answer": 2, "score": 3 },
                    { "no": 5, "answer": 5, "score": 2 },
                    { "no": 6, "answer": 5, "score": 3 },
                    { "no": 7, "answer": 5, "score": 2 },
                    { "no": 8, "answer": 2, "score": 2 },
                    { "no": 9, "answer": 2, "score": 1 },
                    { "no": 10, "answer": 4, "score": 2 },
                    { "no": 11, "answer": 2, "score": 1 },
                    { "no": 12, "answer": 3, "score": 2 },
                    { "no": 13, "answer": 1, "score": 3 },
                    { "no": 14, "answer": 1, "score": 3 },
                    { "no": 15, "answer": 4, "score": 2 },
                    { "no": 16, "answer": 2, "score": 2 },
                    { "no": 17, "answer": 1, "score": 2 },
                    { "no": 18, "answer": 4, "score": 2 },
                    { "no": 19, "answer": 1, "score": 2 },
                    { "no": 20, "answer": 1, "score": 2 },
                    { "no": 21, "answer": 3, "score": 2 },
                    { "no": 22, "answer": 4, "score": 3 },
                    { "no": 23, "answer": 4, "score": 2 },
                    { "no": 24, "answer": 3, "score": 1 },
                    { "no": 25, "answer": 5, "score": 3 },
                    { "no": 26, "answer": 2, "score": 1 },
                    { "no": 27, "answer": 2, "score": 1 },
                    { "no": 28, "answer": 4, "score": 2 },
                    { "no": 29, "answer": 3, "score": 2 },
                    { "no": 30, "answer": 1, "score": 2 },
                    { "no": 31, "answer": 3, "score": 1 },
                    { "no": 32, "answer": 4, "score": 2 },
                    { "no": 33, "answer": 5, "score": 2 },
                    { "no": 34, "answer": 1, "score": 3 },
                    { "no": 35, "answer": 4, "score": 3 },
                    { "no": 36, "answer": 4, "score": 2 },
                    { "no": 37, "answer": 4, "score": 1 },
                    { "no": 38, "answer": 3, "score": 2 },
                    { "no": 39, "answer": 2, "score": 2 },
                    { "no": 40, "answer": 5, "score": 1 },
                    { "no": 41, "answer": 3, "score": 2 },
                    { "no": 42, "answer": 5, "score": 2 },
                    { "no": 43, "answer": 4, "score": 1 },
                    { "no": 44, "answer": 5, "score": 2 },
                    { "no": 45, "answer": 1, "score": 2 },
                    { "no": 46, "answer": 3, "score": 2 },
                    { "no": 47, "answer": 3, "score": 3 },
                    { "no": 48, "answer": 5, "score": 2 },
                    { "no": 49, "answer": 5, "score": 2 },
                    { "no": 50, "answer": 5, "score": 3 }
                ]
            }
        ];
    }

    async init() {
        // 시험 선택 드롭다운 생성
        this.createExamSelector();

        // OMR 카드 생성
        this.createOMRCard();

        // PDF 로드
        await this.loadPDF();

        // PDF 영역 클릭 네비게이션 설정
        this.setupPDFClickNavigation();

        // 모바일 바텀시트 드래그 설정
        this.setupBottomSheetDrag();

        // 초기 바텀시트 높이 설정 (모바일)
        if (window.innerWidth <= 768) {
            setTimeout(() => this.adjustBottomSheetHeight(), 200);
        }

        // 화면 크기 변경 시 바텀시트 높이 재조정
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.adjustBottomSheetHeight();
            }
        });
    }

    // 시험 선택 드롭다운 생성
    createExamSelector() {
        const selector = document.getElementById('exam-selector');
        selector.innerHTML = '';

        this.examsData.forEach(exam => {
            const option = document.createElement('option');
            option.value = exam.round;
            option.textContent = `${exam.round}회`;
            if (exam.round === this.currentExam.round) {
                option.selected = true;
            }
            selector.appendChild(option);
        });

        selector.addEventListener('change', (e) => {
            this.changeExam(e.target.value);
        });
    }

    // PDF 로드
    async loadPDF() {
        try {
            const loadingTask = pdfjsLib.getDocument(this.currentExam.pdfUrl);
            this.pdfDoc = await loadingTask.promise;
            this.totalPages = this.pdfDoc.numPages;

            document.getElementById('total-pages').textContent = this.totalPages;

            // 첫 페이지 렌더링
            this.currentPage = 1;
            await this.renderPage(this.currentPage);

        } catch (error) {
            console.error('PDF 로드 실패:', error);
            alert(`PDF 로드 실패: ${this.currentExam.pdfUrl}\n\n웹서버를 실행해야 합니다!\n\n"서버실행.command" 파일을 더블클릭하거나\n터미널에서 "python3 -m http.server 8000" 실행 후\nhttp://localhost:8000/quiz-omr.html 로 접속하세요.`);
        }
    }

    // 바텀시트 드래그로 닫기
    setupBottomSheetDrag() {
        const omrSection = document.querySelector('.omr-section');
        let startY = 0;
        let currentY = 0;
        let isDragging = false;

        const handleStart = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            startY = touch.clientY;
            isDragging = true;
        };

        const handleMove = (e) => {
            if (!isDragging) return;

            const touch = e.touches ? e.touches[0] : e;
            currentY = touch.clientY - startY;

            // 아래로만 드래그 가능
            if (currentY > 0) {
                omrSection.style.transform = `translateY(${currentY}px)`;
            }
        };

        const handleEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            // 100px 이상 내리면 닫기
            if (currentY > 100) {
                this.closeMobileOMR();
            }

            omrSection.style.transform = '';
            currentY = 0;
        };

        omrSection.addEventListener('touchstart', handleStart);
        omrSection.addEventListener('touchmove', handleMove);
        omrSection.addEventListener('touchend', handleEnd);

        // 마우스 이벤트도 지원 (데스크톱 테스트용)
        omrSection.addEventListener('mousedown', handleStart);
        omrSection.addEventListener('mousemove', handleMove);
        omrSection.addEventListener('mouseup', handleEnd);
    }

    // PDF 영역 클릭으로 페이지 넘기기 (이북 스타일)
    setupPDFClickNavigation() {
        const prevArrow = document.getElementById('pdf-prev-arrow');
        const nextArrow = document.getElementById('pdf-next-arrow');

        // 화살표 클릭 이벤트
        prevArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            this.previousPage();
        });

        nextArrow.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextPage();
        });

        // 화살표 상태 업데이트
        this.updateNavigationArrows();
    }

    // 화살표 버튼 상태 업데이트
    updateNavigationArrows() {
        const prevArrow = document.getElementById('pdf-prev-arrow');
        const nextArrow = document.getElementById('pdf-next-arrow');

        if (prevArrow && nextArrow) {
            // 첫 페이지면 이전 버튼 비활성화
            if (this.currentPage <= 1) {
                prevArrow.classList.add('disabled');
            } else {
                prevArrow.classList.remove('disabled');
            }

            // 마지막 페이지면 다음 버튼 비활성화
            if (this.currentPage >= this.totalPages) {
                nextArrow.classList.add('disabled');
            } else {
                nextArrow.classList.remove('disabled');
            }
        }
    }

    createOMRCard() {
        const grid = document.getElementById('omr-grid');
        grid.innerHTML = '';

        for (let q = 1; q <= 50; q++) {
            const row = document.createElement('div');
            row.className = 'omr-row';

            const qNum = document.createElement('div');
            qNum.className = 'question-number';
            qNum.textContent = q;

            const choices = document.createElement('div');
            choices.className = 'choices';

            for (let c = 0; c < 5; c++) {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = ['①', '②', '③', '④', '⑤'][c];
                btn.dataset.question = q;
                btn.dataset.choice = c;

                btn.addEventListener('click', () => {
                    this.selectAnswer(q, c);
                });

                choices.appendChild(btn);
            }

            row.appendChild(qNum);
            row.appendChild(choices);
            grid.appendChild(row);
        }
    }

    selectAnswer(questionNum, choiceIndex) {
        if (this.isGraded) {
            alert('이미 채점되었습니다. 초기화 후 다시 풀어주세요.');
            return;
        }

        // 같은 선택지를 다시 클릭하면 선택 취소
        if (this.userAnswers[questionNum] === choiceIndex) {
            delete this.userAnswers[questionNum];
        } else {
            this.userAnswers[questionNum] = choiceIndex;
        }

        this.updateOMRDisplay();
        this.updateAnsweredCount();
    }

    updateOMRDisplay() {
        // 모든 버튼의 선택 상태 업데이트
        document.querySelectorAll('.choice-btn').forEach(btn => {
            const q = parseInt(btn.dataset.question);
            const c = parseInt(btn.dataset.choice);

            // 기존 클래스 제거
            btn.classList.remove('selected', 'correct', 'wrong');

            // 채점 전: 선택된 답만 표시
            if (!this.isGraded) {
                if (this.userAnswers[q] === c) {
                    btn.classList.add('selected');
                }
            }
            // 채점 후: 정답/오답 표시
            else {
                const correctAnswer = this.correctAnswers[q];
                const userAnswer = this.userAnswers[q];

                // 정답 표시
                if (c === correctAnswer) {
                    btn.classList.add('correct');
                }
                // 사용자가 선택한 오답 표시
                else if (c === userAnswer && userAnswer !== correctAnswer) {
                    btn.classList.add('wrong');
                }
            }
        });
    }

    updateAnsweredCount() {
        const count = Object.keys(this.userAnswers).length;
        document.getElementById('answered-count').textContent = count;

        // 모바일 토글 버튼도 업데이트
        const mobileAnswered = document.getElementById('mobile-answered');
        if (mobileAnswered) {
            mobileAnswered.textContent = count;
        }
    }

    submitAnswers() {
        if (this.isGraded) {
            alert('이미 채점되었습니다.');
            return;
        }

        const answeredCount = Object.keys(this.userAnswers).length;
        if (answeredCount === 0) {
            alert('답안을 선택해주세요!');
            return;
        }

        if (answeredCount < 50) {
            const confirm = window.confirm(
                `50개 문제 중 ${answeredCount}개만 풀었습니다.\n그래도 채점하시겠습니까?`
            );
            if (!confirm) return;
        }

        // 채점
        let correct = 0;
        let wrong = 0;
        let unanswered = 0;

        for (let q = 1; q <= 50; q++) {
            const userAnswer = this.userAnswers[q];
            const correctAnswer = this.correctAnswers[q];

            if (userAnswer === undefined) {
                unanswered++;
            } else if (userAnswer === correctAnswer) {
                correct++;
            } else {
                wrong++;
            }
        }

        this.isGraded = true;

        // 결과 표시
        const percentage = Math.round((correct / 50) * 100);

        document.getElementById('result-score').textContent = `${percentage}점`;
        document.getElementById('correct-count').textContent = correct;
        document.getElementById('wrong-count').textContent = wrong;
        document.getElementById('unanswered-count').textContent = unanswered;
        document.getElementById('result-panel').classList.add('show');

        // OMR 카드 업데이트 (정답/오답 표시)
        this.updateOMRDisplay();

        // 결과 패널로 스크롤
        document.getElementById('result-panel').scrollIntoView({ behavior: 'smooth' });

        alert(`채점 완료!\n\n정답: ${correct}개\n오답: ${wrong}개\n미답: ${unanswered}개\n\n점수: ${percentage}점`);
    }

    reset(skipConfirm = false) {
        if (skipConfirm || confirm('모든 답안을 초기화하시겠습니까?')) {
            this.userAnswers = {};
            this.isGraded = false;
            this.updateOMRDisplay();
            this.updateAnsweredCount();
            document.getElementById('result-panel').classList.remove('show');

            // 맨 위로 스크롤
            document.querySelector('.omr-section').scrollTop = 0;
        }
    }

    // PDF 관련 메서드

    async renderPage(pageNum) {
        try {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.scale });

            const canvas = document.getElementById('pdf-canvas');
            const context = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            document.getElementById('current-page').textContent = pageNum;

            // 화살표 상태 업데이트
            this.updateNavigationArrows();

            // 모바일에서 바텀시트 높이 재조정
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    if (this.adjustBottomSheetHeight) {
                        this.adjustBottomSheetHeight();
                    }
                }, 100);
            }

        } catch (error) {
            console.error('페이지 렌더링 실패:', error);
        }
    }

    async nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            await this.renderPage(this.currentPage);
        }
    }

    async previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.renderPage(this.currentPage);
        }
    }

    async zoomIn() {
        this.scale += 0.2;
        await this.renderPage(this.currentPage);
    }

    async zoomOut() {
        if (this.scale > 0.5) {
            this.scale -= 0.2;
            await this.renderPage(this.currentPage);
        }
    }

    // 모바일 OMR 토글
    toggleMobileOMR() {
        const omrSection = document.querySelector('.omr-section');
        const toggleBtn = document.getElementById('mobile-omr-toggle');

        const isOpen = omrSection.classList.contains('mobile-open');

        if (isOpen) {
            this.closeMobileOMR();
        } else {
            // PDF 캔버스의 하단 위치 계산
            this.adjustBottomSheetHeight();

            // 열기
            omrSection.classList.add('mobile-open');
            toggleBtn.innerHTML = `⬇️ 닫기`;
            toggleBtn.classList.add('open');
        }
    }

    // 바텀시트 높이를 PDF 캔버스를 넘지 않도록 조정
    adjustBottomSheetHeight() {
        const canvas = document.getElementById('pdf-canvas');
        const omrSection = document.querySelector('.omr-section');
        const toggleBtn = document.getElementById('mobile-omr-toggle');

        if (!canvas || !omrSection) return;

        // PDF 캔버스의 위치 정보
        const canvasRect = canvas.getBoundingClientRect();
        const canvasBottom = canvasRect.bottom;

        // 토글 버튼 높이
        const toggleHeight = toggleBtn ? toggleBtn.offsetHeight : 50;

        // 화면 하단부터 캔버스 하단까지의 거리
        const viewportHeight = window.innerHeight;
        const spaceFromBottom = viewportHeight - canvasBottom;

        // 바텀시트 최대 높이 = 화면 높이 - 캔버스 하단 위치 - 토글 버튼 높이
        const maxHeight = viewportHeight - canvasBottom - toggleHeight - 10; // 10px 여유

        // 최소 높이 보장 (너무 작으면 150px로 설정)
        const finalHeight = Math.max(maxHeight, 150);

        console.log('PDF 캔버스 하단:', canvasBottom);
        console.log('화면 높이:', viewportHeight);
        console.log('바텀시트 최대 높이:', finalHeight);

        // 동적으로 높이 설정
        omrSection.style.setProperty('--bottom-sheet-height', `${finalHeight}px`);
        omrSection.style.height = `${finalHeight}px`;
        omrSection.style.maxHeight = `${finalHeight}px`;

        // OMR 그리드 높이도 조정
        const omrGrid = document.getElementById('omr-grid');
        if (omrGrid) {
            omrGrid.style.height = `${finalHeight - 60}px`; // 헤더 높이 빼기
        }
    }

    // 모바일 OMR 닫기
    closeMobileOMR() {
        const omrSection = document.querySelector('.omr-section');
        const toggleBtn = document.getElementById('mobile-omr-toggle');

        omrSection.classList.remove('mobile-open');
        toggleBtn.innerHTML = `✏️ 답안 작성 (답안: <span id="mobile-answered">${Object.keys(this.userAnswers).length}</span>/50)`;
        toggleBtn.classList.remove('open');
    }

    // 정답 확인 (개발자 도구 콘솔에서 사용)
    showCorrectAnswers() {
        console.log(`=== 제${this.currentExam.round}회 시험 정답 ===`);
        console.table(this.correctAnswers);
    }
}

// 앱 시작
let omrApp;
window.addEventListener('load', () => {
    omrApp = new OMRQuizApp();

    // 개발자 도구 콘솔 안내
    console.log('%c한국사능력검정시험 OMR 앱', 'font-size: 16px; font-weight: bold; color: #8B1538;');
    console.log('현재 정답 확인: omrApp.showCorrectAnswers()');
    console.log('시험 변경: 상단의 드롭다운에서 선택');
});
