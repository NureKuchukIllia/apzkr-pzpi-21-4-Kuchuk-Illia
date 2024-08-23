package main

import (
	"fmt"
	"log"
	"sync"
	"time"
)

func GetAuthInfo(email, password *string) {
	fmt.Print("Input email: ")
	_, err := fmt.Scanln(email)
	if err != nil {
		fmt.Println("Error: ", err)
	}
	fmt.Print("Input password: ")
	_, err = fmt.Scanln(password)
	if err != nil {
		fmt.Println("Error: ", err)
	}
}

func GetAuthInfoPrepared(email, password *string) {
	log.Println("Use prepared data")
	*email = "s527@go.ua"
	*password = "hhee"
}

func main() {
	var email, password string
	// GetAuthInfoPrepared(&email, &password)
	GetAuthInfo(&email, &password)

	fmt.Println("Email: ", email)
	fmt.Println("Password: ", password)

	tokens := GetTokens(email, password)
	fmt.Println("Access token: ", tokens.AccessToken)

	var m sync.Mutex
	go func() {
		for {
			UpdateToken(&tokens, &m)
			time.Sleep(time.Minute)
			log.Println("Token updated")
		}
	}()

	userInfo := UserInfo{60}

	for {
		Id := GetCurrentTrains(&tokens, &m)
		if Id == 0 {
			fmt.Println("No trains")
			time.Sleep(10 * time.Second)
			continue
		}

		for range 10 {
			fmt.Println("Current train id: ", Id)

			SendIoTData(&userInfo, Id, &tokens, &m)
			time.Sleep(time.Second)
		}
	}
}
