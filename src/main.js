import './main.scss'
import mobileMenu from './js/mobile-menu';
import { toggleTheme, initHeaderScroll, initIntersecting } from './js/header';
import fetchUsers from './js/feedback';
import { initReviewModal } from './js/review-modal';
import { fetchChocolateData } from './js/order-modal';
import initFooter from './js/footer';

document.addEventListener('DOMContentLoaded', () => {
    mobileMenu();
    fetchChocolateData()
    toggleTheme();
    initHeaderScroll();
    initIntersecting();
    fetchUsers();
    initReviewModal();
    initFooter()
})