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

// path of the json file with the data
const source = "data.json"

// The number of the current question
let questionCounter = 0;
// The number of correctly answered questions
let correctAnswers = 0;

// set counters to 0, sets Event listeners, shows the first question, loads the quiz content from the json
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

// fetch the quiz contet from the given json
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

// load the next question
function nextButtonClicked() {
    if(questionCounter < questions.length-1) {
        questionCounter++
    }
    showQuestion()
}

// load the previous question
function previousButtonClicked() {
    if(questionCounter > 0) {
        questionCounter--
    }
    showQuestion()
}

// load the content of the current question
function showQuestion() {
    // remove the previous answer buttons
    while(answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild)
    }

    let currentQuestion = questions[questionCounter]
    
    // set the question title Element
    questionTitle.innerHTML = "Frage " + (questionCounter+1) + " von " + questions.length + ": " + currentQuestion.question
    // disable the previous button for first- and next button for last question
    previousButton.disabled = questionCounter === 0
    nextButton.disabled = questionCounter === questions.length-1

    //create answer buttons
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

    // Show the earned points
    score.innerHTML = "Ergebnis: " + correctAnswers
    // Show the result of the current question if already answered
    if(currentQuestion.confirmed) {
        questionResult.innerHTML = currentQuestion.correctAnswer ? "Korrekt!" : "Leider Falsch!"
        confirmButton.disabled = true
    } else {
        questionResult.innerHTML = ""
        confirmButton.disabled = false
    }

    finishButton.disabled = false
    questions.forEach(question => {
        if (!question.confirmed) {
            finishButton.disabled = true
        }
    })
}

// confirm the selected answers for the current question and check if the answer is correct
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

// set the corresponding answer to selected
function selectAnswer(e) {
    const selectedButton = e.target
    selectedButton.classList.add("selected")
    selectedButton.dataset.selected = true
    selectedButton.addEventListener("click", unselectAnswer)
    selectedButton.removeEventListener("click", selectAnswer)
}

// set the corresponding answer to unselected
function unselectAnswer(e) {
    const selectedButton = e.target
    if (selectedButton.classList.contains("selected")){
        selectedButton.classList.remove("selected")
    }
    selectedButton.dataset.selected = false
    selectedButton.addEventListener("click", selectAnswer)
    selectedButton.removeEventListener("click", unselectAnswer)
}

// finish the quiz, go to the end screen and show results
function finishButtonClicked() {
    while(questionElement.firstChild) {
        questionElement.removeChild(questionElement.firstChild)
    }
    const endingText = document.createElement("div")
    endingText.innerHTML = "Herzlichen Glückwunsch, Sie haben das Quiz abgeschlossen und dabei " + correctAnswers + " von " + questions.length + " möglichen Punkten erreicht."
    questionElement.appendChild(endingText)
}

startQuiz();