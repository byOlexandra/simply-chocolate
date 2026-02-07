export default function mobileMenu() {
    const open = document.querySelector('[data-menu-open]');
    const close = document.querySelector('[data-menu-close]');
    const menu = document.querySelector('[data-menu]');
    const header = document.querySelector('#header');

    if (!menu) return;

    open?.addEventListener('click', () => {
        menu.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    });
    close?.addEventListener('click', () => {
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
        header.style.position = 'fixed';
    }); 
} 