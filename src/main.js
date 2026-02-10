import './main.scss'
import mobileMenu from './js/mobile.menu';
import { toggleTheme, initHeaderScroll } from './js/header';
import initReviews from './js/feedback';
import { initReviewModal } from './js/review-modal';
import { initOrderModal } from './js/order-modal';

document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    initOrderModal()
    toggleTheme();
    initHeaderScroll();
    initReviews();
    initReviewModal();
})