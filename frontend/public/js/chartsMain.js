$(document).ready(function() {
  getChartData();
});


const getChartData = async () => {
  await $.ajax({
      url: 'charts/chartData',
      type: 'GET',
      datatype: 'json',
    success: (response) => {
      if (response !== null) {
            var day = response.map(function (elem) {
              return elem.day
            })
            var mintCount = response.map(function (elem) {
              return elem.mintCount
            })
            var scanCount = response.map(function (elem) {
              return elem.scanCount
            })
            var resaleCount = response.map(function (elem) {
              return elem.resaleCount
            })
            var checkInCount = response.map(function (elem) {
              return elem.checkInCount
            })
      }
      
      const ctx = document.getElementById('chartGET').getContext('2d');
      const myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: day.reverse(),
              datasets: [{
                  label: 'Sold',
                  data: mintCount.reverse(),
                  backgroundColor: 'transparent',
                  borderColor: 'green',
                  borderWidth: 2
              },
              {
                  label: 'Resold',
                  data: resaleCount.reverse(),
                  backgroundColor: 'transparent',
                  borderColor: 'pink',
                  borderWidth: 2
              },
              {
                label: 'Scanned',
                data: scanCount.reverse(),
                backgroundColor: 'transparent',
                borderColor: 'orange',
                borderWidth: 2
              },
              {
                label: 'Checked-in',
                data: checkInCount.reverse(),
                backgroundColor: 'transparent',
                borderColor: 'blue',
                borderWidth: 2
              }
          
            ],},
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
      },
      error: (err) => {
          console.log(err);
      }
  })
}
