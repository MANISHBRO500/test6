async function loadQuestions() {
  const res = await fetch('https://test6-xhu7.onrender.com/questions');
  const questions = await res.json();
  const quizForm = document.getElementById('quizForm');
  quizForm.innerHTML = ''; // Clear the quiz form before adding new questions

  questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>Q${index + 1}: ${q.question}</strong><br>`;
    
    q.options.forEach(opt => {
      div.innerHTML += `<label><input type="radio" name="${q._id}" value="${opt}"> ${opt}</label><br>`;
    });

    quizForm.appendChild(div);
    quizForm.appendChild(document.createElement('br'));
  });
}

async function submitAnswers() {
  const studentName = document.getElementById('studentName').value;
  if (!studentName) return alert('Please enter your name');

  const responses = [];
  document.querySelectorAll('form input[type=radio]:checked').forEach(input => {
    responses.push({
      questionId: input.name,
      selectedOption: input.value
    });
  });

  const res = await fetch('https://test6-xhu7.onrender.com/submit-answers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentName, responses })
  });

  const result = await res.json();
  
  // Display the result score
  let resultHtml = `<h3>You scored ${result.score} out of ${result.total}</h3>`;

  // Display feedback for each question
  result.responses.forEach((response, index) => {
    const questionDiv = document.createElement('div');
    
    // Display the question number and answer feedback
    const answerFeedback = response.isCorrect 
      ? `Correct answer!`
      : `Incorrect. The correct answer is: "${response.correctAnswer}"`;

    questionDiv.innerHTML = `<p><strong>Question ${index + 1}:</strong> ${answerFeedback}</p>`;
    
    resultHtml += questionDiv.outerHTML;
  });

  // Show the results in the result div
  document.getElementById('result').innerHTML = resultHtml;
}

window.onload = loadQuestions;
