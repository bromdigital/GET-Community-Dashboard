const moment = require('moment')

module.exports = {

  // timer function
  timer: function (hrs, min, sec) {
    return ((hrs * 60 * 60 + min * 60 + sec) * 1000)
  },

  // turn timestamp into a date
  dateR: function (timestamp) {
    const date = moment.unix(timestamp).format('MM/DD/YY | HH:mm')
    return date
  },

  // add commas in with the large numbers
  numberWithCommas: function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  // make it into a 2 decimal place
  twoDecRound: function (num) {
    const m = Number((Math.abs(num) * 100).toPrecision(15))
    return Math.round(m) / 100 * Math.sign(num)
  },

  ping: function () {
    return 'PONG'
  }

}
