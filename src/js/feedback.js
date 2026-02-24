import { reviews } from './data/reviewsData';
import femaleUsers from './data/names.json';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const STORAGE_KEY = 'reviews_data_new';
const feedbackList = document.querySelector('.feedback__list');

export default async function fetchUsers() {
  const cachedData = localStorage.getItem(STORAGE_KEY);
  if (cachedData) {
    renderReviews(JSON.parse(cachedData));
    return;
  }

  const combinedReviews = reviews.map((review, index) => {
    const user = femaleUsers[index % femaleUsers.length];
    const userName = user.name;

    const imageId = (index % 70) + 1;

    return {
      ...review,
      name: userName,
      photo: `https://xsgames.co/randomusers/assets/avatars/female/${imageId}.jpg`,
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedReviews));

  renderReviews(combinedReviews);
}

function initSwiper() {
  new Swiper('.swiper', {
    modules: [Navigation, Pagination],
    loop: true,
    slidesPerView: 1,
    centeredSlides: true,

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
      1440: { slidesPerView: 3 },
    },
  });
}

function reviewTemplate(obj) {
  return `
        <div class='swiper-slide'>
        <div class='feedback__list-item'>
            <img class="feedback__list-item-image" src="${obj.photo}" alt="${obj.name}" />
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