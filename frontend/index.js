const path = require('path')
const express = require('express')
const app = express()
const portRunning = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser')

// Set Views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

// Static Files
const publicPath = path.join(__dirname, '/public')
app.use(express.static(publicPath))
app.use(cors())
app.use(bodyParser.json())

// FORCE HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`)
    } else {
      next()
    }
  })
}

// load some routes //
const homeRoute = require('./routes/home')
const eventProfileRoute = require('./routes/eventProfile')
const usageRoute = require('./routes/getUsed')
const mapRoute = require('./routes/map')
const ticketeerRoute = require('./routes/ticketeer')
const legionRoute = require('./routes/legion')
const chartsRoute = require('./routes/charts')
const activeTicketeers = require('./routes/activeTicketeers')

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
app.use('/charts', chartsRoute.routes)
app.use('/ticketeers', activeTicketeers)

// 404 page
app.get('*', (req, res) => {
  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()
      const ticketSales = await subGraph.totalTicketSales()

      const locals = {
        pageTitle: 'Oh no! - Something went wrong.',
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
        },
        ticketSales: ticketSales,
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
