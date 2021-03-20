const auth = firebase.auth();

async function signInEmail() {
  const emailTextFieldEl = document.getElementById('email-login');
  const passwordTextFieldEl = document.getElementById('password-login');
  const errorTextEl = document.querySelector('.feedback');

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
}

async function signUpEmail() {

  const signUpWithEmailBtn = document.querySelector('button');
  const emailFieldEl = document.querySelectorAll('input')[0];
  const passwordFieldEl = document.querySelectorAll('input')[1];
  const passwordConfirmFieldEl = document.querySelectorAll('input')[2];
  const termsCheckBoxEl = document.querySelector('input[type=checkbox]');
  const errorTextEl = document.querySelector('.feedback');

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
}

async function signInGoogle() {
  console.log('signing in with google');
}

async function signUpGoogle() {
  console.log('signing up with google');
}

function signOutUser() {
  firebase.auth().signOut()
    .then(() => {
      console.log('signed out successfully');
      location = 'http://localhost:5000/';
    })
    .catch((error) => {
      alert('an error occurred during sign out', error);
      console.log('error during sign out', error);
    });
}