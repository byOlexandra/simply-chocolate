import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import * as yup from 'yup';

const schema = yup.object().shape({
  subscribe_input: yup.string().email('Invalid email format').required(),
});

export default function initFooter() {
  const submitionBtn = document.querySelector('.footer__sub-btn');
  const emailInput = document.querySelector('.footer__input');
  const errSpan = document.querySelector('.footer__error_subscribe');

  submitionBtn.addEventListener('click', async e => {
    e.preventDefault();
    try {
      const customerEmail = emailInput.value;
      await schema.validate(
        { subscribe_input: customerEmail },
        { abortEarly: false }
      );
      notyf.success('You signed up for our newsletter');
      emailInput.value = '';
      errSpan.textContent = '';
    } catch (error) {
      if (error.inner) {
        if (errSpan) errSpan.textContent = error.message;
      }
    }
  });
}

const notyf = new Notyf({
  duration: 2000,
  position: { x: 'center', y: 'top' },
  types: [
    {
      type: 'success',
      background: '#FD9222',
      duration: 4000,
    },
    {
      type: 'error',
      background: '#ff0000',
      duration: 4000,
    },
  ],
});
