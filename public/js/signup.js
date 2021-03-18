const auth = firebase.auth();

const signUpWithEmailBtn = document.querySelector('button');
const emailFieldEl = document.querySelectorAll('input')[0];
const passwordFieldEl = document.querySelectorAll('input')[1];
const passwordConfirmFieldEl = document.querySelectorAll('input')[2];
const termsCheckBoxEl = document.querySelector('input[type=checkbox]');
const errorTextEl = document.querySelector('.feedback');

signUpWithEmailBtn.addEventListener('click', async () => {
  const email = emailFieldEl.value;
  const password = passwordFieldEl.value;
  const passwordConfirm = passwordConfirmFieldEl.value;
  if (termsCheckBoxEl.checked !== true) {
    errorTextEl.textContent = 'Accept the Terms and Conditions to continue';
    return;
  }
  if (password !== passwordConfirm) {
    errorTextEl.textContent = 'Password doesn\'t match confirm password';
    return;
  }
  const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => userCredential.user)
    .catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      errorTextEl.textContent = errorMessage;
    });
  console.log(user);

  if (user === undefined) {
    return;
  }

  modalBackdrop.style.display = 'flex';
});

const modalBackdrop = document.querySelector('.modal-backdrop');
const modalSheet = document.querySelector('.modal-sheet');
const closeBtn = document.querySelector('.exit-icon');

modalBackdrop.addEventListener('click', () => {
  modalBackdrop.style.display = 'none';
});

modalSheet.addEventListener('click', (e) => {
  e.stopPropagation();
})

closeBtn.addEventListener('click', () => {
  modalBackdrop.style.display = 'none';
})