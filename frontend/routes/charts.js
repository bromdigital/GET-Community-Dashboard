'use strict'
const express = require('express')
const { charts, chartData } = require('../controllers/chartsController')
const router = express.Router()

router.get('/', charts)
router.get('/chartData', chartData)

module.exports = {
  routes: router
}
