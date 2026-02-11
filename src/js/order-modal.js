import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import * as yup from 'yup';
import IMask from 'imask';

const openOrder = document.querySelector('#open-order-modal');
const backdrop = document.querySelector('.order-backdrop');
const closeBtn = document.querySelector('#closeOrderModal');
const modalChocolateList = document.querySelector('#modalChocolateList');
const selectedChocInput = document.getElementById('selectedChocInput');
const orderForm = document.getElementById('orderForm');
const deliverySelect = document.getElementById('deliveryMethod');
const dynamicContainer = document.getElementById('dynamic-fields-container');
const phoneInput = document.getElementById('userPhone');
const basketIcon = document.querySelector('[data-open-order]')

const deliveryWays = ['nova_poshta', 'courier', 'pickup'];

const schema = yup.object().shape({
  customer_name: yup
    .string()
    .required('Your name is required')
    .min(2, 'At least 2 letters'),
  customer_phone: yup
    .string()
    .required('Enter your phone')
    .test('len', 'Invalid phone number', val => {
      const clean = val.replace(/\D/g, '');
      return clean.length === 12;
    }),
  customer_email: yup.string().required('You email is required').email(),
  delivery_method: yup
    .string()
    .oneOf(deliveryWays)
    .required('Choose a delivery method'),
  customer_npoffice: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    )
    .when('delivery_method', {
      is: 'nova_poshta',
      then: schema => schema.required('Enter an office number'),
      otherwise: schema => schema.notRequired(),
    }),
  customer_address: yup.string().when('delivery_method', {
    is: 'courier',
    then: schema => schema.required('Enter address'),
    otherwise: schema => schema.notRequired(),
  }),
  customer_city: yup.string().required('Enter a city'),
  customer_comment: yup.string().max(250, 'Must be less than 250 letters'),
  is_gift: yup.boolean(),
});

const clearErrorMessages = () =>
  document
    .querySelectorAll('.review-modal__error-message')
    .forEach(el => (el.textContent = ''));

const toggleModal = (backdrop, isOpen) => {
  backdrop.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : 'visible';
};

export async function fetchChocolateData() {
  initOrderModal()
  try {
    const res = await fetch('./chocolates.json');
    if (!res.ok) {
      throw new Error(
        `HTTP error! Status: ${res.status}. Check if file path is correct.`
      );
    }
    const data = await res.json();
    renderModalOptions(data);
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}

function renderModalOptions(chocolates) {
  if (!modalChocolateList) return;

  modalChocolateList.innerHTML = chocolates
    .map(
      item => `
            <div class="order__choc-option" data-name="${item.name}">
            <p class="order__choc-name">${item.name}</p>
            <p class="order__choc-type">Type: ${item.type}</p>
        </div>`
    )
    .join('');
  setupSelectionLogic();
  setupDeliveryLogic();
}

function setupSelectionLogic() {
  const options = document.querySelectorAll('.order__choc-option');

  options.forEach(option => {
    option.addEventListener('click', () => {
      if (option.classList.contains('order__choc-option--selected')) {
        option.classList.remove('order__choc-option--selected');
      } else {
        option.classList.add('order__choc-option--selected');
      }

      const productName = option.getAttribute('data-name');
      selectedChocInput.value = productName;

      console.log(`Selected: ${productName}`);
    });
  });
}

function setupDeliveryLogic() {
  deliverySelect.addEventListener('change', e => {
    const method = e.target.value;

    dynamicContainer.innerHTML = '';

    if (method === 'nova_poshta') {
      dynamicContainer.innerHTML = `
      <div class="order__form-group">
        <label class="order__label" for="npOffice">Post Office Number</label>
        <input class="order__input" type="text" id="npOffice" name="customer_npoffice" placeholder="e.g. 1545" />
        <span class="order__error-message" id="error-customer_npoffice"></span>
      </div>
    `;
    } else {
      dynamicContainer.innerHTML = `
      <div class="order__form-group">
            <label class="order__label" for="userAddress">Address</label>
            <input class="order__input" type="text" id="userAddress" name="customer_address"
                placeholder="e.g. Ukrainska street" />
                <span class="order__error-message" id="error-customer_address"></span>
        </div>
    `;
    }
  });
}

const maskOptions = {
  mask: '+{38}(000)000-00-00',
  lazy: false,
};
const mask = IMask(phoneInput, maskOptions);

function handleSubmission() {
  if (orderForm) {
    orderForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!selectedChocInput.value) {
        notyf.error('Please choose a chocolate first');
        return
      }

      clearErrorMessages();

      const formData = new FormData(orderForm);
      const orderDetails = Object.fromEntries(formData.entries());

      orderDetails.customer_phone = mask.value;
      orderDetails.is_gift = orderForm.elements.is_gift.checked;

      try {
        await schema.validate(orderDetails, { abortEarly: false });
        notyf.success(
          `Thank you, ${orderDetails.customer_name}! Your order for ${orderDetails.selected_chocolate} has been received.`
        );
        orderForm.reset();
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
}

function initOrderModal() {
  if (basketIcon) {
    basketIcon.addEventListener('click', e => {
      toggleModal(backdrop, true);
      orderForm.reset();
      mask.value = '';
      mask.updateValue();

      clearErrorMessages();
    })
  }
  if (openOrder && backdrop) {
    openOrder.addEventListener('click', () => {
      toggleModal(backdrop, true);
      orderForm.reset();
      mask.value = '';
      mask.updateValue();

      clearErrorMessages();
    });
  }

  closeBtn.addEventListener('click', () => {
    toggleModal(backdrop, false);
  });
  backdrop.addEventListener('click', e => {
    if (e.target === e.currentTarget) {
      toggleModal(backdrop, false);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Escape' && backdrop.classList.contains('is-open')) {
      toggleModal(backdrop, false);
    }
  });
  handleSubmission();
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
