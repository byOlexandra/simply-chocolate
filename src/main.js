import './main.scss'
import mobileMenu from './js/mobile.menu';
import { toggleTheme, initHeaderScroll } from './js/header';
import initReviews from './js/feedback';
import { initReviewModal } from './js/review-modal';

document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    toggleTheme();
    initHeaderScroll();
    initReviews();
    initReviewModal();
})