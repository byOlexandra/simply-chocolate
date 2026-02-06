import * as yup from 'yup';
import IMask from 'imask';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
    duration: 2000,
    position: { x: 'center', y: 'top' },
    types: [
      {
        type: 'success',
        background: '#FD9222',
        duration: 4000,
      },
    ],
  });

const clearErrorMessages = () =>
  document
    .querySelectorAll('.review-modal__error-message')
    .forEach(el => (el.textContent = ''));


const schema = yup.object().shape({
username: yup
    .string()
    .required('Your name is required')
    .min(2, 'At least 2 letters'),
email: yup.string().required('You email is required').email(),
phone: yup
    .string()
    .required('Enter your phone')
    .test('len', 'Invalid phone number', val => {
    const clean = val.replace(/\D/g, '');
    return clean.length === 12;
    }),
comment: yup
    .string()
    .max(250, 'Must be less than 250 letters')
    .required('Enter your thoughts'),
terms: yup
    .boolean()
    .oneOf([true], 'You must agree with terms')
    .required('You must agree with terms'),
});

const toggleModal = (backdrop, isOpen) => {
    backdrop.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'visible';
}

export function initReviewModal() {
  const backdrop = document.querySelector('.review-backdrop');
  const openModalBtn = document.querySelector('#leaveReviewBtn');
    const closeModalBtn = document.querySelector('#closeModal');
    const form = document.querySelector('.review-modal__form');
    const phoneInput = document.getElementById('phone');
    
    if (!form || !phoneInput || !backdrop) return;

    const maskOptions = {
    mask: '+{38}(000)000-00-00',
    lazy: false,
    };
    const mask = IMask(phoneInput, maskOptions);

  openModalBtn.addEventListener('click', () => {
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    form.reset();
    mask.value = '';
    mask.updateValue();

      clearErrorMessages();
      toggleModal(backdrop, true)
  });

  closeModalBtn.addEventListener('click', () => {
      toggleModal(backdrop, false);
  });

  backdrop.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
        toggleModal(backdrop, false)
    }
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Escape' && backdrop.classList.contains('is-open')) {
      toggleModal(backdrop, false)
    }
  });

    form.addEventListener('submit', async e => {      
    e.preventDefault();
    clearErrorMessages();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.phone = mask.value;
    data.terms = form.elements.terms.checked;

    console.log(data);

    try {
      await schema.validate(data, { abortEarly: false });

      notyf.success('Your review has been successfully saved!');

      form.reset();
      mask.value = '';
      mask.updateValue();
    } catch (error) {
      if (error.inner) {
        error.inner.forEach(err => {
          const errSpan = document.querySelector(`#error-${err.path}`);
          if (errSpan) errSpan.textContent = err.message;
        });
      }
    }
  });
}
