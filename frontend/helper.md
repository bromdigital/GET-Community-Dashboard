subgraph.usedGETtoday() => {
getDebitedFromSilos: 'x',
mintCount: 'x'
}

subGraph.weekReport() => [
{ getDebitedFromSilos: 'x', mintCount: 'x' },
{ getDebitedFromSilos: 'x', mintCount: 'x' },
{ getDebitedFromSilos: 'x', mintCount: 'x' },
{ getDebitedFromSilos: 'x', mintCount: 'x' },
{ getDebitedFromSilos: 'x', mintCount: 'x' },
{ getDebitedFromSilos: 'x', mintCount: 'x' },
{ getDebitedFromSilos: 'x', mintCount: 'x' }
]

subGraph.totalTicketSales() => Number

subGraph.topEvents() => [
{
id: 'x',
eventName: 'x',
mintCount: 'x',
ticketeerName: 'x',
getDebitedFromSilo: 'x'
}
] [10]

subGraph.recentEvents(number of events) => [
{
type: 'NEW_EVENT',
nftIndex: '0',
getDebitedFromSilo: '0',
event: {
id: 'x',
eventName: 'x',
ticketeerName: 'x',
imageUrl: 'x',
shopUrl: 'x'
}
}
] [number]

coinGecko.tokenDate() => {
tokenPriceUSD: number,
tokenPriceEUR: number,
marketCapUSD: string,
marketCapEUR: string,
communityData: {
facebook_likes: null,
twitter_followers: number,
reddit_average_posts_48h: number,
reddit_average_comments_48h: number,
reddit_subscribers: number,
reddit_accounts_active_48h: number,
telegram_channel_user_count: number
},
priceChange24h: number,
circulatingSupply: string,
totalSupply: string
}
