const express = require('express')
const router = express.Router()

// include the functions
const subGraph = require('../inc/subGraph')
const coinGecko = require('../inc/coinGecko')
const helpers = require('../inc/helpers')

router.get('/', (req, res) => {
  const main = async () => {
    try {
      const todayUsage = await subGraph.usedGETtoday()
      const tokenData = await coinGecko.tokenData()
      const ticketSales = await subGraph.totalTicketSales()
      const topEvents = await subGraph.topEvents()
      const recentEvents = await subGraph.recentEvents(11)
      const todayGET = await subGraph.usedGETtoday()

      const locals = {
        pageTitle: 'GET Protocol Community - Behind the ticket',
        todayUsage: todayUsage,
        ticketSales: ticketSales,
        tokenData: tokenData,
        topEvents: topEvents,
        helpers: helpers,
        recentEvents: recentEvents,
        todayGET: todayGET
      }
      res.render('home', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})
module.exports = router
