package main

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	os.Remove("events.db")

	log.Println("Creating events.db...")
	file, err := os.Create("events.db")
	if err != nil {
		log.Fatal(err.Error())
	}
	file.Close()
	log.Println("events.db created")

	events, _ := sql.Open("sqlite3", "./events.db")
	defer events.Close()

	createTable(events)
	insertEvent(events, "0x05eb82ea183a1c2c80421b4e6a24bf289b512d41", "57.207343258296", "57.168466368552", "0.038876889744", "2943", "2", "0", "0", "0", "0", "Within Temptation: The Aftermath is back!", "https://guts.events/qyn29g-within-temptation-the-aftermath-is-back/ntrpmi", "https://dxvwrajw1w23h.cloudfront.net/covers/e6f51769535d4d638c3c628916d6139c.png", "0", "0", "1640372400", "1641034740", "GUTS")
	displayEvents(events)

}

func createTable(db *sql.DB) (err error) {
	createEventTableSQL := `CREATE TABLE events (
		"id" TEXT NOT NULL PRIMARY KEY,		
		"getDebitedFromSilo" FLOAT,
		"getHeldInFuelTanks" FLOAT,
		"getCreditedToDepot" FLOAT,
		"mintCount" INTEGER,
		"invalidateCount" INTEGER,
		"resaleCount" INTEGER,
		"scanCount" INTEGER,
		"checkInCount" INTEGER,
		"claimCount" INTEGER,
		"eventName" TEXT,
		"shopUrl" TEXT,
		"imageUrl" TEXT,
		"latitude" FLOAT,
		"longitude" FLOAT,
		"startTime" INTEGER,
		"endTime" INTEGER,
		"ticketeerName" TEXT
	  );`

	log.Println("Create events table...")
	statement, err := db.Prepare(createEventTableSQL)
	if err != nil {
		return
	}
	statement.Exec()
	return
}

func insertEvent(db *sql.DB, id string, getDebitedFromSilo string, getHeldInFuelTanks string, getCreditedToDepot string, mintCount string, invalidateCount string, resaleCount string, scanCount string, checkInCount string, claimCount string, eventName string, shopUrl string, imageUrl string, latitude string, longitude string, startTime string, endTime string, ticketeerName string) {
	log.Println("Inserting event record ...")
	insertEventSQL := `INSERT INTO events(id, getDebitedFromSilo, getHeldInFuelTanks, getCreditedToDepot, mintCount, invalidateCount, resaleCount, scanCount, checkInCount, claimCount, eventName, shopUrl, imageUrl, latitude, longitude, startTime, endTime, ticketeerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	statement, err := db.Prepare(insertEventSQL)
	if err != nil {
		log.Fatalln(err.Error())
	}
	_, err = statement.Exec(id, getDebitedFromSilo, getHeldInFuelTanks, getCreditedToDepot, mintCount, invalidateCount, resaleCount, scanCount, checkInCount, claimCount, eventName, shopUrl, imageUrl, latitude, longitude, startTime, endTime, ticketeerName)
	if err != nil {
		log.Fatalln(err.Error())
	}
}

func displayEvents(db *sql.DB) {
	row, err := db.Query("SELECT * FROM events")
	if err != nil {
		log.Fatal(err)
	}
	defer row.Close()
	for row.Next() {
		var id string
		var getDebitedFromSilo string
		var getHeldInFuelTanks string
		var getCreditedToDepot string
		var mintCount string
		var invalidateCount string
		var resaleCount string
		var scanCount string
		var checkInCount string
		var claimCount string
		var eventName string
		var shopUrl string
		var imageUrl string
		var latitude string
		var longitude string
		var startTime string
		var endTime string
		var ticketeerName string

		row.Scan(&id, &getDebitedFromSilo, &getHeldInFuelTanks, &getCreditedToDepot, &mintCount, &invalidateCount, &resaleCount, &scanCount, &checkInCount, &claimCount, &eventName, &shopUrl, &imageUrl, &latitude, &longitude, &startTime, &endTime, &ticketeerName)
		log.Println("Event: ", id, getDebitedFromSilo, getHeldInFuelTanks, getCreditedToDepot, mintCount, invalidateCount, resaleCount, scanCount, checkInCount, claimCount, eventName, shopUrl, imageUrl, latitude, longitude, startTime, endTime, ticketeerName)
	}
}
