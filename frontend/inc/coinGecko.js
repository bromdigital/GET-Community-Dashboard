const CoinGecko = require('coingecko-api')
const CoinGeckoClient = new CoinGecko()

const helpers = require('../inc/helpers')

module.exports = {
  tokenData: async () => {
    const coinData = await CoinGeckoClient.coins.fetch('get-token', {})

    const getTokenData = {
      tokenPriceUSD: coinData.data.market_data.current_price.usd,
      tokenPriceEUR: coinData.data.market_data.current_price.eur,
      marketCapUSD: helpers.numberWithCommas(coinData.data.market_data.market_cap.usd),
      marketCapEUR: helpers.numberWithCommas(coinData.data.market_data.market_cap.eur),
      communityData: coinData.data.community_data,
      priceChange24h: coinData.data.market_data.price_change_percentage_24h,
      circulatingSupply: helpers.numberWithCommas(Math.round(coinData.data.market_data.circulating_supply)),
      totalSupply: helpers.numberWithCommas(Math.round(coinData.data.market_data.total_supply))
    }
    return getTokenData
  }

}
