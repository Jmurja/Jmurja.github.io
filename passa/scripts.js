let currentQuestionIndex = 0;
let currentTeam = '';
let originalTeam = '';
let teamAScore = 0;
let teamBScore = 0;
let responseTimer;
let passCount = 0;
let hasPassed = false;
let simultaneousTouch = false;
let passedAlready = false;
let buzzerCountdownStarted = false;
let isTeamATouching = false;
let isTeamBTouching = false;
let teamThatReleased = '';

const questions = [
  {
    question: 'Qual é a capital da França?',
    options: ['A) Berlim', 'B) Madrid', 'C) Paris', 'D) Roma'],
    answer: 'C'
  },
  {
    question: 'Qual é o maior planeta do nosso sistema solar?',
    options: ['A) Marte', 'B) Júpiter', 'C) Saturno', 'D) Vênus'],
    answer: 'B'
  },
  {
    question: 'Quem pintou a Mona Lisa?',
    options: ['A) Vincent van Gogh', 'B) Leonardo da Vinci', 'C) Pablo Picasso', 'D) Michelangelo'],
    answer: 'B'
  },
];

function updateScores() {
  const teamAScoreElement = document.getElementById('team-a-score');
  const teamBScoreElement = document.getElementById('team-b-score');
  const currentTeamElement = document.getElementById('current-team');
  
  teamAScoreElement.innerText = teamAScore;
  teamBScoreElement.innerText = teamBScore;
  currentTeamElement.innerText = currentTeam;
  
  teamAScoreElement.classList.remove('text-red-600', 'text-blue-600');
  teamBScoreElement.classList.remove('text-red-600', 'text-blue-600');
  
  if (currentTeam === 'Time A') {
    currentTeamElement.classList.add('text-red-600');
    currentTeamElement.classList.remove('text-blue-600');
    teamAScoreElement.classList.add('text-red-600');
    teamBScoreElement.classList.add('text-blue-600');
  } else if (currentTeam === 'Time B') {
    currentTeamElement.classList.add('text-blue-600');
    currentTeamElement.classList.remove('text-red-600');
    teamBScoreElement.classList.add('text-blue-600');
    teamAScoreElement.classList.add('text-red-600');
  } else {
    currentTeamElement.classList.remove('text-red-600', 'text-blue-600');
  }
}

document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('start-screen').classList.add('hidden');
  showBuzzer();
});

function showBuzzer() {
  document.getElementById('buzzer-screen').classList.remove('hidden');
  
  let buzzerButtonTeamA = document.getElementById('buzzer-button-team-a');
  let buzzerButtonTeamB = document.getElementById('buzzer-button-team-b');
  
  // Adicionando os eventos de toque e clique para melhor compatibilidade
  buzzerButtonTeamA.addEventListener('touchstart', handleTouchStartTeamA);
  buzzerButtonTeamA.addEventListener('mousedown', handleTouchStartTeamA); // Para desktop
  
  buzzerButtonTeamB.addEventListener('touchstart', handleTouchStartTeamB);
  buzzerButtonTeamB.addEventListener('mousedown', handleTouchStartTeamB); // Para desktop
  
  buzzerButtonTeamA.addEventListener('touchend', handleTouchEndTeamA);
  buzzerButtonTeamA.addEventListener('mouseup', handleTouchEndTeamA); // Para desktop
  
  buzzerButtonTeamB.addEventListener('touchend', handleTouchEndTeamB);
  buzzerButtonTeamB.addEventListener('mouseup', handleTouchEndTeamB); // Para desktop
}

function handleTouchStartTeamA(e) {
  e.preventDefault(); // Evitar o comportamento padrão para dispositivos de toque
  isTeamATouching = true; // Marcar que o Time A está pressionando
  console.log("Time A pressionou o buzzer");
}

function handleTouchStartTeamB(e) {
  e.preventDefault(); // Evitar o comportamento padrão para dispositivos de toque
  isTeamBTouching = true; // Marcar que o Time B está pressionando
  console.log("Time B pressionou o buzzer");
}

function handleTouchEndTeamA(e) {
  e.preventDefault();
  if (teamThatReleased === '') {
    teamThatReleased = 'Time A';
    currentTeam = 'Time A';
    updateScores();
  }
  if (!buzzerCountdownStarted) {
    startBuzzerCountdown();
  }
}

function handleTouchEndTeamB(e) {
  e.preventDefault();
  if (teamThatReleased === '') {
    teamThatReleased = 'Time B';
    currentTeam = 'Time B';
    updateScores();
  }
  if (!buzzerCountdownStarted) {
    startBuzzerCountdown();
  }
}

function startBuzzerCountdown() {
  buzzerCountdownStarted = true;
  
  let countdown = 3;
  const buzzerCountdownInterval = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(buzzerCountdownInterval);
      showQuestion();
    }
  }, 1000);
}

function showQuestion() {
  document.getElementById('question-screen').classList.remove('hidden');
  
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById('question').innerText = currentQuestion.question;
  
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  
  currentQuestion.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'bg-green-500 text-white px-6 py-3 rounded-lg text-lg';
    button.innerText = option;
    button.addEventListener('click', () => checkAnswer(option.charAt(0)));
    optionsContainer.appendChild(button);
  });
  
  startResponseTimer();
}

function checkAnswer(selectedOption) {
  clearInterval(responseTimer);
  const currentQuestion = questions[currentQuestionIndex];
  let message = '';
  
  if (selectedOption === currentQuestion.answer) {
    if (currentTeam === 'Time A') {
      teamAScore += 10;
    } else {
      teamBScore += 10;
    }
    message = 'Resposta correta!';
  } else {
    if (currentTeam === 'Time A') {
      teamAScore -= 5;
    } else {
      teamBScore -= 5;
    }
    message = 'Resposta incorreta!';
  }
  
  updateScores();
  showOverlay(message, nextQuestion);
}

function startResponseTimer() {
  let timeLeft = 30;
  document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
  
  responseTimer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(responseTimer);
      if (passedAlready) {
        if (currentTeam === 'Time A') {
          teamAScore -= 5;
        } else {
          teamBScore -= 5;
        }
        updateScores();
      }
      showOverlay('Tempo esgotado!', nextQuestion);
    }
  }, 1000);
}

function showOverlay(message, callback) {
  document.getElementById('overlay-content').innerHTML =
    `<p class="text-2xl mb-6">${message}</p>
    <button id="overlay-button" class="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl">
        OK
    </button>`;
  document.getElementById('overlay').classList.remove('hidden');
  
  document.getElementById('overlay-button').onclick = () => {
    document.getElementById('overlay').classList.add('hidden');
    if (callback) callback();
  };
}

function nextQuestion() {
  document.getElementById('question-screen').classList.add('hidden');
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    teamThatReleased = '';
    buzzerCountdownStarted = false;
    showBuzzer();
  } else {
    endGame();
  }
}

function endGame() {
  let finalMessage = `Fim do jogo!<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  showOverlay(finalMessage, () => {
    currentQuestionIndex = 0;
    currentTeam = '';
    teamAScore = 0;
    teamBScore = 0;
    updateScores();
    document.getElementById('start-screen').classList.remove('hidden');
  });
}