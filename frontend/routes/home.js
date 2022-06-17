const express = require('express')
const router = express.Router()

// include the functions
const subGraph = require('../inc/subGraph')
const coinGecko = require('../inc/coinGecko')
const helpers = require('../inc/helpers')
const activeTicketeers = require('../inc/ticketeer')

router.get('/', (req, res) => {
  const main = async () => {
    try {
      // data from databases
      const todayGET = await subGraph.usedGETtoday()
      const ticketeers = await activeTicketeers.activeTicketeers()

      // data from other sources
      const tokenData = await coinGecko.tokenData()
      const ticketSales = await subGraph.totalTicketSales()
      const topEvents = await subGraph.topEvents()
      const recentEvents = await subGraph.recentEvents(11)
      const locals = {
        pageTitle: 'GET Protocol Community - Behind the ticket',
        ticketSales: ticketSales,
        tokenData: tokenData,
        topEvents: topEvents,
        helpers: helpers,
        recentEvents: recentEvents,
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
        },
        ticketeers: ticketeers
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
