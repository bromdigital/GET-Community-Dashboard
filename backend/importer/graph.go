package importer

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func downloadLastHundredEventsFromGraph() (events []event, err error) {
	url := "https://api.thegraph.com/subgraphs/name/getprotocol/get-protocol-subgraph"
	query := `{
			usageEvents (
				where: {
					type: "NEW_EVENT",
				},
				first: 100
				orderDirection:desc
			) {
			event{
			id
			getDebitedFromSilo
			getHeldInFuelTanks
			getCreditedToDepot
			mintCount
			invalidateCount
			resaleCount
			scanCount
			checkInCount
			claimCount
			eventName
			shopUrl
			imageUrl
			latitude
			longitude
			startTime
			endTime
			ticketeerName
			}
			}
		}`
	requestBody, err := json.Marshal(map[string]string{
		"query": query,
	})
	if err != nil {
		return
	}
	response, err := http.Post(url, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return
	}
	defer response.Body.Close()

	responseBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return
	}

	var eventsReponse graphNewEventsResponse
	err = json.Unmarshal(responseBody, &eventsReponse)
	if err != nil {
		return
	}
	events = eventsReponse.Data.UsageEvents
	return
}
