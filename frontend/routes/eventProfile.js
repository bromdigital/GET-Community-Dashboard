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

            // define the main content statics of the site
            const locals = {
                pageTitle: `Event Profile - ${thisEvent.eventName}`,
                helpers: helpers,
                tickets: eventTicketsArr,
                thisEvent: thisEvent,
                startDate: startDate,
                endDate: endDate
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