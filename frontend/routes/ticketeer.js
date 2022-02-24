const express = require('express')
const router = express.Router()

const { prop, sum } = require('ramda')

// include the functions
const subGraph = require('../inc/subGraph')
const helpers = require('../inc/helpers')

router.get('/:name', (req, res) => {
  const ticketeerName = req.params.name

  const main = async () => {
    try {
      const ticketeerProfile = await subGraph.ticketeerProfile(ticketeerName)

      const totalGETused = sum(ticketeerProfile.map(prop('getDebitedFromSilo')))

      const locals = {
        pageTitle: `Ticketeer - ${ticketeerName}`,
        ticketeerProfile: ticketeerProfile,
        totalGETused: totalGETused,
        ticketeerName: ticketeerName,
        helpers: helpers
      }

      res.render('ticketeer-profile', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})
module.exports = router
