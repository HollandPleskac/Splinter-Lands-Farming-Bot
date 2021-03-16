const auth = firebase.auth();

async function getUid() {
  return 'some-uid';
}

const linkEls = document.querySelectorAll('.sidebar-link');

for (let i = 0; i < linkEls.length; i++) {
  linkEls[i].addEventListener('click', async () => {
    location = `http://localhost:5000/${linkEls[i].dataset.url}?auth=${await getUid()}`;
  });
}

console.log(linkEls);
myFunction('testing');