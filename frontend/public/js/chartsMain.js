$(document).ready(function() {
  getChartData(90);
});

const getChartData = async (number) => {
  await $.ajax({
      url: `charts/chartData?id=${number}`,
      type: 'GET',
      datatype: 'json',
    success: (response) => {
          if (response !== null) {
            var day = response.map(function (elem) {
              const protocolStarted = new Date("June 22, 2021");
              const thisDate = new Date("June 22, 2021");
              var daySinceStart = (elem.day - 18800) 
              thisDate.setDate(protocolStarted.getDate() + daySinceStart);
              return thisDate.toLocaleDateString('en-UK', { day: 'numeric', month:"short"})
            })
            day = day.reverse()
        
            var mintCount = response.map(function (elem) {
              return elem.mintCount
            })
            mintCount = mintCount.reverse()
        
            var scanCount = response.map(function (elem) {
              return elem.scanCount
            })
            scanCount = scanCount.reverse()
        
            var resaleCount = response.map(function (elem) {
              return elem.resaleCount
            })
            resaleCount = resaleCount.reverse()    
        
            var getUsed = response.map(function (elem) {
              return Math.round(elem.getDebitedFromSilos)
            })
            getUsed = getUsed.reverse()
      }

      var ticketOptions = {
        series: [{
          name: "Sold",
          data: mintCount,
        },
        {
          name: "Scanned",
          data: scanCount,
        },
        {
          name: "Resold",
          data: resaleCount
        }],
        
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
        },
        
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Ticket interactions',
        align: 'left'
      },
      grid: {
        row: {
          colors: [ '#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: day,
      }
      };
      
      var ticketsVGEToptions = {
        series: [{
        name: '$GET Used',
        type: 'column',
        data: getUsed
      }, {
        name: 'Tickets Sold',
        type: 'line',
        data: mintCount
      }],
        chart: {
        height: 350,
        type: 'line',
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: 'Ticket Sales & $GET used'
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      xaxis: {
        categories: day
      },
      yaxis: [{
        title: {
          text: '$GET used',
        },
      
      }, {
        opposite: true,
        title: {
          text: 'Tickets Sold'
        }
      }]
      };

      var mixedChart = new ApexCharts(document.querySelector("#mixedChart"), ticketsVGEToptions);
      mixedChart.render();

      var ticketChart = new ApexCharts(document.querySelector("#ticketChart"), ticketOptions);
      ticketChart.render();

    },
      error: (err) => {
          console.log(err);
      }
  })
}