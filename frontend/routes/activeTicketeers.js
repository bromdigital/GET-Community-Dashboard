const express = require('express')
const router = express.Router()

// include the functions
const activeTicketeers = require('../inc/ticketeer')
const helpers = require('../inc/helpers')

// data from database
const dailyStats = require('../services/dailyStats')

router.get('/', (req, res) => {
  const main = async () => {
    try {
      // data from databases
      const todayGET = await dailyStats.getTodayUsage()
      const ticketeers = await activeTicketeers.activeTicketeers()

      // define the main content statics of the site
      const locals = {
        pageTitle: 'GET Protocol Community - Active Ticketeers',
        helpers: helpers,
        todayGET: {
          getDebitedFromSilos: todayGET[0].getDebitedFromSilos,
          mintCount: todayGET[0].ticketsToday
        },
        ticketeers: ticketeers
      }

      res.render('active-ticketeers', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})

module.exports = router
