const signOutLinkEl = document.querySelectorAll('.sidebar-link')[4];

signOutLinkEl.addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log('signed out successfully');
    location = 'http://localhost:5000/';
  }).catch((error) => {
    // An error happened.
    alert('an error occurred during sign out', error);
    console.log('error during sign out', error);
  });
});

