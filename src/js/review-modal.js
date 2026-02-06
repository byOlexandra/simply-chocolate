import * as yup from 'yup';
import IMask from 'imask';

export function initReviewModal() {
  const backdrop = document.querySelector('.review-backdrop');
  const openModalBtn = document.querySelector('#leaveReviewBtn');
  const closeModalBtn = document.querySelector('#closeModal');

  openModalBtn.addEventListener('click', () => {
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  closeModalBtn.addEventListener('click', () => {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = 'visible';
  });

  backdrop.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = 'visible';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = 'visible';
    }
  });

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

  const form = document.querySelector('.review-modal__form');

  const phoneInput = document.getElementById('phone');
  const maskOptions = {
    mask: '+{38}(000)000-00-00',
    lazy: false,
  };
  const mask = IMask(phoneInput, maskOptions);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    document
      .querySelectorAll('.review-modal__error-message')
      .forEach(el => (el.textContent = ''));

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.phone = mask.value;

    data.terms = form.elements.terms.checked;

      console.log(data);
      
      

    try {
      await schema.validate(data, { abortEarly: false });
        
      form.reset();
      mask.value = '';
      mask.updateValue();
    } catch (error) {
      if (error.inner) {
        console.dir(error);
        error.inner.forEach(err => {
          const errSpan = document.querySelector(`#error-${err.path}`);
          if (errSpan) errSpan.textContent = err.message;
        });
      }
    }
  });
}
