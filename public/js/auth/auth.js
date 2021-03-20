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
  const modalBackdrop = document.querySelector('.modal-backdrop');

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
  sendEmailVerification(user);
}




async function signInGoogle() {
  const errorTextEl = document.querySelector('.feedback');

  const provider = new firebase.auth.GoogleAuthProvider();

  const user = await firebase.auth()
    .signInWithPopup(provider)
    .then(async result => {
      const user = result.user;

      if (await isUserInDB(user.email) === false) {
        signOutUser(false);
        errorTextEl.textContent = 'No user with that email exists';
        console.log('user is not in the database');
        return;
      }

      return user;
    })
    .catch(error => {
      console.log('an error occurerd', error);
      errorTextEl.textContent = error.message;
    });

  console.log(user);

  if (user === undefined) {
    return;
  }

  location = 'http://localhost:5000/interact';

}




async function signUpGoogle() {
  const errorTextEl = document.querySelector('.feedback');

  const provider = new firebase.auth.GoogleAuthProvider();

  const user = await firebase.auth()
    .signInWithPopup(provider)
    .then(async result => {
      const user = result.user;

      if (await isUserInDB(user.email)) {
        signOutUser(false);
        errorTextEl.textContent = 'Account already exists, use the sign in portal';
        console.log('account of', user.email, 'already exists');
        return;
      }

      return user;
    })
    .catch(error => {
      console.log('an error occurerd', error);
      errorTextEl.textContent = error.message;
    });

  console.log(user);

  if (user === undefined) {
    return;
  }

  location = 'http://localhost:5000/interact';

}




function signOutUser(shouldNavigate) {
  firebase.auth().signOut()
    .then(() => {
      console.log('signed out successfully');
      if (shouldNavigate)
        location = 'http://localhost:5000/';
    })
    .catch((error) => {
      alert('an error occurred during sign out', error);
      console.log('error during sign out', error);
    });
}

function sendEmailVerification(user) {
  user.sendEmailVerification().then(function() {
    // Email sent.
    console.log('email verification sent');
  }).catch(function(error) {
    console.log('email verification failed to send', error);
  });
}

async function isUserInDB(email) {
  const doc = await firebase.firestore().collection('Users').doc(email).get().then(doc => doc);
  console.log(doc);
  if (doc.exists)
    return true;
  else
    return false;
}