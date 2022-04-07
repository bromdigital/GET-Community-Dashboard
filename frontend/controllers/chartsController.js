// include the functions
const subGraph = require('../inc/subGraph')

const charts = (req, res, next) => {
  const locals = {
    pageTitle: 'GET Community - Charts'
  }
  res.render('charts/home', locals)
}

const chartData = async (req, res, next) => {
  try {
    const chartData = await subGraph.totalMintData(90)
    res.status(200).json(chartData)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

module.exports = {
  charts,
  chartData
}
