package utils

import "github.com/sirupsen/logrus"

func NewLogger(levelStr string) *logrus.Logger {
	var (
		err    error
		level  logrus.Level
		logger = logrus.New()
	)

	// add full timestamp on all logs
	formatter := &logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05.000 Z07:00",
		FullTimestamp:   true,
	}
	logger.SetFormatter(formatter)

	if level, err = logrus.ParseLevel(levelStr); err != nil {
		// defaults to info
		level = logrus.InfoLevel
	}
	logger.SetLevel(level)

	logger.SetReportCaller(false)

	return logger
}
