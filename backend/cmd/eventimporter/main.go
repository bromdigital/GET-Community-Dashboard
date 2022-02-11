package main

import (
	"fmt"

	"github.com/simonbromfield/GET-Community-Dashboard/backend/eventimporter"
)

func main() {
	// main program
	fmt.Println("main file for eventimporter goes here")
	// code is executed from module
	fmt.Println(eventimporter.WelcomeMessage())
}
