const modalBackdrop = document.querySelector('.modal-backdrop');
const modalSheet = document.querySelector('.modal-sheet');
const closeBtn = document.querySelector('.exit-icon');

modalBackdrop.addEventListener('click', () => {
  modalBackdrop.style.display = 'none';
});

modalSheet.addEventListener('click', (e) => {
  e.stopPropagation();
});

closeBtn.addEventListener('click', () => {
  modalBackdrop.style.display = 'none';
});