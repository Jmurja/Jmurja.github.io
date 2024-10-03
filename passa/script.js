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
  const currentQuestion = questions[currentQuestionIndex]; // Pegar a pergunta atual
  document.getElementById('buzzer-question').innerText = currentQuestion.question; // Mostrar a pergunta no buzzer
  
  let buzzerButtonTeamA = document.getElementById('buzzer-button-team-a');
  let buzzerButtonTeamB = document.getElementById('buzzer-button-team-b');
  
  let buzzerPressed = false;
  
  buzzerButtonTeamA.addEventListener('touchstart', handleTouchStart);
  buzzerButtonTeamB.addEventListener('touchstart', handleTouchStart);
  
  buzzerButtonTeamA.addEventListener('touchend', handleTouchEnd);
  buzzerButtonTeamB.addEventListener('touchend', handleTouchEnd);
  
  function handleTouchStart(e) {
    e.preventDefault();  // Prevenir comportamento padrão
    buzzerPressed = true;  // Marcar que o buzzer foi pressionado
  }
  
  function handleTouchEnd(e) {
    e.preventDefault();  // Prevenir comportamento padrão
    if (!buzzerPressed) return;
    buzzerPressed = false;
    let releasedElement = e.target.id;
    
    if (releasedElement === 'buzzer-button-team-a') {
      currentTeam = 'Time A';
    } else if (releasedElement === 'buzzer-button-team-b') {
      currentTeam = 'Time B';
    }
    
    proceedToQuestion();
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
    button.addEventListener('click', () => checkAnswer(option.charAt(0)));
    optionsContainer.appendChild(button);
  });
  
  hasPassed = false;
  passCount = 0;
  document.getElementById('pass-button').innerText = 'Passar';
  document.getElementById('pass-button').classList.remove('hidden');
  
  startResponseTimer();
}

function startResponseTimer() {
  // Primeiro, limpar qualquer intervalo existente para evitar múltiplos timers
  clearInterval(responseTimer);
  
  let timeLeft = 30; // Reiniciar o tempo para 30 segundos
  document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
  
  // Criar um novo intervalo de 1 segundo
  responseTimer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Tempo restante: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(responseTimer);  // Limpar o intervalo ao fim do tempo
      
      if (passCount === 2) {
        // Se for o segundo "Passar/Repassar" e o tempo acabar, subtrair pontos
        if (currentTeam === 'Time A') {
          teamAScore -= 5;
        } else {
          teamBScore -= 5;
        }
        updateScores();
        showOverlay('Tempo esgotado. -5 pontos.', nextQuestion);
      } else {
        passQuestion(); // Se for o primeiro passar, passar a pergunta normalmente
      }
    }
  }, 1000);
}

function checkAnswer(selectedOption) {
  clearInterval(responseTimer); // Limpar o intervalo ao responder corretamente
  
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

document.getElementById('pass-button').addEventListener('click', passQuestion);

function passQuestion() {
  clearInterval(responseTimer); // Limpar o intervalo ao passar a pergunta
  
  passCount++;
  
  if (passCount === 1) {
    hasPassed = true;
    document.getElementById('pass-button').innerText = 'Repassar';
    currentTeam = currentTeam === 'Time A' ? 'Time B' : 'Time A';
    showOverlay(`Pergunta passada para ${currentTeam}.`, startResponseTimer); // Reiniciar o timer
    updateScores();
  } else if (passCount === 2) {
    document.getElementById('pass-button').classList.add('hidden');
    currentTeam = originalTeam;
    showOverlay(`${currentTeam}, você deve responder agora.`, startResponseTimer); // Reiniciar o timer
    updateScores();
  }
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
    startBuzzer();
  } else {
    endGame();
  }
}

function endGame() {
  let winnerMessage = '';
  
  // Verifica quem é o vencedor
  if (teamAScore > teamBScore) {
    winnerMessage = `Time A venceu! 🎉<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  } else if (teamBScore > teamAScore) {
    winnerMessage = `Time B venceu! 🎉<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  } else {
    winnerMessage = `Empate!<br>Pontuação:<br>Time A: ${teamAScore}<br>Time B: ${teamBScore}`;
  }
  
  // Mostra o card e ao mesmo tempo dispara os confetes e toca o áudio
  showOverlay(winnerMessage, () => {
    // Resetar o jogo
    currentQuestionIndex = 0;
    currentTeam = '';
    originalTeam = '';
    teamAScore = 0;
    teamBScore = 0;
    passCount = 0;
    updateScores();
    document.getElementById('start-screen').classList.remove('hidden');
  });
  
  // Disparar confetes e tocar som
  const confettiSound = new Audio('confetti-sound.wav');
  confettiSound.play(); // Reproduzir o som
  
  // Explosão de confetes quando o overlay aparecer
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 }
  });
}