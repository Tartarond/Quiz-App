const questions = [
    {
        question: "Test Question 1",
        answers: [
            {
                answer: "Test Answer 1.1",
                selected: false
            }, 
            {
                answer: "Test Answer 1.2",
                selected: false
            },
            {
                answer: "Test Answer 1.3",
                selected: false
            },
            {
                answer: "Test Answer 1.4",
                selected: false
            }
        ]
    },
    {
        question: "Test Question 2",
        answers: [
            "Test Answer 2.1", "Test Answer 2.2", "Test Answer 2.3", "Test Answer 2.4"
        ]
    }
]

const questionTitle = document.getElementById("question_title")
const answerButtons = document.getElementById("answers")
const confirmButton = document.getElementById("confirm")
const nextButton = document.getElementById("next")
const previousButton = document.getElementById("previous")

let questionCounter = 0;
let correctAnswers = 0;

function startQuiz() {
    questionCounter = 0;
    correctAnswers = 0;
    confirmButton.innerHTML = "Bestätigen";
    nextButton.addEventListener("click", nextButtonClicked)
    previousButton.addEventListener("click", previousButtonClicked)
    showQuestion()
}

function nextButtonClicked() {
    if(questionCounter < questions.length-1) {
        questionCounter++;
    }
    console.log(questionCounter)
    showQuestion()
}

function previousButtonClicked() {
    if(questionCounter > 0) {
        questionCounter--;
    }
    showQuestion()
}

function showQuestion() {
    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild)
    }
    let currentQuestion = questions[questionCounter]
    questionTitle.innerHTML = "Frage Nr. " + questionCounter + ": " + currentQuestion.question

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.answer;
        button.classList.add("button");
        answerButtons.appendChild(button);
        button.dataset.selected = answer.selected
        if(answer.selected) {
            button.classList.add("selected")
        }
        if(answer.selected) {
            button.addEventListener("click", unselectAnswer)
        } else {
            button.addEventListener("click", selectAnswer)
        }
    })
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