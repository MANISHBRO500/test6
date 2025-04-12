const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String, // correct answer
});

module.exports = mongoose.model('Question', QuestionSchema);
