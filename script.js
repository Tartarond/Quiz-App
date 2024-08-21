const questions = []

const questionTitle = document.getElementById("question_title")
const answerButtons = document.getElementById("answers")
const confirmButton = document.getElementById("confirm")
const nextButton = document.getElementById("next")
const previousButton = document.getElementById("previous")
const score = document.getElementById("score")
const questionResult = document.getElementById("question_result")
const finishButton = document.getElementById("finish")
const questionElement = document.getElementById("current_question")

const source = "data.json"

let questionCounter = 0;
let correctAnswers = 0;

function startQuiz() {
    questionCounter = 0;
    correctAnswers = 0;
    confirmButton.innerHTML = "Bestätigen";
    nextButton.addEventListener("click", nextButtonClicked)
    previousButton.addEventListener("click", previousButtonClicked)
    confirmButton.addEventListener("click", confirmButtonClicked)
    finishButton.addEventListener("click", finishButtonClicked)

    loadData().then(() => {
        showQuestion();
    }).catch(error => {
        console.error('Fehler beim Laden der Daten:', error);
    });
}

async function loadData() {
    try {
        const response = await fetch(source);

        if (!response.ok) {
            throw new Error('Netzwerkantwort war Fehlerhaft');
        }

        const data = await response.json();
        data.forEach( question => {
            questions.push(
                {
                    question: question.question,
                    answers: question.answers,
                    confirmed: false,
                    correctAnswer: false
                }
            )
        })
        console.log(questions)
    } catch (error) {
        console.error('Fehler beim Laden der JSON-Datei:', error);
    }
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
    questionTitle.innerHTML = (questionCounter+1) + ". " + currentQuestion.question

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

function finishButtonClicked() {
    while(questionElement.firstChild) {
        questionElement.removeChild(questionElement.firstChild)
    }
    const endingText = document.createElement("div")
    endingText.innerHTML = "Herzlichen Glückwunsch, Sie haben das Quiz abgeschlossen und dabei " + correctAnswers + " von " + questions.length + " möglichen Punkten erreicht."
    questionElement.appendChild(endingText)
}

startQuiz();