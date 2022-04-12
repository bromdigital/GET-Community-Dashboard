module.exports = {

  activeTicketeers: async function () {
    const subGraph = require('./subGraph')

    const recentEvents = await subGraph.recentEvents(1000)

    const activeTicketeers = await recentEvents.map(function (elem) {
      return elem.event.ticketeerName
    })

    function onlyUnique (value, index, self) {
      return self.indexOf(value) === index
    }

    const unique = activeTicketeers.filter(onlyUnique)

    return unique
  }
}
