// include the functions
const subGraph = require('../inc/subGraph')
const dailyStats = require('../services/dailyStats')
const helpers = require('../inc/helpers')

const charts = async (req, res, next) => {
  try {
    const todayGET = await dailyStats.getTodayUsage()

    const locals = {
      pageTitle: 'GET Community - Charts',
      helpers: helpers,
      todayGET: {
        getDebitedFromSilos: todayGET[0].getDebitedFromSilos,
        mintCount: todayGET[0].ticketsToday
      }
    }
    res.render('charts/home', locals)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const chartData = async (req, res, next) => {
  try {
    let number
    if (req.query.id) {
      number = req.query.id
    }
    const chartData = await subGraph.totalMintData(number)
    res.status(200).json(chartData)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
  charts,
  chartData
}
