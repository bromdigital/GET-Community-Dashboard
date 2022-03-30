package importer

import "github.com/simonbromfield/GET-Community-Dashboard/backend/store"

type event struct {
	Event store.DBEvent `json:"event"`
}

type usageEvents struct {
	UsageEvents []event `json:"usageEvents"`
}

type graphNewEventsResponse struct {
	Data usageEvents `json:"data"`
}
