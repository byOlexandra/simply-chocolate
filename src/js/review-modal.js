export function initReviewModal() {
    const backdrop = document.querySelector('.review-backdrop');
    const openModalBtn = document.querySelector('#leaveReviewBtn');
    const closeModalBtn = document.querySelector('#closeModal')

    openModalBtn.addEventListener('click', e => {
        e.preventDefault()
        backdrop.classList.add('is-open');
        document.body.style.overflow = 'hidden'
    })

    closeModalBtn.addEventListener('click', () => {
        backdrop.classList.remove('is-open');
        document.body.style.overflow = 'visible'
    })

    backdrop.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            backdrop.classList.remove('is-open');
            document.body.style.overflow = 'visible'
        }
    })
}

