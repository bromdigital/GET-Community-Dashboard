const express = require('express')
const router = express.Router()

// include the functions
const activeTicketeers = require('../inc/ticketeer')
const helpers = require('../inc/helpers')
const subGraph = require('../inc/subGraph')

router.get('/', (req, res) => {
  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()
      const ticketeers = await activeTicketeers.activeTicketeers()

      // define the main content statics of the site
      const locals = {
        pageTitle: 'GET Protocol Community - Active Ticketeers',
        helpers: helpers,
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
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
