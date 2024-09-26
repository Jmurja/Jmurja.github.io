// Menu mobile toggle
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const menuOpenIcon = document.getElementById('menu-open-icon');
const menuCloseIcon = document.getElementById('menu-close-icon');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
  menuOpenIcon.classList.toggle('hidden');
  menuCloseIcon.classList.toggle('hidden');
});

// Scroll suave ao clicar nos links da navbar
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.add('hidden'); // Fecha o menu ao clicar
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  });
});

// Botão de voltar ao topo
const topButton = document.getElementById('top-button');

// Exibir o botão ao rolar
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    topButton.classList.remove('hidden');
  } else {
    topButton.classList.add('hidden');
  }
});

// Voltar ao topo ao clicar no botão
topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Alternar tema (dark/light) com preferência do usuário
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
});