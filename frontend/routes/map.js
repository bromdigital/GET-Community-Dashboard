var express = require('express'),
    router = express.Router();
const axios = require('axios');
const getSubGraphURL = "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph";
const helpers = require('../inc/functions');

router.get('/', (req, res) => {
    const main = async() => {
        try {
            const mapMarkers = await axios.post(
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
            let mapEvents = mapMarkers.data.data.events
            var newMarkers = [];
            var len = mapEvents.length;
            for (var i = 0; i < len; i++) {
                if (mapEvents[i].latitude == '0' || mapEvents[i].ticketeerName == "Demo") {
                    delete mapEvents[i]
                } else {
                    newMarkers.push({
                        "id": mapEvents[i].id,
                        "name": mapEvents[i].eventName,
                        "url": mapEvents[i].shopUrl,
                        "lat": mapEvents[i].latitude,
                        "lng": mapEvents[i].longitude,
                        "tickeer": mapEvents[i].ticketeerName,
                        "imgURL": mapEvents[i].imageUrl
                    });
                }
            }
            var trimDuplicateArray = newMarkers.reduce((filter, current) => {
                var dk = filter.find(item => item.lat === current.lat);
                if (!dk) {
                    return filter.concat([current]);
                } else {
                    return filter;
                }
            }, []);
            const locals = {
                pageTitle: "GET Community Dashboard - MAP",
                helpers: helpers,
                markers: trimDuplicateArray
            };
            res.render('map', locals);
        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main() // define the main content statics of the site

})
module.exports = router;