const db = firebase.firestore();

const winsList = [];
const wins = { fire: 0, water: 0, earth: 0, life: 0, death: 0, dragon: 0 };

function renderPieChart() {
  let ctx = document.getElementById('winsChart').getContext('2d');

  Chart.defaults.global.defaultFontFamily = 'Roboto';
  Chart.defaults.global.defaultFontSize = 15;
  Chart.defaults.global.defaultFontColor = '#777';

  let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Fire', 'Water', 'Earth', 'Life', 'Death', 'Dragon'],
      datasets: [{
        data: winsList,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: '#777',
        borderWidth: 1,
        hoverBorderWidth: 3,
        hoverBorderColor: '#000',
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Total Wins By Splinter',
        fontSize: 25,
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000'
        }

      }
    }
  })
}

function setWinsList() {
  console.log(wins);
  winsList[0] = wins.fire;
  winsList[1] = wins.water;
  winsList[2] = wins.earth;
  winsList[3] = wins.life;
  winsList[4] = wins.death;
  winsList[5] = wins.dragon;
  console.log(winsList);
}

db.collection("Battle Log").onSnapshot((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    if (doc.data().winner === 'hvcminer') {
      wins[doc.data().hvcminerSplinter]++;
    }
  });
  setWinsList();
  renderPieChart();
});


