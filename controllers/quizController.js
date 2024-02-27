const Question = require("../models/Question");

async function render_quiz(req, res) {
    const language = req.cookies.language || "en";
    const user = req.session.user;
    res.render("quiz", { language, user });
}

async function quiz_results(req, res) {
    const userAnswers = req.body.answers;
    let score = 0;
    try {
        const questions = await Question.find({ language: req.cookies.language || "en" });
        questions.forEach((question, index) => {
            if (question.options[userAnswers[index] - 1] === question.answer) {
                score++;
            }
        });
        res.json({ score });
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function quiz_questions(req, res) {
    try {
        const questions = await Question.find({ language: req.cookies.language || "en" });
        res.json({ questions });
    } catch (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { render_quiz, quiz_results, quiz_questions };
