// ========
const axios = require('axios')
const { prop, sum } = require("ramda")
const unixTimestamp = (new Date().getTime()) / 1000;
const unixDay = Math.floor(unixTimestamp / 86400);
const getSubGraphURL = "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph";

module.exports = {

    usedGETtoday: async() => {

        const usedGET = await axios.post(
            getSubGraphURL, {
                query: `
            {
                protocolDays(orderBy: day, orderDirection: desc, first: 1) {
                    getDebitedFromSilos
                    mintCount
                  }
                }
            `
            }
        )
        return usedGET.data.data.protocolDays[0]
    },

    weekReport: async() => {
        const result = await axios.post(
            getSubGraphURL, {
                query: `
            {
                protocolDays(orderBy: day, orderDirection: desc, first: 7) {
                    getDebitedFromSilos
                    mintCount
                  }
                }
            `
            }
        )

        return result.data.data.protocolDays
    },

    totalTicketSales: async() => {
        const mintCountResults = await axios.post(
            getSubGraphURL, {
                query: `
                {
                    protocol(id:1) {
                      mintCount
                    }
                  }
                `
            }
        )

        // ticket sales data 
        const priorPolygonTS = parseInt(639813); // Tickets sold prior to Polygon migration 

        let totalTickets = priorPolygonTS + Number(parseInt(mintCountResults.data.data.protocol.mintCount))

        return totalTickets
    },

    ticketeerProfile: async(name) => {
        const ticketeer = await axios.post(
            getSubGraphURL, {
                query: `
                {
                    events(orderBy: getDebitedFromSilo, orderDirection: desc, where:{ticketeerName: "${name}" } ){
                      id
                      eventName
                      getDebitedFromSilo
                      mintCount
                    }
                  } 
                `
            }
        )

        return ticketeer.data.data.events
    },

    recentEvents: async(number) => {
        var recentEvents = await axios.post(
            getSubGraphURL, {
                query: `
                {
                    usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: ${number}, where: { type: NEW_EVENT }) {
                        type
                        nftIndex
                        getDebitedFromSilo
                        blockTimestamp
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

        recentEvents = recentEvents.data.data.usageEvents

        recentEvents = recentEvents.filter(e => e.event.ticketeerName != "Demo");

        return recentEvents
    },

    topEvents: async() => {
        const topEvents = await axios.post(
            getSubGraphURL, {
                query: `
                {
                    events(orderBy: getDebitedFromSilo, orderDirection: desc, first: 10) {
                        id
                        eventName
                        mintCount
                        ticketeerName
                        getDebitedFromSilo
                    }
                  }
                `
            }
        )
        return topEvents.data.data.events
    },

    // map markers function 
    mapMarkers: async function() {
        var mapMarkers = await axios.post(
                getSubGraphURL, {
                    query: `
                    {
                        events(orderBy: getDebitedFromSilo, orderDirection: desc, first: 1000, where: {latitude_not: 0 } ) {
                            id
                            eventName
                            mintCount
                            longitude
                            latitude
                            ticketeerName
                            shopUrl
                            imageUrl
                        }
                      }
                        `
                }
            )
            // map events 

        mapMarkers = mapMarkers.data.data.events

        mapMarkers = mapMarkers.filter(e => e.ticketeerName != "Demo");

        return mapMarkers
    }
};