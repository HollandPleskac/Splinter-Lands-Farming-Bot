firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    if (!user.emailVerified)
      location = 'http://localhost:5000/';
    else
      console.log('user is signed in', user.email, user.emailVerified);
  } else {
    location = 'http://localhost:5000/';
    console.log('user signed out, returning to home page');
  }
});