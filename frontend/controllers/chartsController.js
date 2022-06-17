// include the functions
const subGraph = require('../inc/subGraph')
const helpers = require('../inc/helpers')

const charts = async (req, res, next) => {
  try {
    const todayGET = await subGraph.usedGETtoday()

    const locals = {
      pageTitle: 'GET Community - Charts',
      helpers: helpers,
      todayGET: {
        getDebitedFromSilos: todayGET.getDebitedFromSilos,
        mintCount: todayGET.mintCount
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
