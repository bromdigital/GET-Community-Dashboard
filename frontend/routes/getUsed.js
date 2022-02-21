var express = require('express'),
    router = express.Router();
const axios = require('axios');
const { prop, sum } = require("ramda")
const moment = require('moment');

const getSubGraphURL = "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph";


// include the functions
const subGraph = require('../inc/subGraph');
const coinGecko = require('../inc/coinGecko');
const helpers = require('../inc/helpers');

const generateMints = async() => {
    try {

        var recentMints = await subGraph.recentMints(30)
        var todayGET = await subGraph.usedGETtoday()

        var html = `<div class="container clearfix">
        <div class="container-fluid py-4">
            <div class="row newMints">`

        for (var i = 0; i < recentMints.firstFour.length; i++) {
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
                                ${recentMints.firstFour[i].event.eventName}</a><br />
                                <a href="../ticketeer/${recentMints.firstFour[i].event.ticketeerName}">
                                <span class="text-sm font-weight-bolder">${recentMints.firstFour[i].event.ticketeerName}</span></a>
                            </h5>
                        </div>
                        <div class="imgTile" style="background-image: url('${recentMints.firstFour[i].event.imageUrl}'" );>
                        </div>
                        <h6>
                            ${Number(recentMints.firstFour[i].getDebitedFromSilo).toFixed(6)} $GET used as fuel.
                        </h6>
                    </div>
                </div>
            </div>
        </div>`
        }

        html += `</tbody>
        </table>
    </div>
</div>
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
        for (var i = 0; i < recentMints.recentMints.length; i++) {
            html += `<tr>
            <td>
                ${recentMints.recentMints[i].nftIndex}
            </td>
            <td>
                <a href="../event-profile/${recentMints.recentMints[i].event.id}">
                    ${recentMints.recentMints[i].event.eventName}
                </a>
            </td>
            <td>
                <a href="../ticketeer/${recentMints.recentMints[i].event.ticketeerName}">
                    ${recentMints.recentMints[i].event.ticketeerName}
                </a>
            </td>

            <td>
                ${recentMints.recentMints[i].getDebitedFromSilo}
            </td>
            <td>
                ${recentMints.recentMints[i].blockTimestamp}
            </td>
            <td>
                <a href="https://explorer.get-protocol.io/ticket/${recentMints.recentMints[i].nftIndex}" target="_blank">View Ticket</a>
            </td>
        </tr>`
        }

        html += `</tbody>
        </table>
    </div>
</div>`

        return {
            html: html,
            todayGET: todayGET
        }

    } catch (err) {
        console.log(err);
        res.render('404');
    }
}


router.get('/recent-mint', (req, res) => {
    const main = async() => {
        try {

            var recentMints = await subGraph.recentMints(30)
            var todayGET = await subGraph.usedGETtoday()

            // define the main content statics of the site
            const locals = {
                pageTitle: "GET Protocol Community - Recently Minted",
                helpers: helpers,
                todayGET: todayGET,
                recentMints: recentMints
            };

            res.render('usage/recent-mint', locals);

        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main()
})

// Handling request 
router.post("/request", (req, res) => {
    const main = async() => {
        try {
            var htmlUpdate = await generateMints()
            res.send(htmlUpdate)
        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main()
})

router.get('/newest-events', (req, res) => {

    const main = async() => {
        try {

            var newEventsResults = await subGraph.recentEvents(30)

            // define the main content statics of the site
            const locals = {
                pageTitle: "GET Protocol Community - Newest Events",
                helpers: helpers,
                newEvents: newEventsResults
            };

            res.render('usage/newest-events', locals);

        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main() // define the main content statics of the site

})
module.exports = router;