const socket = new WebSocket('ws://localhost:5001');

const serverUrl = 'http://localhost:5000';

// socket.send('testing from client');

socket.onmessage = ({data}) => {
  console.log('Message from the server ', data);
}

let startBtn = document.querySelector('.start-server-btn');

startBtn.addEventListener('click', () => {
  socket.send('testing');
});