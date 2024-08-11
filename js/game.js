import formatData from "./helper.js"

const level = localStorage.getItem("level") || "medium"
const questionText = document.getElementById("question-text")
const answerList = document.querySelectorAll(".answer-text")
const loader = document.getElementById("loader");
const container = document.getElementById("container");
const scoreText = document.getElementById("score");
const finishButton = document.getElementById("finish-button");
const nextButton = document.getElementById("next-button");
const questionNumber = document.getElementById("question-number");
const questionLevel = document.getElementById("question-level");

const CORRECT_BUNUS = 10;
const URL = `https://opentdb.com/api.php?amount=10&difficulty=${level}&type=multiple`;

let formatedData = null;
let questionIndex = 0;
let correctAnswer = null;
let score = 0;
let isAccepted = true;

questionLevel.innerHTML = `
<p>
    Level : ${level}
</p>`;

const fetchData = async () => {
    const res = await fetch(URL);
    const json = await res.json();
    formatedData = formatData(json.results);
    formatedData.forEach((question, index) => {
        console.log(`Question ${index + 1}`, question.correctAnswerIndex + 1);
    });
    start();
}

const start = () => {
    showQuestion()
    loader.style.display = "none";
    container.style.display = "block";
}

const showQuestion = () => {
    questionNumber.innerHTML = questionIndex + 1;
    const { question, answers, correctAnswerIndex } =
        formatedData[questionIndex];
    correctAnswer = correctAnswerIndex;
    questionText.innerText = question;
    answerList.forEach((button, index) => {
        button.innerText = answers[index]
    })
}

const checkAnswer = (event, index) => {
    if (!isAccepted) return;
    isAccepted = false;

    const isCorrect = index === correctAnswer ? true : false;
    if (isCorrect) {
        event.target.classList.add("correct")
        score += CORRECT_BUNUS;
        scoreText.innerText = score;
    } else {
        event.target.classList.add("incorrect")
        answerList[correctAnswer].classList.add("correct");
    }
}

const nextHandler = () => {
    questionIndex++;
    if (questionIndex < formatedData.length) {
        isAccepted = true;
        removeClasses();
        showQuestion();
    } else {
        finishHandler();
    }
}

const finishHandler = () => {
    localStorage.setItem("score", JSON.stringify(score));
    window.location.assign("/end.html")
}

const removeClasses = () => {
    answerList.forEach(button => (button.className = "answer-text"))
}

window.addEventListener("load", fetchData)
nextButton.addEventListener("click", nextHandler)
finishButton.addEventListener("click", finishHandler)
answerList.forEach((button, index) => {
    button.addEventListener('click', (event) => checkAnswer(event, index))
})
