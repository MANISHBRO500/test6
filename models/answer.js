const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  studentName: String,
  responses: [
    {
      questionId: mongoose.Schema.Types.ObjectId,
      selectedOption: String,
    }
  ],
  score: Number
});

module.exports = mongoose.model('Answer', AnswerSchema);
