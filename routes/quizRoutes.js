const express = require("express");
const { render_quiz, quiz_results, quiz_questions } = require("../controllers/quizController");

const router = express.Router();

router.get("/", render_quiz);
router.post("/results", quiz_results);
router.get("/questions", quiz_questions);

module.exports = router;
