const menu = document.querySelector('[data-menu]');
const open = document.querySelector('[data-menu-open]');
const close = document.querySelector('[data-menu-close]');
const header = document.querySelector('#header');
const theme = document.getElementById('theme-toggle')

export default function mobileMenu() {
  if (!menu) return;

  close.addEventListener('click', closeMenu);
  open.addEventListener('click', openMenu);

  menu.addEventListener('click', e => {
    if (e.target.closest('.mm__list-a-item')) {
      closeMenu();
    }
  });
  
  window.addEventListener('keydown', e => {
    if (e.code === 'Escape') closeMenu();
  });

  menu.addEventListener('click', e => {
    const isClickOnContent =
      e.target.closest('.mm__list') ||
      e.target.closest('.mm__close-btn') ||
      e.target.closest('.mm__sm-list');
    if (!isClickOnContent) {
      closeMenu();
    }
  });


}

  theme.addEventListener('keydown', e => {
  if (e.code === 'Enter') {
    theme.click();
  }
});

export const closeMenu = () => {
  if (!menu) return;
  menu.classList.remove('is-open');
  document.body.style.overflow = '';
  if (header) header.style.position = 'fixed';
};

const openMenu = () => {
  if (!menu) return;
  menu.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};
