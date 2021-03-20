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

// only have this for the main app

// if there is no user or if they aren't email veried (signout the user) and then take them to the homepage