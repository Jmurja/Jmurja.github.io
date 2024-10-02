let currentQuestionIndex = 0;
let currentTeam = '';
let originalTeam = '';
let teamAScore = 0;
let teamBScore = 0;
let responseTimer;
let passCount = 0;
let hasPassed = false;
let simultaneousTouch = false;
let buzzerTimeout;

// Variáveis para armazenar o status do toque de cada imagem
let isTeamATouching = false;
let isTeamBTouching = false;
let teamThatReleased = ''; // Variável para armazenar o time que soltou a imagem

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
  
  if (currentTeam === 'Time A') {
    currentTeamElement.classList.add('text-red-600');
    currentTeamElement.classList.remove('text-blue-600');
  } else if (currentTeam === 'Time B') {
    currentTeamElement.classList.add('text-blue-600');
    currentTeamElement.classList.remove('text-red-600');
  }
}

document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('start-screen').classList.add('hidden');
  startCountdown();
});

function startCountdown() {
  let countdown = 3;
  document.getElementById('countdown-screen').classList.remove('hidden');
  document.getElementById('countdown').innerText = countdown;
  
  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      document.getElementById('countdown').innerText = countdown;
    } else {
      clearInterval(countdownInterval);
      document.getElementById('countdown-screen').classList.add('hidden');
      startBuzzer();
    }
  }, 1000);
}

function startBuzzer() {
  document.getElementById('buzzer-screen').classList.remove('hidden');
  
  let buzzerButtonTeamA = document.getElementById('buzzer-button-team-a');
  let buzzerButtonTeamB = document.getElementById('buzzer-button-team-b');
  
  buzzerButtonTeamA.addEventListener('touchstart', handleTouchStartTeamA);
  buzzerButtonTeamB.addEventListener('touchstart', handleTouchStartTeamB);
  buzzerButtonTeamA.addEventListener('touchend', handleTouchEndTeamA);
  buzzerButtonTeamB.addEventListener('touchend', handleTouchEndTeamB);
}

// Funções para detectar o início e fim do toque do Time A
function handleTouchStartTeamA(e) {
  e.preventDefault();
  isTeamATouching = true;
  checkSimultaneousTouch();
}

function handleTouchEndTeamA(e) {
  e.preventDefault();
  isTeamATouching = false;
  clearTimeout(buzzerTimeout);
  simultaneousTouch = false;
  
  if (teamThatReleased === '') {
    teamThatReleased = 'Time A';
    currentTeam = 'Time A';
    updateScores();
    setTimeout(showQuestion, 3000);  // Exibe a pergunta após 3 segundos
  }
}

function handleTouchStartTeamB(e) {
  e.preventDefault();
  isTeamBTouching = true;
  checkSimultaneousTouch();
}

function handleTouchEndTeamB(e) {
  e.preventDefault();
  isTeamBTouching = false;
  clearTimeout(buzzerTimeout);
  simultaneousTouch = false;
  
  if (teamThatReleased === '') {
    teamThatReleased = 'Time B';
    currentTeam = 'Time B';
    updateScores();
    setTimeout(showQuestion, 3000);  // Exibe a pergunta após 3 segundos
  }
}

function checkSimultaneousTouch() {
  if (isTeamATouching && isTeamBTouching && !simultaneousTouch) {
    simultaneousTouch = true;
    buzzerTimeout = setTimeout(() => {
      simultaneousTouch = false;
      document.getElementById('buzzer-screen').classList.remove('hidden');
    }, 3000);
  }
}

function startResponseTimer() {
  let timeLeft = 30;
  document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
  
  responseTimer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(responseTimer);
      passQuestion();  // Passa a pergunta para a outra equipe se o tempo esgotar
    }
  }, 1000);
}

function showQuestion() {
  document.getElementById('buzzer-screen').classList.add('hidden');
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
  
  startResponseTimer(); // Inicia o temporizador para responder
}

function passQuestion() {
  clearInterval(responseTimer);
  if (!hasPassed) {
    // Passa para a outra equipe
    currentTeam = currentTeam === 'Time A' ? 'Time B' : 'Time A';
    hasPassed = true;
    startResponseTimer();
    updateScores();
    document.getElementById('pass-button').classList.add('hidden');
  } else {
    // Se já foi passado, encerra a pergunta
    nextQuestion();
  }
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
  hasPassed = false;
  
  if (currentQuestionIndex < questions.length) {
    startBuzzer();
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
    passCount = 0;
    updateScores();
    document.getElementById('start-screen').classList.remove('hidden');
  });
}