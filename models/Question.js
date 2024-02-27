const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    language: { type: String, enum: ["en", "ru"], required: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
