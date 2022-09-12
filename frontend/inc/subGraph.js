// ========
const axios = require('axios')
const getSubGraphURL = 'https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph-deprecated'
const getSubGraphURLV2 = 'https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph'

const moment = require('moment')

module.exports = {

  usedGETtoday: async () => {
    const usedGET = await axios.post(
      getSubGraphURLV2, {
        query: `
              {
                protocolDays(orderBy: day, orderDirection: desc, first: 1) {
                reservedFuel
                soldCount
              }
            }
            `
      }
    )
    return {
      getDebitedFromSilos: usedGET.data.data.protocolDays[0].reservedFuel,
      mintCount: usedGET.data.data.protocolDays[0].soldCount
    }
  },

  totalTicketSales: async () => {
    const mintCountResults = await axios.post(
      getSubGraphURLV2, {
        query: `
                  {
                    protocol(id: "1") {
                      soldCount
                    }
                  }
                `
      }
    )

    // ticket sales data
    const priorPolygonTS = parseInt(640630) // Tickets sold prior to Polygon migration

    const totalTickets = priorPolygonTS + Number(parseInt(mintCountResults.data.data.protocol.soldCount))

    return totalTickets
  },

  recentMints: async (number) => {
    let firstFour = await axios.post(
      getSubGraphURLV2, {
        query: `
        {
          usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: 4, , where: { type: SOLD }) {
              type
              nftId
              getUsed
              blockTimestamp
              event {
                id
                name
                imageUrl
                shopUrl
                integrator{
                  name
                }
              }
          }
      }  
        `
      }
    )

    let recentMints = await axios.post(
      getSubGraphURLV2, {
        query: `
              {
                usageEvents(orderBy: blockTimestamp, orderDirection: desc, first: ${number - 4}, skip: 4, where: { type: SOLD }) {
                    type
                    nftId
                    getUsed
                    blockTimestamp
                    event {
                      id
                      name
                      imageUrl
                      shopUrl
                      integrator{
                        name
                      }
                    }
                }
            } 
        `
      }
    )

    recentMints = recentMints.data.data.usageEvents
    recentMints = recentMints.filter(e => e.event.ticketeerName !== 'Demo')

    for (let i = 0; i < recentMints.length; i++) {
      recentMints[i].blockTimestamp = moment.unix(recentMints[i].blockTimestamp).format('MM/DD/YY HH:mm:ss')
    }

    firstFour = firstFour.data.data.usageEvents
    firstFour = firstFour.filter(e => e.event.ticketeerName !== 'Demo')

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
    recentMints = recentMints.filter(e => e.event.ticketeerName !== 'Demo')

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
                      startTime
                    }
                  } 
                `
      }
    )

    const ticketeerData = ticketeer.data.data.events

    const startDate = ticketeerData.map(function (elem) {
      const startDate = moment.unix(elem.startTime).format('MM/DD/YY | HH:mm')
      return startDate
    })

    return {
      ticketeerData: ticketeerData,
      startDate: startDate
    }
  },

  recentEvents: async (number) => {
    let recentEvents = await axios.post(
      getSubGraphURLV2, {
        query: `
                {
                  events(orderBy: blockTimestamp, orderDirection: desc, first: ${number}) {
                    id
                    name
                    imageUrl
                    integrator{
                      name
                    }
                  }
                }
                `
      }
    )

    recentEvents = await recentEvents.data.data.events
    recentEvents = recentEvents.filter(e => e.integrator.name !== 'Demo v1')
    recentEvents = recentEvents.filter(e => e.integrator.name !== 'YourTicketProvider')

    const filteredEventsArr = recentEvents.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id)
      if (!x) {
        return acc.concat([current])
      } else {
        return acc
      }
    }, [])

    return filteredEventsArr
  },

  topEvents: async () => {
    const topEvents = await axios.post(
      getSubGraphURLV2, {
        query: `
                {
                  events(orderBy: reservedFuel, orderDirection: desc, first: 10) {
                    name
                    soldCount
                    integrator{
                      name
                    }
                    reservedFuel
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

  // total mint data
  totalMintData: async (days) => {
    const totalMintData = await axios.post(
      getSubGraphURLV2, {
        query: `
        {
          protocolDays(orderBy: day, orderDirection: desc, first: ${days}) {
            day
            soldCount
            scannedCount
            resoldCount
            checkedInCount
            claimedCount
            invalidatedCount
            reservedFuel
          }
        } 

        `
      }
    )

    return totalMintData.data.data.protocolDays
  },

  // map markers function
  singleEvent: async function (id) {
    let thisEventResult = await axios.post(
      getSubGraphURLV2, {
        query: `
        {
          event(id: "${id}") {
            id 
            name
            soldCount
            scannedCount
            claimedCount
            imageUrl
            startTime
            endTime
            integrator{
              name
            }
            reservedFuel
            averageReservedPerTicket
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
      getSubGraphURLV2, {
        query: `
        {
          event(id: "0x454871134a6d4fbcea9de0f472556b44996e4dcb") {
            tickets{
              id
              usageEvents{
                getUsed
                type
              }
            }
          }
        }
        `
      }
    )

    tickets = tickets.data.data.event.tickets

    return {
      thisEventResult: thisEventResult,
      tickets: tickets,
      startDate: startDate,
      endDate: endDate
    }
  },

  // map markers function
  integrators: async function (id) {
    let integrators = await axios.post(
      getSubGraphURLV2, {
        query: `
        {
          integrators(where:{ isBillingEnabled: true }) {
            name
          }
        }
        `
      }
    )

    integrators = integrators.data.data.integrators

    return {
      integrators: integrators
    }
  }

}
