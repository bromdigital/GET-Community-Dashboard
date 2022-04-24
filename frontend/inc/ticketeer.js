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

    let unique = activeTicketeers.filter(onlyUnique)

    unique = unique.filter(e => e !== 'Jeike Ticketing')
    unique = unique.filter(e => e !== 'Ontapp')

    // console.log(unique)
    return unique
  }
}
