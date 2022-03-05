const connect = require('@databases/sqlite')
const { sql } = require('@databases/sqlite')

// include the functions
const subGraph = require('../inc/subGraph')

// connect the to database
const db = connect('./db/tickets.db')

async function prepare () {
  await db.query(sql`
  CREATE TABLE IF NOT EXISTS dailyUsage (
    getDebitedFromSilos NUMERIC,
    ticketsToday INT,
    id INT PRIMARY KEY CHECK (id = 1)
  );
  `)
}

const prepared = prepare()

async function setTodayUsed (tokenUsage, mintCount) {
  await prepared
  await db.query(sql`
  UPDATE dailyUsage
  SET getDebitedFromSilos = ${tokenUsage},
      ticketsToday = ${mintCount}
  WHERE
    id = 1;
  `)
}

async function getTodayUsage () {
  await prepared
  const results = await db.query(sql`
    SELECT * FROM dailyUsage;
  `)
  return results
}

async function run () {
  const todayGET = await subGraph.usedGETtoday()
  await setTodayUsed(todayGET.getDebitedFromSilos, todayGET.mintCount)
  console.log(await getTodayUsage())
}

run().catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})

setInterval(run, 8000)

exports.getTodayUsage = getTodayUsage
