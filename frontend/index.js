const path = require('path')
const express = require('express')
const app = express()
const portRunning = process.env.PORT || 3000

// Static Files
const publicPath = path.join(__dirname, '/public')
app.use(express.static(publicPath))

// Set Views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// load some routes //
const homeRoute = require('./routes/home')
const eventProfileRoute = require('./routes/eventProfile')
const usageRoute = require('./routes/getUsed')
const mapRoute = require('./routes/map')
const ticketeerRoute = require('./routes/ticketeer')
const legionRoute = require('./routes/legion')

// include the functions
const subGraph = require('./inc/subGraph')
const helpers = require('./inc/helpers')

// the routes //
app.use('/', homeRoute)
app.use('/event-profile', eventProfileRoute)
app.use('/usage', usageRoute)
app.use('/map', mapRoute)
app.use('/ticketeer', ticketeerRoute)
app.use('/legion', legionRoute)

// 404 page
app.get('*', (req, res) => {
  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()

      const locals = {
        pageTitle: 'Oh no! - Something went wrong.',
        todayGET: todayGET,
        helpers: helpers
      }

      res.render('404', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})

app.listen(portRunning, () => {
  console.log(`GET community site listening at http://localhost:${portRunning}`)
})
