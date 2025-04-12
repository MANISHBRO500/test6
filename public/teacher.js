let optionCount = 1;

function addOption() {
  optionCount++;
  const div = document.createElement('div');
  div.innerHTML = `<input type="text" class="option" placeholder="Option ${optionCount}" required><br>`;
  document.getElementById('optionsContainer').appendChild(div);
}

document.getElementById('questionForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const question = document.getElementById('question').value;
  const options = Array.from(document.querySelectorAll('.option')).map(opt => opt.value);
  const answer = document.getElementById('answer').value;

  const res = await fetch('https://test6-xhu7.onrender.com/add-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, options, answer }),
  });

  if (res.ok) {
    alert('Question added!');
    document.getElementById('questionForm').reset();
    document.getElementById('optionsContainer').innerHTML =
      '<input type="text" class="option" placeholder="Option 1" required><br>';
    optionCount = 1;
    loadQuestions(); // Refresh list
  } else {
    alert('Failed to add question.');
  }
});

async function loadQuestions() {
  const res = await fetch('https://test6-xhu7.onrender.com/questions');
  const questions = await res.json();
  const container = document.getElementById('questionList');
  container.innerHTML = '';

  questions.forEach(q => {
    const div = document.createElement('div');
    div.innerHTML = `
      <div style="padding:10px; margin-bottom:10px; border:1px solid #ccc; border-radius:8px;">
        <strong>${q.question}</strong><br>
        Options: ${q.options.join(', ')}<br>
        Answer: ${q.answer}<br>
        <button onclick="deleteQuestion('${q._id}')">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function deleteQuestion(id) {
  if (confirm('Are you sure you want to delete this question?')) {
    const res = await fetch(`https://test6-xhu7.onrender.com/delete-question/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Question deleted.');
      loadQuestions();
    } else {
      alert('Failed to delete.');
    }
  }
}

window.onload = loadQuestions;
