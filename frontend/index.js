var path = require('path');
const express = require('express')
const app = express()
const port_running = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(__dirname + '/public'))

// Set Views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

// load some routes //
var homeRoute = require('./routes/home')
var eventProfileRoute = require('./routes/eventProfile')
var usageRoute = require('./routes/getUsed')
var mapRoute = require('./routes/map')
var ticketeerRoute = require('./routes/ticketeer')


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
        pageTitle: "Oh no! - Something went wrong."
    };
    res.render('404');
})

app.listen(port_running, () => {
    console.log(`GET community site listening at http://localhost:${port_running}`)
})