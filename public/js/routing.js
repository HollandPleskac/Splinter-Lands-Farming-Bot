const auth = firebase.auth();

console.log('imported the auth file');
async function myFunction(routeName) {
  // await fetch(`/${routeName}?auth=sometoken`, {
  //   headers: {
  //     'Authorization': 'Bearer jfdlkass;jflk;as',
  //   }
  // });
  console.log('tapped')
}

const linkEls = document.querySelectorAll('.sidebar-link');

for (let i = 0; i < linkEls.length; i++) {
  linkEls[i].addEventListener('click', () => {
    window.location.pathname = linkEls[i].dataset.url;
  });
}

console.log(linkEls);