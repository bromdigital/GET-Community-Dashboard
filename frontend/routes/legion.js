const express = require('express')
const router = express.Router()

// include the functions
const helpers = require('../inc/helpers')
const subGraph = require('../inc/subGraph')

router.get('/', (req, res) => {
  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()

      const locals = {
        pageTitle: 'GET Community - Legion',
        helpers: helpers,
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
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
