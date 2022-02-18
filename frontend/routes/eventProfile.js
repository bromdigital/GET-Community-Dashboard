var express = require('express'),
    router = express.Router();
const axios = require('axios');
const moment = require('moment');
const helpers = require('../inc/functions');


const getSubGraphURL = "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph";

router.get('/:id', (req, res) => {
    var eventID = req.params.id;

    const main = async() => {
        try {
            const thisEventResult = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        event(id: "${eventID}") {
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
                          averageGetPerMint
                          shopUrl
                        }
                      }
            `
                }
            )
            let thisEvent = thisEventResult.data.data.event

            let startDate = moment.unix(thisEventResult.data.data.event.startTime).format("MM/DD/YYYY hh:mm a")
            let endDate = moment.unix(thisEventResult.data.data.event.endTime).format("MM/DD/YYYY hh:mm a")

            const tickets = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        usageEvents(orderBy: blockTimestamp, orderDirection: desc, where: { event: "${eventID}" }) {
                            type
                            nftIndex
                            getDebitedFromSilo
                            event {
                                eventName
                            }
                        }
                    }
            `
                }
            )

            var eventTickets = tickets.data.data.usageEvents

            const eventTicketsArr = eventTickets.filter((a) => a);

            const marker = {
                id: '0xefe03d479482b43b99e288c7d9ff9a73480c5d3c',
                name: 'Dubbelprogramma Daniël Arends en Sezgin Güleç',
                url: 'https://guts.events/hq789i-dubbelprogramma-daniel-en-sezgin/q7lclx',
                lat: '52.351481',
                lng: '4.872826',
                tickeer: 'GUTS',
                imgURL: 'https://dxvwrajw1w23h.cloudfront.net/covers/e859d39b297d40adb4a7990e3949b9d5.jpg'
            }


            // define the main content statics of the site
            const locals = {
                pageTitle: `Event Profile - ${thisEvent.eventName}`,
                helpers: helpers,
                tickets: eventTicketsArr,
                thisEvent: thisEvent,
                startDate: startDate,
                endDate: endDate,
                marker: marker
            };

            res.render('event-profile', locals);

        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main() // define the main content statics of the site

})
module.exports = router;