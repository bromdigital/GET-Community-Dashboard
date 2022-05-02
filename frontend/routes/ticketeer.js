const express = require('express')
const router = express.Router()

const { prop, sum } = require('ramda')

// include the functions
const subGraph = require('../inc/subGraph')
const helpers = require('../inc/helpers')

// data from database
const dailyStats = require('../services/dailyStats')

router.get('/:name', (req, res) => {
  const ticketeerName = req.params.name

  const main = async () => {
    try {
      // data from databases
      const todayGET = await dailyStats.getTodayUsage()

      const ticketeerProfile = await subGraph.ticketeerProfile(ticketeerName)

      const totalGETused = sum(ticketeerProfile.ticketeerData.map(prop('getDebitedFromSilo')))
      const locals = {
        pageTitle: `Ticketeer - ${ticketeerName}`,
        ticketeerProfile: ticketeerProfile.ticketeerData,
        startDate: ticketeerProfile.startDate,
        totalGETused: totalGETused,
        ticketeerName: ticketeerName,
        todayGET: {
          getDebitedFromSilos: todayGET[0].getDebitedFromSilos,
          mintCount: todayGET[0].ticketsToday
        },
        helpers: helpers
      }

      res.render('ticketeer-profile', locals)
    } catch (err) {
      console.log(err)
      // res.render('404')
    }
  }
  main()
})
module.exports = router
