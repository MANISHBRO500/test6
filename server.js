const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // <-- load environment variables

const Question = require('./models/Question');
const Answer = require('./models/Answer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB using .env value
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add a question (Teacher)
app.post('https://test6-xhu7.onrender.com/add-question', async (req, res) => {
  const { question, options, answer } = req.body;
  const q = new Question({ question, options, answer });
  await q.save();
  res.send('Question saved!');
});

// Get all questions (Student)
app.get('https://test6-xhu7.onrender.com/questions', async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
});

// Submit student answers
app.post('https://test6-xhu7.onrender.com/submit-answers', async (req, res) => {
  const { studentName, responses } = req.body;

  let score = 0;
  const responseWithFeedback = [];
  const totalQuestions = responses.length;

  // Loop through responses and check each answer
  for (let r of responses) {
    const q = await Question.findById(r.questionId);
    if (q) {
      const isCorrect = q.answer === r.selectedOption;
      if (isCorrect) score++;
      responseWithFeedback.push({
        questionId: r.questionId,
        selectedOption: r.selectedOption,
        correctAnswer: q.answer,
        isCorrect,
      });
    }
  }

  const ans = new Answer({ studentName, responses, score });
  await ans.save();

  res.json({
    score,
    total: totalQuestions,
    responses: responseWithFeedback
  });
});

// Delete a question by ID (Teacher)
app.delete('https://test6-xhu7.onrender.com/delete-question/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.send('Question deleted');
  } catch (err) {
    res.status(500).send('Failed to delete question');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
