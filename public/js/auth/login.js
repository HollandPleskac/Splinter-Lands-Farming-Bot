const auth = firebase.auth();

const emailTextFieldEl = document.getElementById('email-login');
const passwordTextFieldEl = document.getElementById('password-login');
const loginBtnEl = document.querySelector('.login-btn');
const errorTextEl = document.querySelector('.feedback');

loginBtnEl.addEventListener('click', async () => {
  const email = emailTextFieldEl.value;
  const password = passwordTextFieldEl.value;
  const user = await firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => userCredential.user)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      errorTextEl.textContent = errorMessage;
    });

  if (user === undefined) {
    return;
  }

  location = 'http://localhost:5000/interact';
});