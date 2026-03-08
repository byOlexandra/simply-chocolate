import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import * as yup from 'yup';
import IMask from 'imask';
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';

const openOrder = document.querySelector('#open-order-modal');
const backdrop = document.querySelector('.order-backdrop');
const closeBtn = document.querySelector('#closeOrderModal');
const modalChocolateList = document.querySelector('#modalChocolateList');
const selectedChocInput = document.getElementById('selectedChocInput');
const orderForm = document.getElementById('orderForm');
const dynamicContainer = document.getElementById('dynamic-fields-container');
const phoneInput = document.getElementById('userPhone');
const basketIcons = document.querySelectorAll('[data-open-order]');

const STORAGE_KEY = 'order-form-state';

const deliveryWays = ['nova_poshta', 'courier', 'pickup'];

function initOrderModal() {
  const openActions = () => {
    toggleModal(backdrop, true);
    mask.value = '';
    initFormValues();
    clearErrorMessages();
  };

  if (basketIcons) {
    basketIcons.forEach(icon => {
      icon.addEventListener('click', openActions);
    });
  }

  if (openOrder && backdrop) {
    openOrder.addEventListener('click', openActions);
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

  initFormValues();
  handleSubmission();
}

orderForm.addEventListener('input', e => {
  const savedData = getSavedData();
  const { name, value, type, checked } = e.target;
  if (!name) return;
  if (name === 'customer_phone') {
    savedData[name] = mask.value;
  } else if (type === 'checkbox') {
    savedData[name] = checked;
  } else {
    savedData[name] = value;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedData));
});

export async function fetchChocolateData() {
  initOrderModal();
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
            <div class="order__choc-option" data-name="${item.name}" name="chocolate_chosen">
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
  const savedData = getSavedData();

  let selectedChocolates = Array.isArray(savedData.chocolate_chosen)
    ? savedData.chocolate_chosen
    : savedData.chocolate_chosen
      ? [savedData.chocolate_chosen]
      : [];

  if (savedData.chocolate_chosen) {
    options.forEach(option => {
      if (option.getAttribute('data-name') === savedData.chocolate_chosen) {
        option.classList.add('order__choc-option--selected');
      }
    });
  }

  selectedChocInput.value = selectedChocolates.join(', ');

  options.forEach(option => {
    option.addEventListener('click', () => {
      const productName = option.getAttribute('data-name');

      const isSelected = option.classList.toggle(
        'order__choc-option--selected'
      );

      if (isSelected) {
        if (!selectedChocolates.includes(productName)) {
          selectedChocolates.push(productName);
        }
      } else {
        selectedChocolates = selectedChocolates.filter(
          name => name !== productName
        );
      }

      selectedChocInput.value = selectedChocolates.join(', ');
      const data = getSavedData();
      data.chocolate_chosen = selectedChocolates;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
  });
}

function initFormValues() {
  const savedData = getSavedData();
  if (!savedData) return;

  Object.keys(savedData).forEach(key => {
    const field = orderForm.querySelector(`[name="${key}"]`);

    if (field) {
      if (key === 'customer_phone') {
        mask.value = savedData[key];
        mask.updateValue();
      } else if (field.type === 'checkbox') {
        field.checked = savedData[key];
      } else {
        field.value = savedData[key];
      }
    }
  });
}

let selectLibInstance;

function setupDeliveryLogic() {
  const savedData = getSavedData();
  const initialMethod = savedData.delivery_method || '';

  selectLibInstance = new TomSelect('#deliveryMethod', {
    create: false,
    // controlInput: false,
    allowEmptyOption: true,
    hidePlaceholder: false,
    placeholder: 'Select method',
    hidePlaceholder: true,
  });

  if (initialMethod) {
    selectLibInstance.setValue(initialMethod);
    renderDeliveryFields(initialMethod);
  } else {
    selectLibInstance.clear();
    renderDeliveryFields('');
  }

  selectLibInstance.on('change', value => {
    const data = getSavedData();
    data.delivery_method = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    renderDeliveryFields(value);
  });
}

function renderDeliveryFields(method) {
  dynamicContainer.innerHTML = '';
  const savedData = getSavedData();

  if (method === 'nova_poshta') {
    dynamicContainer.innerHTML = `
      <div class="order__form-group">
        <label class="order__label" for="npOffice">Post Office Number</label>
        <input class="order__input" type="text" id="npOffice" name="customer_npoffice" 
               value="${savedData.customer_npoffice || ''}" placeholder="e.g. 1545" autocomplete="off" />
        <span class="order__error-message" id="error-customer_npoffice"></span>
      </div>`;
  } else if (method !== 'pickup' && method !== '') {
    dynamicContainer.innerHTML = `
      <div class="order__form-group">
        <label class="order__label" for="userAddress">Address</label>
        <input class="order__input" type="text" id="userAddress" name="customer_address" 
               value="${savedData.customer_address || ''}" autocomplete="street-address" placeholder="e.g. Ukrainska street" />
        <span class="order__error-message" id="error-customer_address"></span>
      </div>`;
  }
}

const maskOptions = {
  mask: '+{38}(000)000-00-00',
  lazy: false,
};

const mask = IMask(phoneInput, maskOptions);

function handleSubmission() {
  if (!orderForm) return;

  orderForm.addEventListener('submit', async e => {
    e.preventDefault();

    const activeOptions = document.querySelectorAll(
      '.order__choc-option--selected'
    );

    if (activeOptions.length === 0) {
      notyf.error('Please choose a chocolate first');
      return;
    }

    clearErrorMessages();

    const formData = new FormData(orderForm);
    const orderDetails = Object.fromEntries(formData.entries());

    orderDetails.customer_phone = mask.value;
    orderDetails.is_gift = orderForm.elements.is_gift.checked;

    orderDetails.selected_chocolate = selectedChocInput.value;

    try {
      await schema.validate(orderDetails, { abortEarly: false });

      notyf.success(
        `Thank you, ${orderDetails.customer_name}! Your order for ${activeOptions.length} items has been received.`
      );

      orderForm.reset();
      if (selectLibInstance) {
        selectLibInstance.clear();
      }
      dynamicContainer.innerHTML = '';

      activeOptions.forEach(option => {
        option.classList.remove('order__choc-option--selected');
      });
      selectedChocInput.value = '';

      mask.value = '';
      mask.updateValue();

      localStorage.removeItem(STORAGE_KEY);

      clearErrorMessages();
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
  customer_email: yup.string().email(),
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

function clearErrorMessages() {
  document
    .querySelectorAll('.order__error-message')
    .forEach(el => (el.textContent = ''));
}

function toggleModal(backdrop, isOpen) {
  backdrop.classList.toggle('is-open', isOpen);

  if (isOpen) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
}

function getSavedData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}
