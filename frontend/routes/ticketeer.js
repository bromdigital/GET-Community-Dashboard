var express = require('express'),
    router = express.Router();

// include the functions 
const subGraph = require('../inc/subGraph');
const coinGecko = require('../inc/coinGecko');
const helpers = require('../inc/helpers');

router.get('/:name', (req, res) => {
    var ticketeerName = req.params.name;

    const main = async() => {
        try {

            const ticketeerProfile = await subGraph.ticketeerProfile(ticketeerName)

            const locals = {
                pageTitle: `Ticketeer - ${ticketeerName}`,
                ticketeerProfile: ticketeerProfile,
                ticketeerName: ticketeerName,
                helpers: helpers
            };


            res.render('ticketeer-profile', locals);

        } catch (err) {
            console.log(err);
            res.render('404');
        }
    }
    main()

})
module.exports = router;