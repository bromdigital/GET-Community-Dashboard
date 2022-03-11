package store

import (
	"fmt"

	"github.com/sirupsen/logrus"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type SQLLite struct {
	*gorm.DB
	Logger *logrus.Logger
}

func NewSqlLiteDB(logger *logrus.Logger, dbFileName string) (sqlLiteDb *SQLLite, err error) {
	db, err := gorm.Open(sqlite.Open(fmt.Sprintf("../../db/%s", dbFileName)), &gorm.Config{})

	if err != nil {
		return
	}

	sqlLiteDb = &SQLLite{db, logger}
	return
}

func (db SQLLite) Migrate() (err error) {
	if err = db.DB.AutoMigrate(
		&DBEvent{},
	); err != nil {
		return
	}
	return
}

func (db SQLLite) CreateDBEvent(DBEvent DBEvent) (err error) {
	result := db.Create(&DBEvent)
	return result.Error
}

func (db SQLLite) EventExist(id string) (exists bool, err error) {
	dbEvent := DBEvent{}
	result := db.Where("id = ?", id).Limit(1).Find(&dbEvent)
	if result.Error != nil {
		return
	}
	if result.RowsAffected == 1 {
		exists = true
	}
	return
}

func (db SQLLite) GetAllDBEvents() (dbEvents []DBEvent, err error) {
	result := db.Find(&dbEvents)
	return dbEvents, result.Error
}
