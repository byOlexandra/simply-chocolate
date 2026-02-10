const openOrder = document.querySelector('#open-order-modal');
const backdrop = document.querySelector('.order-backdrop');
const closeBtn = document.querySelector('#closeOrderModal');
const modalChocolateList = document.querySelector('#modalChocolateList');
const selectedChocInput = document.getElementById('selectedChocInput');
const orderForm = document.getElementById('mainOrderForm');

const toggleModal = (backdrop, isOpen) => {
  backdrop.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : 'visible';
};

export async function fetchChocolateData() {
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
}

function setupSelectionLogic() {
  const options = document.querySelectorAll('.order__choc-option');

  options.forEach(option => {
    option.addEventListener('click', () => {
      options.forEach(opt =>
        opt.classList.remove('order__choc-option--selected')
      );

      option.classList.add('order__choc-option--selected');

      const productName = option.getAttribute('data-name');
      selectedChocInput.value = productName;

      console.log(`Selected: ${productName}`);
    });
  });
}

export function initOrderModal() {
    
    
  if (openOrder && backdrop) {
    openOrder.addEventListener('click', () => {
      console.log("Кнопку відкриття натиснуто!");
      toggleModal(backdrop, true);
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
    
    if (!backdrop || !openOrder || !closeBtn || !orderForm) return;

  orderForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!selectedChocInput.value) {
      alert('Please select a chocolate first!');
      return;
    }

    const formData = new FormData(orderForm);
    const orderDetails = Object.fromEntries(formData.entries());

    console.log('Order Sent:', orderDetails);

    alert(
      `Thank you, ${orderDetails.customer_name}! Your order for ${orderDetails.selected_chocolate} has been received.`
    );
  });
}
