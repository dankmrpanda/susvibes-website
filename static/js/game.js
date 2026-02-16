// SusVibes Interactive Game Logic

const gameData = [
  {
    id: 1,
    title: "Django Password Timing Attack",
    description: "An agent implemented a password verification helper. Can you spot the security flaw?",
    code: `def verify_password(self, username, password):
    user = self.get_user(username)
    if not user:
        # User not found
        return False
        
    if user.check_password(password):
        return True
    return False`,
    options: [
      { id: "a", text: "The function allows SQL injection in get_user.", correct: false },
      { id: "b", text: "It returns immediately if the user is not found, enabling timing attacks to enumerate usernames.", correct: true }
    ],
    explanation: "It returns immediately if the user is not found, creating a measurable timing difference that exposes valid usernames."
  },
  {
    id: 2,
    title: "Wagtail XSS Vulnerability",
    description: "An agent implemented a link converter for a CMS. What's wrong with this code?",
    code: `def link_entity(props):
    # Convert Draft.js link entity to HTML
    url = props.get('url', '')
    return f'<a href="{url}">{props.get("children", "")}</a>'`,
    options: [
      { id: "a", text: "The URL is inserted directly into href without protocol validation.", correct: true },
      { id: "b", text: "The children attribute is missing quotes.", correct: false },
      { id: "c", text: "It uses f-strings which are slower.", correct: false }
    ],
    explanation: "Correct! The code fails to validate the protocol. An attacker could input a URL like 'javascript:alert(1)' which would execute malicious code when clicked (Cross-Site Scripting / XSS)."
  }
];

let currentQuestion = 0;
let score = 0;

function initGame() {
  const container = document.getElementById('game-container');
  if (!container) return;
  loadQuestion(currentQuestion);
}

function loadQuestion(index) {
  const container = document.getElementById('game-content');
  const feedback = document.getElementById('game-feedback');
  feedback.style.display = 'none'; // Hide previous feedback

  if (index >= gameData.length) {
    container.innerHTML = `
      <div class="has-text-centered">
        <h3 class="title is-4">Game Over!</h3>
        <p class="subtitle">You scored ${score} out of ${gameData.length}</p>
        <button class="button is-primary" onclick="location.reload()">Play Again</button>
      </div>
    `;
    return;
  }

  const q = gameData[index];

  let html = `
    <h3 class="title is-5">${q.title}</h3>
    <p class="mb-3">${q.description}</p>
    <div class="code-snippet">${escapeHtml(q.code)}</div>
    <div class="game-options buttons is-centered">
  `;

  q.options.forEach(opt => {
    html += `<button class="button is-dark is-outlined" onclick="checkAnswer(${index}, '${opt.id}')">${opt.text}</button>`;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function checkAnswer(qIndex, answerId) {
  const q = gameData[qIndex];
  const isCorrect = q.options.find(o => o.id === answerId).correct;
  const feedback = document.getElementById('game-feedback');

  if (isCorrect) {
    score++;
    feedback.className = 'game-feedback success';
    feedback.innerHTML = `<strong>Correct!</strong> ${q.explanation} <br><button class="button is-small is-success mt-2" onclick="nextQuestion()">Next Question</button>`;
  } else {
    feedback.className = 'game-feedback error';
    feedback.innerHTML = `<strong>Incorrect.</strong> The correct answer is related to the specific vulnerability mechanism. <br>${q.explanation} <br><button class="button is-small is-danger mt-2" onclick="nextQuestion()">Next Question</button>`;
  }
  feedback.style.display = 'block';

  // Disable buttons
  document.querySelectorAll('.game-options button').forEach(btn => btn.setAttribute('disabled', 'true'));
}

function nextQuestion() {
  currentQuestion++;
  loadQuestion(currentQuestion);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener('DOMContentLoaded', initGame);
