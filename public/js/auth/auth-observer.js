firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // if (!user.emailVerified) {
      // location = 'http://localhost:5000/login';
      console.log('user is signed in but is not email verified');
    // }
  } else {
    
    location = 'http://localhost:5000/';
    console.log('user signed out, returning to home page');
  }
});