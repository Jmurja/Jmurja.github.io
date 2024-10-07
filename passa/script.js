const correctAnswerSound = new Audio('sounds/Correct.mp3');
const buttonClickSound = new Audio('sounds/click.mp3');
const backgroundMusic = new Audio('sounds/background-music.mp3');
const timeUpSound = new Audio('sounds/timeFail.mp3');

let currentQuestionIndex = 0;
let currentTeam = '';
let originalTeam = '';
let teamAScore = 0;
let teamBScore = 0;
let responseTimer;
let passCount = 0;
let hasPassed = false;

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
  const currentQuestion = questions[currentQuestionIndex];
  document.getElementById('buzzer-question').innerText = currentQuestion.question;
  
  let buzzerButtonTeamA = document.getElementById('buzzer-button-team-a');
  let buzzerButtonTeamB = document.getElementById('buzzer-button-team-b');
  
  let buzzerPressed = false;
  
  buzzerButtonTeamA.addEventListener('touchstart', handleTouchStart);
  buzzerButtonTeamB.addEventListener('touchstart', handleTouchStart);
  
  buzzerButtonTeamA.addEventListener('touchend', handleTouchEnd);
  buzzerButtonTeamB.addEventListener('touchend', handleTouchEnd);
  
  function handleTouchStart(e) {
    e.preventDefault();
    buzzerPressed = true;
  }
  
  function handleTouchEnd(e) {
    e.preventDefault();
    if (!buzzerPressed) return;
    buzzerPressed = false;
    let releasedElement = e.target.id;
    
    const sirenSound = new Audio('sounds/siren.wav');
    let svgToShow = ''; // Variável para armazenar o SVG correto
    
    if (releasedElement === 'buzzer-button-team-a') {
      currentTeam = 'Time A';
      // Exibe o SVG verde para o Time A
      svgToShow = `<svg fill="#47ff1f" height="200px" width="200px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255.50 255.50" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 255.5 255.5" stroke="#47ff1f" stroke-width="7.664999999999999" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.533"></g><g id="SVGRepo_iconCarrier"> <g> <path d="m200.583,222.5h-6.333v-99.66c0-36.362-29.145-65.34-65.507-65.34h-0.32c-36.362,0-66.173,28.978-66.173,65.34v99.66h-6.667c-5.522,0-10.333,3.977-10.333,9.5v13c0,5.523 4.811,10.5 10.333,10.5h145c5.523,0 9.667-4.977 9.667-10.5v-13c0-5.523-4.145-9.5-9.667-9.5zm-72.16-141h-0.173v16h0.173c-14.248,0-25.84,12-25.84,26h-16c0-23 18.769-42 41.84-42z"></path> <path d="m128.25,33c4.418,0 8-3.582 8-8v-17c0-4.418-3.582-8-8-8s-8,3.582-8,8v17c0,4.418 3.582,8 8,8z"></path> <path d="m93.935,42.519c1.563,1.562 3.609,2.343 5.657,2.343 2.048,0 4.095-0.781 5.657-2.343 3.124-3.125 3.124-8.189 0-11.315l-12.02-12.021c-3.125-3.123-8.189-3.123-11.314,0-3.124,3.125-3.124,8.19 0,11.315l12.02,12.021z"></path> </g> </g></svg>`;
      showOverlay('Time A soltou o botão primeiro, ele irá responder.', proceedToQuestion, sirenSound, svgToShow);
    } else if (releasedElement === 'buzzer-button-team-b') {
      currentTeam = 'Time B';
      // Exibe o SVG amarelo para o Time B
      svgToShow = `<svg fill="#ffe32c" height="200px" width="200px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 255.50 255.50" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 255.5 255.5" stroke="#ffe32c" stroke-width="7.664999999999999" transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.533"></g><g id="SVGRepo_iconCarrier"> <g> <path d="m200.583,222.5h-6.333v-99.66c0-36.362-29.145-65.34-65.507-65.34h-0.32c-36.362,0-66.173,28.978-66.173,65.34v99.66h-6.667c-5.522,0-10.333,3.977-10.333,9.5v13c0,5.523 4.811,10.5 10.333,10.5h145c5.523,0 9.667-4.977 9.667-10.5v-13c0-5.523-4.145-9.5-9.667-9.5zm-72.16-141h-0.173v16h0.173c-14.248,0-25.84,12-25.84,26h-16c0-23 18.769-42 41.84-42z"></path> <path d="m128.25,33c4.418,0 8-3.582 8-8v-17c0-4.418-3.582-8-8-8s-8,3.582-8,8v17c0,4.418 3.582,8 8,8z"></path> <path d="m93.935,42.519c1.563,1.562 3.609,2.343 5.657,2.343 2.048,0 4.095-0.781 5.657-2.343 3.124-3.125 3.124-8.189 0-11.315l-12.02-12.021c-3.125-3.123-8.189-3.123-11.314,0-3.124,3.125-3.124,8.19 0,11.315l12.02,12.021z"></path> <path d="m157.575,44.861c2.048,0 4.096-0.781 5.657-2.344l12.02-12.022c3.124-3.124 3.124-8.189-0.001-11.313-3.125-3.125-8.191-3.124-11.314,0.001l-12.02,12.021c-3.124,3.124-3.124,8.189 0.001,11.314 1.563,1.563 3.609,2.343 5.657,2.343z"></path> </g> </g></svg>`;
      showOverlay('Time B soltou o botão primeiro, ele irá responder.', proceedToQuestion, sirenSound, svgToShow);
    }
  }
}

