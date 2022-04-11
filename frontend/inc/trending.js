module.exports = {

  trendingID: async function () {
    const subGraph = require('./subGraph')

    const recentMints = await subGraph.trending(500)

    function getMostFrequent (arr) {
      const hashmap = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1
        return acc
      }, {})
      return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
    }
    const recentMintsID = await recentMints.recentMints.map(function (elem) {
      return elem.event.id
    })

    const trendingID = await getMostFrequent(recentMintsID)

    const trendingEvent = await subGraph.singleEvent(trendingID)

    return trendingEvent
  }
}
