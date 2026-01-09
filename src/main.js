import './main.scss'
import mobileMenu from './js/mobile.menu';
import { toggleTheme, initHeaderScroll } from './js/header';

document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    toggleTheme();
    initHeaderScroll();
})