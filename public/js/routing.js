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
    console.log('tapped');
    // get the data- attribute here and fetch to that url
    // have the headers
  });
}

console.log(linkEls);