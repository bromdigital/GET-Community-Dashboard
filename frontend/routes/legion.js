const express = require('express')
const router = express.Router()

// include the functions
const helpers = require('../inc/helpers')

// data from database
const dailyStats = require('../services/dailyStats')

router.get('/', (req, res) => {
  const main = async () => {
    try {
      // data from databases
      const todayGET = await dailyStats.getTodayUsage()

      const locals = {
        pageTitle: 'GET Community - Legion',
        helpers: helpers,
        todayGET: {
          getDebitedFromSilos: todayGET[0].getDebitedFromSilos,
          mintCount: todayGET[0].ticketsToday
        }
      }
      res.render('legion/home', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})
module.exports = router
