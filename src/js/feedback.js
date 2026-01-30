import { reviews } from './data/reviewsData';

const url = 'https://randomuser.me/api/?results=10';
const feedbackList = document.querySelector('.feedback__list');

function reviewTemplate(obj) {
  return `
        <li class='feedback__list-item'>
            <img src="${obj.photo}" alt="picture of a person who left a review"/>
            <h3 class="feedback__username">${obj.name}</h3>
            <p class="feedback__text">${obj.text}</p>
        </li>
    `;
}

function renderReviews(arr) {
  if (!feedbackList) return;
  feedbackList.innerHTML = arr.map(reviewTemplate).join('');
}

async function fetchUsers() {
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
    renderReviews(combinedReviews);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

export default function initReviews() {
  fetchUsers();
}
