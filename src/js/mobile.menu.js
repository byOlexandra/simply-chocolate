const menu = document.querySelector('[data-menu]');
const open = document.querySelector('[data-menu-open]');
const close = document.querySelector('[data-menu-close]');
const header = document.querySelector('#header');
 
export default function mobileMenu() {
  if (!menu) return;

    close.addEventListener('click', closeMenu)
    open.addEventListener('click', openMenu)

    menu.addEventListener('click', (e) => {
    if (e.target.closest('.mm__list-a-item')) {
      closeMenu();
    }
  });
}

const closeMenu = () => {
 if (!menu) return;
  menu.classList.remove('is-open');
  document.body.style.overflow = '';
  if (header) header.style.position = 'fixed';
};

const openMenu = () => {
   if (!menu) return; 
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

