async function loadQuestions() {
  try {
    // Fetch questions from the backend API
    const res = await fetch('https://student-teacher-api.onrender.com/questions');
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const questions = await res.json();

    // Get the quiz form element and clear it before adding new questions
    const quizForm = document.getElementById('quizForm');
    quizForm.innerHTML = ''; 

    // Loop through each question and create HTML elements
    questions.forEach((q, index) => {
      const div = document.createElement('div');
      div.classList.add('question-box');
      div.innerHTML = `<strong>Q${index + 1}: ${q.question}</strong><br>`;

      q.options.forEach(opt => {
        div.innerHTML += `
          <label>
            <input type="radio" name="${q._id}" value="${opt}"> ${opt}
          </label><br>`;
      });

      // Append the question box to the form
      quizForm.appendChild(div);
      quizForm.appendChild(document.createElement('br'));
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

async function submitAnswers() {
  const studentName = document.getElementById('studentName').value;
  if (!studentName) return alert('Please enter your name');

  const responses = [];
  
  // Collect all selected answers
  document.querySelectorAll('form input[type=radio]:checked').forEach(input => {
    responses.push({
      questionId: input.name,
      selectedOption: input.value
    });
  });

  try {
    // Submit the answers to the backend API
    const res = await fetch('https://student-teacher-api.onrender.com/submit-answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, responses })
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await res.json();

    // Create HTML content for the result
    let resultHtml = `<h3>You scored ${result.score} out of ${result.total}</h3><hr>`;

    result.responses.forEach((response, index) => {
      const answerFeedback = response.isCorrect
        ? `<span style="color: green;">✅ Correct!</span>`
        : `<span style="color: red;">❌ Incorrect. Correct answer: <strong>${response.correctAnswer}</strong></span>`;

      resultHtml += `
        <p><strong>Question ${index + 1}:</strong> ${answerFeedback}</p>`;
    });

    // Display the result
    document.getElementById('result').innerHTML = resultHtml;
  } catch (error) {
    console.error('Error submitting answers:', error);
  }
}

// Load questions when the page is loaded
window.onload = loadQuestions;
