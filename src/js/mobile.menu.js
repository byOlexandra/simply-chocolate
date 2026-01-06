export default function mobileMenu() {
    const open = document.querySelector('[data-menu-open]');
    const close = document.querySelector('[data-menu-close]');
    const menu = document.querySelector('[data-menu]')

    if (!menu) return;

    open?.addEventListener('click', () => menu.classList.add('is-open'));
    close?.addEventListener('click', () => menu.classList.remove('is-open')); 
} 