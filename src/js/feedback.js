import { reviews } from './data/reviewsData';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const STORAGE_KEY = 'reviews_data';
const url = 'https://randomuser.me/api/?results=10';
const feedbackList = document.querySelector('.feedback__list');

function reviewTemplate(obj) {
  return `
        <div class='swiper-slide'>
        <div class='feedback__list-item'>
            <img src="${obj.photo}" alt="picture of a person who left a review"/>
            <h3 class="feedback__username">${obj.name}</h3>
            <p class="feedback__text">${obj.text}</p>
        </div>
        </div>
        
    `;
}

function renderReviews(arr) {
  if (!feedbackList) return;
  feedbackList.innerHTML = arr.map(reviewTemplate).join('');

  initSwiper();
}

function initSwiper() {
    new Swiper('.swiper', {
      modules: [Navigation, Pagination],
      loop: true,
        slidesPerView: 1,
      observer: true,
        observeParents: true,
    centeredSlides: false, // Не центрувати слайд, щоб не бачити сусідні
  watchSlidesProgress: true,

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1440: { slidesPerView: 3 },
    },
  });
}

async function fetchUsers() {
  const cachedData = sessionStorage.getItem(STORAGE_KEY);
  if (cachedData) {
    renderReviews(JSON.parse(cachedData));
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const users = data.results;

    const combinedReviews = reviews.map((review, index) => ({
      ...review,
      name: `${users[index].name.first} ${users[index].name.last}`,
      photo: `${users[index].picture.large}`,
    }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(combinedReviews));
    renderReviews(combinedReviews);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

export default function initReviews() {
  fetchUsers();
}


