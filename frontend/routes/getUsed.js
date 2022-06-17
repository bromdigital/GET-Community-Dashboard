const express = require('express')
const router = express.Router()

// include the functions
const subGraph = require('../inc/subGraph')
const helpers = require('../inc/helpers')
const trending = require('../inc/trending')

const generateMints = async () => {
  try {
    const todayGET = await subGraph.usedGETtoday()

    const recentMints = await subGraph.recentMints(30)

    let html = `<div id="mintContainer">
    <div class="container-fluid py-4">
        <div class="row newMints">`

    for (let i = 0; i < recentMints.firstFour.length; i++) {
      html += `<div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
      <div class="card">
          <div class="card-body p-3">
              <div class="row">
                  <div class="numbers">
                      <p class="text-sm mb-0">
                                ${recentMints.firstFour[i].blockTimestamp}
                                </p>
                                <h5>
                                <a href="../event-profile/${recentMints.firstFour[i].event.id}">
                                ${helpers.truncate(recentMints.firstFour[i].event.eventName, 20)}<br /></a>
                                <a href="../ticketeer/${recentMints.firstFour[i].event.ticketeerName}">
                                <span class="text-sm font-weight-bolder">${recentMints.firstFour[i].event.ticketeerName}</span></a>
                                </h5>
                                </div>
                                <div class="imgTile" style="background-image: url(' ${recentMints.firstFour[i].event.imageUrl}'" );>
                        </div>
                        <h6>
                            ${Number(recentMints.firstFour[i].getDebitedFromSilo).toFixed(6)} $GET used as fuel.
                        </h6>
                    </div>
                </div>
            </div>
        </div>`
    }

    html += `</div>

    <div class="col_full nobottommargin">
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Ticket Number</th>
                        <th scope="col">Event Name</th>
                        <th scope="col">Ticketeer Name</th>
                        <th scope="col">$GET used</th>
                        <th scope="col">Block Timestamp</th>
                        <th scope="col">NFT Explorer</th>
                    </tr>
                </thead>
                <tbody>
        `
    for (let ii = 0; ii < recentMints.recentMints.length; ii++) {
      html += `<tr>
            <td>
                ${recentMints.recentMints[ii].nftIndex}
            </td>
            <td>
                <a href="../event-profile/${recentMints.recentMints[ii].event.id}">
                    ${helpers.truncate(recentMints.recentMints[ii].event.eventName, 20)}
                </a>
            </td>
            <td>
                <a href="../ticketeer/${recentMints.recentMints[ii].event.ticketeerName}">
                    ${recentMints.recentMints[ii].event.ticketeerName}
                </a>
            </td>

            <td>
                ${recentMints.recentMints[ii].getDebitedFromSilo}
            </td>
            <td>
                ${recentMints.recentMints[ii].blockTimestamp}
            </td>
            <td>
                <a href="https://explorer.get-protocol.io/ticket/${recentMints.recentMints[ii].nftIndex}" target="_blank">View Ticket</a>
            </td>
        </tr>`
    }

    html += `</tbody>
        </table>
</div>`

    return {
      html: html,
      todayGET: {
        getDebitedFromSilos: todayGET.getDebitedFromSilos,
        mintCount: todayGET.mintCount
      }
    }
  } catch (err) {
    return err
  }
}

router.get('/recent-mint', (req, res) => {
  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()
      const trendingEvent = await trending.trendingID()
      const recentMints = await subGraph.recentMints(30)

      // define the main content statics of the site
      const locals = {
        pageTitle: 'GET Protocol Community - Recently Minted',
        helpers: helpers,
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
        },
        recentMints: recentMints,
        trendingEvent: trendingEvent
      }

      res.render('usage/recent-mint', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})

router.post('/request', (req, res) => {
  const main = async () => {
    try {
      const htmlUpdate = await generateMints()
      res.send(htmlUpdate)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main()
})

router.get('/newest-events', (req, res) => {
  const main = async () => {
    try {
      const todayGET = await subGraph.usedGETtoday()

      const newEventsResults = await subGraph.recentEvents(100)

      // define the main content statics of the site
      const locals = {
        pageTitle: 'GET Protocol Community - Newest Events',
        helpers: helpers,
        todayGET: {
          getDebitedFromSilos: todayGET.getDebitedFromSilos,
          mintCount: todayGET.mintCount
        },
        newEvents: newEventsResults
      }

      res.render('usage/newest-events', locals)
    } catch (err) {
      console.log(err)
      res.render('404')
    }
  }
  main() // define the main content statics of the site
})
module.exports = router
