package utils

import (
	"errors"
	"os"
)

var ErrEnvVarNotSet = errors.New("variable not set")

func GetenvStr(key string) (string, error) {
	v := os.Getenv(key)
	if v == "" {
		return v, ErrEnvVarNotSet
	}
	return v, nil
}
