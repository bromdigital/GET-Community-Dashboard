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
          data: mintCount
        },
        {
          name: "Scanned",
          data: scanCount
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
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: day,
      }
      };
      
      var usageOptions = {
        series: [{
        name: '$GET used',
        data: getUsed
      }],
        chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      title: {
        text: 'GET usage',
        align: 'left'
      },
      xaxis: {
        categories: day,
      },
      yaxis: {
        title: {
          text: '$GET used'
        }
      },
      fill: {
        opacity: 1
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
      
      var usageChart = new ApexCharts(document.querySelector("#usageChart"), usageOptions);
      usageChart.render();
      


    },
    
    
      error: (err) => {
          console.log(err);
      }
  })
}
