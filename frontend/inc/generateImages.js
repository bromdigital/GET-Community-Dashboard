/////////////////
// IMAGE GEN ///
///////////////
//////////////
/////////////
//__________


const axios = require('axios');
const StaticMaps = require('staticmaps')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

// include the functions 
const subGraph = require('../inc/subGraph');
const coinGecko = require('../inc/coinGecko');
const helpers = require('../inc/helpers');


const filePath = './image-generater/map/get-map.png'

module.exports = {
    generalMap: async() => {
        try {
            // map markers function
            let mapMarkers = await subGraph.mapMarkers()

            let mapImageGenerate = async function(markerArray) {
                const staticMapsOptions = {
                    width: 1250,
                    height: 500
                };

                const map = new StaticMaps(staticMapsOptions);
                const marker = {
                    img: `./image-generater/map/marker.png`, // can also be a URL
                    offsetX: 2.5,
                    offsetY: 2.5,
                    width: 5,
                    height: 5,
                    top: 0
                };

                // get the length of the trimmed marker array
                var markersLenght = markerArray.length;

                // add the locsations onto static map
                for (var i = 0; i < markersLenght; i++) {
                    latitude = Number(markerArray[i].lng)
                    longitude = Number(markerArray[i].lat)
                    marker.coord = [latitude, longitude];
                    map.addMarker(marker);
                }

                // render the map instance 
                await map.render();

                // save map instance to file location 
                await map.image.save('./image-generater/map/get-map.png');

                // create the canvas 
                const width = 1250
                const height = 500
                const canvas = createCanvas(width, height)
                const context = canvas.getContext('2d')

                await loadImage('./image-generater/map/get-map.png').then(map => {
                    context.drawImage(map, 0, 0, 1250, 500);
                    loadImage('./image-generater/map/map-branding-01.png').then(branding => {
                        context.drawImage(branding, 0, 0, 1250, 500);
                        const output = canvas.toBuffer()
                        fs.writeFileSync('./image-generater/map/branded-map.png', output)
                    });
                });

            }

            await mapImageGenerate(mapMarkers)

        } catch (err) {

            // deal with the error like a man 
            console.log(err);

        }
    }
};