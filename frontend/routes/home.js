var express = require('express'),
    router = express.Router();
const axios = require('axios');
const getSubGraphURL = "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph";
const helpers = require('../inc/functions');

router.get('/', (req, res) => {

    const main = async() => {
        try {
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

            const topEventsResults = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        events(orderBy: getDebitedFromSilo, orderDirection: desc) {
                            id
                            eventName
                            mintCount
                            scanCount
                            claimCount
                            imageUrl
                            startTime
                            endTime
                            ticketeerName
                            getDebitedFromSilo
                            shopUrl
                            averageGetPerMint
                        }
                      }`
                }
            )

            // bigest events object array
            let biggestEvents = topEventsResults.data.data.events
            let tenBiggestEvents = biggestEvents.slice(0, 10)
            var biggestEventList = [];

            for (var i = 0; i < 10; i++) {
                let startDate = new Date(tenBiggestEvents[i].startTime * 1000)
                let endDate = new Date(tenBiggestEvents[i].endTime * 1000)
                biggestEventList.push({
                    "id": tenBiggestEvents[i].id,
                    "eventName": tenBiggestEvents[i].eventName,
                    "ticketeerName": tenBiggestEvents[i].ticketeerName,
                    "imgBG": tenBiggestEvents[i].imageUrl,
                    "endTime": endDate.getDate() + "/" + (endDate.getMonth() + 1) + "/" + endDate.getFullYear() + " @ " + endDate.getHours() + ":" + endDate.getMinutes(),
                    "getDebitedFromSilo": tenBiggestEvents[i].getDebitedFromSilo,
                    "mintCount": tenBiggestEvents[i].mintCount,
                    "shopUrl": tenBiggestEvents[i].shopUrl,
                    "startTime": startDate.getDate() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getFullYear() + " @ " + startDate.getHours() + ":" + startDate.getMinutes(),
                    "themeColor": 'green',
                    "themeColorHex": '#40b390',
                    "averageGetPerMint": tenBiggestEvents[i].averageGetPerMint
                });
            }

            // // ticket sales data 
            // const priorPolygonTS = parseInt(639813); // Tickets sold prior to Polygon migration 
            // let PolygonTS = parseInt(mintCountResults.data.data.protocol.mintCount)
            // let totalTickets = priorPolygonTS + PolygonTS
            // let totalTicketsComas = totalTickets.toLocaleString()

            const locals = {
                pageTitle: "GET Protocol Community - Behind the ticket",
                helpers: helpers,
                ticketsSold: 22222222,
                numTicketIssuers: 9,
                marketCapUSD: 2222222,
                marketCapEUR: 2222222,
                priceUSD: 22.22,
                priceEUR: 22.22,
                twitterFollowers: 2222,
                redditSubs: 2222,
                teleGramUsers: 2222,
                biggestEvents: biggestEvents,
                getDaoPoly: 2222,
                getDaoEther: 2222,
                circulatingSupply: 2222,
                totalSupply: 2222,
                price24hrDifference: 2.2,
                biggestEventList: biggestEventList,
                todayGET: todayGET
            };
            res.render('home', locals);
        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main()
})
module.exports = router;