function proceedToQuestion() {
  document.getElementById('buzzer-screen').classList.add('hidden');
  originalTeam = currentTeam;
  showQuestion();
  updateScores();
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
    
    button.addEventListener('click', () => {
      buttonClickSound.play();
      checkAnswer(option.charAt(0));
    });
    
    optionsContainer.appendChild(button);
  });
  
  hasPassed = false;
  passCount = 0;
  document.getElementById('pass-button').innerText = 'Passar';
  document.getElementById('pass-button').classList.remove('hidden');
  
  startResponseTimer();
}

function startResponseTimer() {
  clearInterval(responseTimer);
  let timeLeft = 30;
  document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
  
  backgroundMusic.loop = true;
  backgroundMusic.play();
  
  responseTimer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(responseTimer);
      
      backgroundMusic.pause();
      timeUpSound.play();
      
      if (passCount === 2) {
        if (currentTeam === 'Time A') {
          teamAScore -= 5;
        } else {
          teamBScore -= 5;
        }
        updateScores();
        showOverlay('Tempo esgotado. -5 pontos.', nextQuestion);
      } else {
        passQuestion();
      }
    }
  }, 1000);
}

function checkAnswer(selectedOption) {
  clearInterval(responseTimer);
  
  const currentQuestion = questions[currentQuestionIndex];
  let message = '';
  
  backgroundMusic.pause();
  
  if (selectedOption === currentQuestion.answer) {
    correctAnswerSound.play();
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

document.getElementById('pass-button').addEventListener('click', passQuestion);

function passQuestion() {
  clearInterval(responseTimer);
  
  passCount++;
  
  buttonClickSound.play();
  
  if (passCount === 1) {
    hasPassed = true;
    document.getElementById('pass-button').innerText = 'Repassar';
    currentTeam = currentTeam === 'Time A' ? 'Time B' : 'Time A';
    
    showOverlay(`Pergunta passada para ${currentTeam}.`, startResponseTimer);
    updateScores();
  } else if (passCount === 2) {
    document.getElementById('pass-button').classList.add('hidden');
    currentTeam = originalTeam;
    
    showOverlay(`${currentTeam}, você deve responder agora.`, startResponseTimer);
    updateScores();
  }
}

function showOverlay(message, callback, sound = null, svgContent = null) {
  // Define o conteúdo do overlay com a mensagem centralizada
  document.getElementById('overlay-content').innerHTML = `<p class="text-2xl mb-6 text-center">${message}</p>`;
  document.getElementById('overlay').classList.remove('hidden'); // Mostra o overlay
  
  // Reproduz o som, se houver
  if (sound) {
    sound.play();
  }
  
  // Se houver SVG, insere-o centralizado
  if (svgContent) {
    // Adiciona o SVG com um contêiner flex para centralizá-lo
    const svgContainer = `<div style="display: flex; justify-content: center; align-items: center;">${svgContent}</div>`;
    document.getElementById('overlay-content').innerHTML += svgContainer;
  }
  
  // Oculta o overlay após o tempo especificado (3 segundos)
  setTimeout(() => {
    document.getElementById('overlay').classList.add('hidden');
    if (callback) callback(); // Executa o callback quando o overlay é ocultado
  }, 3000); // Tempo do overlay visível
}

function nextQuestion() {
  document.getElementById('question-screen').classList.add('hidden');
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    startBuzzer();
  } else {
    endGame();
  }
}

function endGame() {
  let winnerMessage = '';
  
  if (teamAScore > teamBScore) {
    winnerMessage = `Time A venceu! 🎉<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  } else if (teamBScore > teamAScore) {
    winnerMessage = `Time B venceu! 🎉<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  } else {
    winnerMessage = `Empate!<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  }
  
  showOverlay(winnerMessage, () => {
    currentQuestionIndex = 0;
    currentTeam = '';
    originalTeam = '';
    teamAScore = 0;
    teamBScore = 0;
    passCount = 0;
    updateScores();
    document.getElementById('start-screen').classList.remove('hidden');
  });
  
  const confettiSound = new Audio('confetti-sound.mp3');
  const WinnerCompleteSound = new Audio('sounds/WinnerComplete.mp3');
  confettiSound.play();
  WinnerCompleteSound.play();
  
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });
}