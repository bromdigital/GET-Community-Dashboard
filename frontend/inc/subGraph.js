// ========
const axios = require('axios')
const getSubGraphURL = 'https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph'
const moment = require('moment')

module.exports = {

  usedGETtoday: async () => {
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

  weekReport: async () => {
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

  totalTicketSales: async () => {
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
    const priorPolygonTS = parseInt(639813) // Tickets sold prior to Polygon migration

    const totalTickets = priorPolygonTS + Number(parseInt(mintCountResults.data.data.protocol.mintCount))

    return totalTickets
  },

  recentMints: async (number) => {
    let firstFour = await axios.post(
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
                          ticketeerName
                        }
                    }
                } 
        `
      }
    )

    let recentMints = await axios.post(
      getSubGraphURL, {
        query: `
                {
                    usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: ${number - 4}, skip: 4, where: { type: MINT }) {
                        type
                        nftIndex
                        getDebitedFromSilo
                        blockTimestamp
                        event {
                          id
                          eventName
                          ticketeerName
                        }
                    }
                } 
        `
      }
    )

    recentMints = recentMints.data.data.usageEvents

    for (let i = 0; i < recentMints.length; i++) {
      recentMints[i].blockTimestamp = moment.unix(recentMints[i].blockTimestamp).format('MM/DD/YY HH:mm:ss')
    }

    firstFour = firstFour.data.data.usageEvents

    for (let ii = 0; ii < firstFour.length; ii++) {
      firstFour[ii].blockTimestamp = moment.unix(firstFour[ii].blockTimestamp).format('MM/DD/YY HH:mm:ss')
    }

    return {
      recentMints: recentMints,
      firstFour: firstFour
    }
  },

  trending: async (number) => {
    let recentMints = await axios.post(
      getSubGraphURL, {
        query: `
                {
                    usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: ${number - 4}, skip: 4, where: { type: MINT }) {
                        type
                        nftIndex
                        getDebitedFromSilo
                        blockTimestamp
                        event {
                          id
                          eventName
                          ticketeerName
                        }
                    }
                } 
        `
      }
    )

    recentMints = recentMints.data.data.usageEvents

    // Remove Your Tikcet Provider
    recentMints = recentMints.filter(e => e.event.ticketeerName !== 'YourTicketProvider')

    for (let i = 0; i < recentMints.length; i++) {
      recentMints[i].blockTimestamp = moment.unix(recentMints[i].blockTimestamp).format('MM/DD/YY HH:mm:ss')
    }

    return {
      recentMints: recentMints
    }
  },

  ticketeerProfile: async (name) => {
    const ticketeer = await axios.post(
      getSubGraphURL, {
        query: `
                {
                    events(orderBy: getDebitedFromSilo, orderDirection: desc, first: 1000,  where:{ticketeerName: "${name}" } ){
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

  recentEvents: async (number) => {
    let recentEvents = await axios.post(
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

    recentEvents = await recentEvents.data.data.usageEvents
    recentEvents = recentEvents.filter(e => e.event.ticketeerName !== 'Demo')
    return recentEvents
  },

  topEvents: async () => {
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
  mapMarkers: async function () {
    let mapMarkers = await axios.post(
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

    mapMarkers = mapMarkers.filter(e => e.ticketeerName !== 'Demo')

    return mapMarkers
  },

  // map markers function
  totalMintData: async (days) => {
    const totalMintData = await axios.post(
      getSubGraphURL, {
        query: `
        {
          protocolDays(orderBy: day, orderDirection: desc, first: ${days}) {
            day
            mintCount
            scanCount
            resaleCount
            checkInCount
            claimCount
            invalidateCount
            getDebitedFromSilos
          }
        }
        `
      }
    )
    // map events

    return totalMintData.data.data.protocolDays
  },

  // map markers function
  singleEvent: async function (id) {
    let thisEventResult = await axios.post(
      getSubGraphURL, {
        query: `
                {
                    event(id: "${id}") {
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

    thisEventResult = thisEventResult.data.data.event

    const startDate = moment.unix(thisEventResult.startTime).format('MM/DD/YY | HH:mm')
    const endDate = moment.unix(thisEventResult.endTime).format('MM/DD/YY | HH:mm')

    let tickets = await axios.post(
      getSubGraphURL, {
        query: `
                {
                    usageEvents(orderBy: blockTimestamp, orderDirection: desc, where: { event: "${id}" }) {
                        type
                        nftIndex
                        getDebitedFromSilo
                    }
                }
        `
      }
    )

    tickets = tickets.data.data.usageEvents

    return {
      thisEventResult: thisEventResult,
      tickets: tickets,
      startDate: startDate,
      endDate: endDate
    }
  }
}
