const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const menuOpenIcon = document.getElementById('menu-open-icon');
const menuCloseIcon = document.getElementById('menu-close-icon');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('hidden');
  menuOpenIcon.classList.toggle('hidden');
  menuCloseIcon.classList.toggle('hidden');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    menu.classList.add('hidden'); // Fecha o menu ao clicar
    menuOpenIcon.classList.remove('hidden');
    menuCloseIcon.classList.add('hidden');
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const topButton = document.getElementById('top-button');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    topButton.classList.remove('hidden');
  } else {
    topButton.classList.add('hidden');
  }
});

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('load', () => {
  document.getElementById('loader').style.display = 'none';
});