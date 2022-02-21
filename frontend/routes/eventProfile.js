var express = require('express'),
    router = express.Router();
const moment = require('moment');
const { prop, sum } = require("ramda")
const today = new Date().getTime()

// include the functions
const subGraph = require('../inc/subGraph');
const coinGecko = require('../inc/coinGecko');
const helpers = require('../inc/helpers');

router.get('/:id', (req, res) => {
    var eventID = req.params.id;

    const main = async() => {
        try {
            const eventData = await subGraph.singleEvent(eventID)

            if (moment.unix(eventData.thisEventResult.endTime).isBefore(today, 'day')) {
                var eventPast = true
            } else {
                var eventPast = false
            }

            const locals = {
                pageTitle: `Event Profile - ${eventData.eventName}`,
                helpers: helpers,
                eventData: eventData,
                eventPast: eventPast
            };

            //console.log(locals)

            res.render('event-profile', locals);

        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main()

})
module.exports = router;