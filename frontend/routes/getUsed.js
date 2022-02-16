var express = require('express'),
    router = express.Router();
const axios = require('axios');
const { prop, sum } = require("ramda")
const moment = require('moment');
const helpers = require('../inc/functions');

const getSubGraphURL = "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph";

router.get('/recent-mint', (req, res) => {
    const main = async() => {
        try {
            const firstFour = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: 4, where: { type: MINT }) {
                            type
                            nftIndex
                            getDebitedFromSilo
                            blockTimestamp
                            event {
                              id
                              eventName
                              imageUrl
                              shopUrl
                            }
                        }
                    } 
            `
                }
            )

            const recentMints = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: 36, skip: 4, where: { type: MINT }) {
                            type
                            nftIndex
                            getDebitedFromSilo
                            blockTimestamp
                            event {
                              id
                              eventName
                            }
                        }
                    } 
            `
                }
            )

            const todayGETUsed = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        protocolDays(orderBy: day, orderDirection: desc, first: 1) {
                          day
                          mintCount
                          getDebitedFromSilos
                          getCreditedToDepot
                          averageGetPerMint
                        }
                      }
                      
                    `
                }
            )

            todayGET = todayGETUsed.data.data.protocolDays[0].getDebitedFromSilos


            var recentMinted = recentMints.data.data.usageEvents
            for (var i = 0; i < recentMinted.length; i++) {
                recentMinted[i].blockTimestamp = moment.unix(recentMinted[i].blockTimestamp).format("MM/DD hh:mm:ss a")
            }

            var newestFour = firstFour.data.data.usageEvents
            for (var i = 0; i < newestFour.length; i++) {
                newestFour[i].blockTimestamp = moment.unix(newestFour[i].blockTimestamp).format("MM/DD hh:mm:ss a")
            }

            // define the main content statics of the site
            const locals = {
                pageTitle: "GET Protocol Community - Recently Minted",
                firstFour: newestFour,
                helpers: helpers,
                recentMinted: recentMinted,
                todayGET: todayGET
            };

            res.render('usage/recent-mint', locals);

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
            const newEventsResults = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: 150, where: { type: NEW_EVENT }) {
                            type
                            nftIndex
                            getDebitedFromSilo
                            event {
                              id
                              eventName
                              ticketeerName
                              imageUrl
                              shopUrl
                            }
                        }
                    } 
            `
                }
            )

            var newEvents = newEventsResults.data.data.usageEvents

            for (var i = 0; i < newEvents.length; i++) {
                if (newEvents[i].event.imageUrl == '' || newEvents[i].event.imageUrl == 'https://dxvwrajw1w23h.cloudfront.net/') {
                    newEvents[i].event.imageUrl += '../img/img-404.png'
                } else {
                    // console.log("this is not a demo")
                }
            }

            var trimDuplicateArray = newEvents.reduce((filter, current) => {
                var dk = filter.find(item => item.event.eventName === current.event.eventName);
                if (!dk) {
                    return filter.concat([current]);
                } else {
                    return filter;
                }
            }, []);
            // define the main content statics of the site
            const locals = {
                pageTitle: "GET Protocol Community - Newest Events",
                helpers: helpers,
                newEvents: trimDuplicateArray,
            };

            //console.log(newEvents)
            res.render('usage/newest-events', locals);

        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main() // define the main content statics of the site

})
module.exports = router;