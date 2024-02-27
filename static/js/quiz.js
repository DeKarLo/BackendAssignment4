let timerInterval;
let remainingTime = 5 * 60;
let userAnswers = [];

document.getElementById("startQuiz").addEventListener("click", startQuiz);

function startQuiz() {
    document.getElementById("startQuiz").style.display = "none";
    document.getElementById("quizQuestions").style.display = "block";
    document.getElementById("endQuiz").style.display = "block";
    document.getElementById("timer").style.display = "block";

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    fetch("/quiz/questions")
        .then((response) => response.json())
        .then((data) => displayQuestions(data.questions));
}

function displayQuestions(questions) {
    const quizQuestionsDiv = document.getElementById("quizQuestions");
    quizQuestionsDiv.innerHTML = "";
    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.innerHTML = `<p>Question ${index + 1}: ${question.text}</p>
                 <input type="radio" name="answer${index}" value="1" class="btn-check" id="option1${index}">
                 <label class="btn btn-outline-primary" for="option1${index}">${question.options[0]}</label><br>
                 <input type="radio" name="answer${index}" value="2" class="btn-check" id="option2${index}">
                 <label class="btn btn-outline-primary" for="option2${index}">${question.options[1]}</label><br>
                 <input type="radio" name="answer${index}" value="3" class="btn-check" id="option3${index}">
                 <label class="btn btn-outline-primary" for="option3${index}">${question.options[2]}</label><br>
                 <input type="radio" name="answer${index}" value="4" class="btn-check" id="option4${index}">
                 <label class="btn btn-outline-primary" for="option4${index}">${question.options[3]}</label><br>`;
        quizQuestionsDiv.appendChild(questionDiv);
    });
}

function updateTimer() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById("timer").innerText = `Time Remaining: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    remainingTime--;
    if (remainingTime < 0) {
        clearInterval(timerInterval);
        finishQuiz();
    }
}

document.getElementById("endQuiz").addEventListener("click", finishQuiz);

function finishQuiz() {
    clearInterval(timerInterval);
    document.getElementById("quizQuestions").style.display = "none";
    document.getElementById("timer").style.display = "none";
    document.getElementById("endQuiz").style.display = "none";

    calculateResults();
}

function calculateResults() {
    const quizQuestions = document.querySelectorAll("#quizQuestions input[type=radio]");
    quizQuestions.forEach((question, index) => {
        if (question.checked) {
            userAnswers.push(question.value);
        }
    });
    fetch("/quiz/results", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: userAnswers }),
    })
        .then((response) => response.json())
        .then((data) => displayResults(data.score))
        .catch((error) => console.error("Error calculating results:", error));
}

function displayResults(score) {
    const resultDetails = document.getElementById("resultDetails");
    resultDetails.innerHTML = `<p>Your score: ${score}</p>`;
    document.getElementById("quizResults").style.display = "block";
}

document.getElementById("shareResultsTelegram").addEventListener("click", shareResultsTelegram);

function shareResultsTelegram() {
    const url = window.location.href;
    const quizResult = document.getElementById("resultDetails").innerText;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(quizResult)}`;
    window.open(telegramUrl, "_blank");
}
