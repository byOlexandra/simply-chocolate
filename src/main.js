import './main.scss'
import mobileMenu from './js/mobile.menu';
import { toggleTheme, initHeaderScroll } from './js/header';
import initReviews from './js/feedback';
import { initReviewModal } from './js/review-modal';
import { initOrderModal, fetchChocolateData } from './js/order-modal';
import initFooter from './js/footer';

document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    initOrderModal();
    fetchChocolateData()
    toggleTheme();
    initHeaderScroll();
    initReviews();
    initReviewModal();
    initFooter()
})