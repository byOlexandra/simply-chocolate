import './main.scss'
import mobileMenu from './js/mobile.menu';
import { toggleTheme, initHeaderScroll } from './js/header';
import initReviews from './js/feedback';

document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    toggleTheme();
    initHeaderScroll();
    initReviews()
})