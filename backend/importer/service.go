package importer

import (
	"github.com/simonbromfield/GET-Community-Dashboard/backend/store"
	"github.com/sirupsen/logrus"
)

type ImportService struct {
	DB     *store.SQLLite
	Logger *logrus.Logger
}

func (s ImportService) Start() {
	err := s.DB.Migrate()
	if err != nil {
		s.Logger.WithError(err).Fatal("DB Migrate action failed")
	}
	s.importTestEvent()
	s.importLastHundredEvents()
}

func (s ImportService) importTestEvent() {
	var err error
	event := store.DBEvent{
		Id:                 "0x05eb82ea183a1c2c80421b4e6a24bf289b512d41",
		GetDebitedFromSilo: 57.207343258296,
		GetHeldInFuelTanks: 57.168466368552,
		GetCreditedToDepot: 0.038876889744,
		MintCount:          2943,
		InvalidateCount:    2,
		ResaleCount:        0,
		ScanCount:          0,
		CheckInCount:       0,
		ClaimCount:         0,
		EventName:          "Within Temptation: The Aftermath is back!",
		ShopUrl:            "https://guts.events/qyn29g-within-temptation-the-aftermath-is-back/ntrpmi",
		ImageUrl:           "https://dxvwrajw1w23h.cloudfront.net/covers/e6f51769535d4d638c3c628916d6139c.png",
		Latitude:           0,
		Longitude:          0,
		StartTime:          1640372400,
		EndTime:            1641034740,
		TicketeerName:      "GUTS",
	}
	err = s.DB.CreateDBEvent(event)
	if err != nil {
		s.Logger.WithError(err).Error("Cant create test event")
	}

}

func (s ImportService) importLastHundredEvents() {
	events, err := downloadLastHundredEventsFromGraph()
	if err != nil {
		s.Logger.WithError(err).Error("Can't download last hundered events from the graph")
	}
	for _, event := range events {
		exists, err := s.DB.EventExist(event.Event.Id)
		if err != nil {
			s.Logger.WithError(err).WithField("event", event).Error("Cant determine if the event already exists")
		}
		if exists {
			continue
		}
		err = s.DB.CreateDBEvent(event.Event)
		if err != nil {
			s.Logger.WithError(err).WithField("event", event).Error("Cant import event in database")
		}
	}
}
