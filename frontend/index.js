const path = require('path')
const express = require('express')
const app = express()
const portRunning = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))

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

// the routes //
app.use('/', homeRoute)
app.use('/event-profile', eventProfileRoute)
app.use('/usage', usageRoute)
app.use('/map', mapRoute)
app.use('/ticketeer', ticketeerRoute)

// 404 page
app.get('*', (req, res) => {
  // define the main content statics of the site
  const locals = {
    pageTitle: 'Oh no! - Something went wrong.'
  }
  res.render('404', locals)
})

app.listen(portRunning, () => {
  console.log(`GET community site listening at http://localhost:${portRunning}`)
})
