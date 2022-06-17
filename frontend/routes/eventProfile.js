const express = require('express')
const router = express.Router()
const moment = require('moment')
const today = new Date().getTime()

// include the functions
const subGraph = require('../inc/subGraph')
const helpers = require('../inc/helpers')

router.get('/:id', (req, res) => {
  const eventID = req.params.id

  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()

      const eventData = await subGraph.singleEvent(eventID)

      let eventPast

      if (moment.unix(eventData.thisEventResult.endTime).isBefore(today, 'day')) {
        eventPast = true
      } else {
        eventPast = false
      }

      const locals = {
        pageTitle: `Event Profile - ${eventData.thisEventResult.eventName}`,
        helpers: helpers,
        eventData: eventData,
        eventPast: eventPast,
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
        }
      }

      // console.log(locals)

      res.render('event-profile', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})
module.exports = router
