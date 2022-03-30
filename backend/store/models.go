package store

type DBEvent struct {
	Id                 string  `json:"id" gorm:"not null,unique"`
	GetDebitedFromSilo float64 `json:"getDebitedFromSilo,string"`
	GetHeldInFuelTanks float64 `json:"getHeldInFuelTanks,string"`
	GetCreditedToDepot float64 `json:"getCreditedToDepot,string"`
	MintCount          int     `json:"mintCount,string"`
	InvalidateCount    int     `json:"invalidateCount,string"`
	ResaleCount        int     `json:"resaleCount,string"`
	ScanCount          int     `json:"scanCount,string"`
	CheckInCount       int     `json:"checkInCount,string"`
	ClaimCount         int     `json:"claimCount,string"`
	EventName          string  `json:"eventName"`
	ShopUrl            string  `json:"shopUrl"`
	ImageUrl           string  `json:"imageUrl"`
	Latitude           float64 `json:"latitude,string"`
	Longitude          float64 `json:"longitude,string"`
	StartTime          int     `json:"startTime,string"`
	EndTime            int     `json:"endTime,string"`
	TicketeerName      string  `json:"ticketeerName"`
}
