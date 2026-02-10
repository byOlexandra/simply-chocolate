const openOrder = document.querySelector('#open-order-modal');
const backdrop = document.querySelector('.order-backdrop');
const closeBtn = document.querySelector('#closeOrderModal');

const toggleModal = (backdrop, isOpen) => {
    backdrop.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'visible';
}

export function initOrderModal() {
    if(!backdrop) return
    openOrder.addEventListener('click', () => {
        toggleModal(backdrop, true)
    })  
    closeBtn.addEventListener('click', () => {
        toggleModal(backdrop, false)
    })
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
}
