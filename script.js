const questions = [
    {
        question: "Test Question 1",
        answers: [
            {
                answer: "Test Answer 1.1",
                correct: true
            }, 
            {
                answer: "Test Answer 1.2",
                correct: false
            },
            {
                answer: "Test Answer 1.3",
                correct: false
            },
            {
                answer: "Test Answer 1.4",
                correct: false
            }
        ],
        confirmed: false,
        correctAnswer: false
    },
    {
        question: "Test Question 2",
        answers: [
            {
                answer: "Test Answer 2.1",
                correct: true
            }, 
            {
                answer: "Test Answer 2.2",
                correct: false
            },
            {
                answer: "Test Answer 2.3",
                correct: false
            },
            {
                answer: "Test Answer 2.4",
                correct: false
            }
        ],
        confirmed: false,
        correctAnswer: false
    }
]

const questionTitle = document.getElementById("question_title")
const answerButtons = document.getElementById("answers")
const confirmButton = document.getElementById("confirm")
const nextButton = document.getElementById("next")
const previousButton = document.getElementById("previous")
const score = document.getElementById("score")
const questionResult = document.getElementById("question_result")

let questionCounter = 0;
let correctAnswers = 0;

function startQuiz() {
    questionCounter = 0;
    correctAnswers = 0;
    confirmButton.innerHTML = "Bestätigen";
    nextButton.addEventListener("click", nextButtonClicked)
    previousButton.addEventListener("click", previousButtonClicked)
    confirmButton.addEventListener("click", confirmButtonClicked)
    showQuestion()
}

function nextButtonClicked() {
    if(questionCounter < questions.length-1) {
        questionCounter++
    }
    showQuestion()
}

function previousButtonClicked() {
    if(questionCounter > 0) {
        questionCounter--
    }
    showQuestion()
}

function showQuestion() {
    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild)
    }
    let currentQuestion = questions[questionCounter]
    questionTitle.innerHTML = "Frage Nr. " + (questionCounter+1) + ": " + currentQuestion.question

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button")
        button.innerHTML = answer.answer
        button.classList.add("button")
        answerButtons.appendChild(button)
        button.dataset.selected = false
        if(currentQuestion.confirmed) {
            if(answer.correct) {
                button.classList.add("correct")
            } else {
                button.classList.add("wrong")
            }
        } else {
            button.addEventListener("click", selectAnswer)
        }
    })
    score.innerHTML = "Ergebnis: " + correctAnswers
    if(currentQuestion.confirmed) {
        questionResult.innerHTML = currentQuestion.correctAnswer ? "Korrekt!" : "Leider Falsch!"
        confirmButton.disabled = true
    } else {
        questionResult.innerHTML = ""
        confirmButton.disabled = false
    }
}

function confirmButtonClicked() {
    let currentQuestion = questions[questionCounter]
    let correctAnswer = true
    let answerCounter = 0
    answerButtons.childNodes.forEach(answerButton => {
        let currentAnswer = currentQuestion.answers[answerCounter]
        const selected = answerButton.dataset.selected === "true"
        if (selected !== currentAnswer.correct) {
            correctAnswer = false
        }
        answerCounter++
    })
    if(correctAnswer) {
        correctAnswers++
    }
    currentQuestion.confirmed = true
    currentQuestion.correctAnswer = correctAnswer
    showQuestion()
}

function selectAnswer(e) {
    const selectedButton = e.target
    selectedButton.classList.add("selected")
    selectedButton.dataset.selected = true
    selectedButton.addEventListener("click", unselectAnswer)
    selectedButton.removeEventListener("click", selectAnswer)
}

function unselectAnswer(e) {
    const selectedButton = e.target
    if (selectedButton.classList.contains("selected")){
        selectedButton.classList.remove("selected")
    }
    selectedButton.dataset.selected = false
    selectedButton.addEventListener("click", selectAnswer)
    selectedButton.removeEventListener("click", unselectAnswer)
}

startQuiz();