// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  html.classList.add('dark');
}

const toggleTheme = () => {
  html.classList.toggle('dark');
  localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
};

if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu-link').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
    if (menuIcon) menuIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
  });
});

// Form handling
const joinForm = document.getElementById('join-form');
const formMessage = document.getElementById('form-message');

if (joinForm) {
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    if (formMessage) {
      formMessage.textContent = `✓ ${email} dodany do listy. Witamy na pokładzie!`;
      formMessage.classList.remove('hidden');
    }
    joinForm.reset();
    setTimeout(() => {
      if (formMessage) formMessage.classList.add('hidden');
    }, 5000);
  });
}

// Update copyright year
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) {
  copyrightYear.textContent = `AI_JAM © ${new Date().getFullYear()}`;
}
