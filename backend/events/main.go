package main

import (
	"github.com/simonbromfield/GET-Community-Dashboard/backend/importer"
	"github.com/simonbromfield/GET-Community-Dashboard/backend/store"
	"github.com/simonbromfield/GET-Community-Dashboard/backend/utils"
)

func main() {
	envLogLevel, err := utils.GetenvStr("LOG_LEVEL")
	if err != nil {
		// default
		envLogLevel = "info"
	}
	logger := utils.NewLogger(envLogLevel)
	dbName, err := utils.GetenvStr("dbname")
	if err != nil {
		logger.Panic("environment variable dbname not set")
	}

	db, err := store.NewSqlLiteDB(logger, dbName)
	if err != nil {
		logger.WithError(err).WithField("dbFileName", dbName).Fatal("Can't initialize database")
	}

	streamService := importer.ImportService{
		DB:     db,
		Logger: logger,
	}

	streamService.Start()

}
