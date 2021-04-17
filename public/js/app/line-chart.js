// db is availiable here from pie-chart.js

function renderLineChart(days, winsPerDay) {
  let lineChartCtx = document.getElementById('winsOverTimeChart').getContext('2d');

  Chart.defaults.global.defaultFontFamily = 'Roboto';
  Chart.defaults.global.defaultFontSize = 15;
  Chart.defaults.global.defaultFontColor = '#777';

  let chart = new Chart(lineChartCtx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Wins',
        data: winsPerDay,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#777',
        borderWidth: 1,
        hoverBorderWidth: 3,
        hoverBorderColor: '#000',
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Total Wins Over Time',
        fontSize: 25,
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
          fontColor: '#000'
        }

      }
    }
  })
}

function isOnSameDay(timestamp1, timestamp2) {
  const day1 = new Date(timestamp1).toString().split(' ')[0];
  const day2 = new Date(timestamp2).toString().split(' ')[0];
  if (day1 === day2)
    return true;
  else
    return false;
}

db.collection("Battle Log").onSnapshot((querySnapshot) => {
  const days = [];
  const winsPerDay = [];

  for (let i = 6; i >= 0; i--) {
    // get day
    const today = new Date();
    const day = new Date().setDate(today.getDate() - i);
    const dayOutput = new Date(day).toString().split(' ')[0];
    days.push(dayOutput);
    // get wins
    let wins = 0;

    querySnapshot.forEach((doc) => {
      if (doc.data().winner === 'hvcminer' && isOnSameDay(doc.data().timestamp, day)) {
        wins++;
      }
    });
    winsPerDay.push(wins);
  }

  console.log(days);
  console.log(winsPerDay);
  renderLineChart(days, winsPerDay);

});