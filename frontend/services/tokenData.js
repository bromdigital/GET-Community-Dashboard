const connect = require('@databases/sqlite')
const { sql } = require('@databases/sqlite')

// include the functions
const coinGecko = require('../inc/coinGecko')

const db = connect('./db/token.db')

async function prepare () {
  await db.query(sql`
  CREATE TABLE IF NOT EXISTS tokenData (
    tokenPriceUSD NUMERIC,
    tokenPriceEUR NUMERIC,
    marketCapUSD INT,
    marketCapEUR INT,
    id INTEGER NOT NULL
  );
  `)
  await db.query(sql`
  INSERT INTO tokenData (tokenPriceUSD, tokenPriceEUR, marketCapUSD, marketCapEUR, id)
  VALUES (0.1, 0.1, 1, 1, 1);
  `)
}

const prepared = prepare()

async function setTokenData (priceUSD, priceEUR, marketCapUSD, marketCapEUR) {
  await prepared
  await db.query(sql`
  UPDATE tokenData
  SET tokenPriceUSD = ${priceUSD}, tokenPriceEUR = ${priceEUR}, marketCapUSD = ${marketCapUSD}, marketCapEUR = ${marketCapEUR}
  WHERE id = 1;
  `)
}

async function getTokenData () {
  await prepared
  const results = await db.query(sql`
    SELECT * FROM tokenData;
  `)
  return results
}

async function run () {
  const tokenData = await coinGecko.tokenData()
  await setTokenData(tokenData.tokenPriceUSD, tokenData.tokenPriceEUR, tokenData.marketCapUSD, tokenData.marketCapEUR)
  console.log(await getTokenData())
}

run().catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
