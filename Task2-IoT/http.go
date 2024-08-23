package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
)

func GetTokens(email, password string) Tokens {
	jsonBody := []byte(`{"username": "` + email + `", "password": "` + password + `"}`)
	jsonReader := bytes.NewReader(jsonBody)

	resp, err := http.Post("http://localhost:8000/api/token/", "application/json", jsonReader)
	if err != nil {
		fmt.Println("Error: ", err)
	}

	return TokensFromResp(resp)
}

func UpdateToken(tokens *Tokens, m *sync.Mutex) {
	m.Lock()
	defer m.Unlock()

	jsonBody := []byte(`{"refresh": "` + tokens.RefreshToken + `"}`)
	jsonReader := bytes.NewReader(jsonBody)
	resp, err := http.Post("http://localhost:8000/api/token/refresh/", "application/json", jsonReader)
	if err != nil {
		fmt.Println("Error: ", err)
	}

	tokensFromResp := TokensFromResp(resp)
	tokens.AccessToken = tokensFromResp.AccessToken
	tokens.RefreshToken = tokensFromResp.RefreshToken
}

type Game struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Datetime    string `json:"datetime"`
	Duration    int    `json:"duration"`
	Trainer     int    `json:"trainer"`
}

func GetCurrentTrains(tokens *Tokens, m *sync.Mutex) int {
	req, err := http.NewRequest("GET", "http://localhost:8000/api/current_trains", nil)
	if err != nil {
		fmt.Println("Error: ", err)
	}

	m.Lock()
	req.Header.Set("Authorization", "Bearer "+tokens.AccessToken)
	m.Unlock()

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error after request: ", err)
	}

	var games []Game
	err = json.NewDecoder(resp.Body).Decode(&games)
	if err != nil {
		fmt.Println("Error in decode: ", err)
		fmt.Println("Response: ", resp)
	}
	if len(games) == 0 {
		fmt.Println("No games")
		return 0
	}

	return games[0].Id
}

func SendIoTData(userInfo *UserInfo, trainId int, tokens *Tokens, m *sync.Mutex) {
	jsonBody := []byte(`{"heart_rate": ` + strconv.Itoa(userInfo.GetHeartRate()) + `}`)
	jsonReader := bytes.NewReader(jsonBody)

	m.Lock()
	req, err := http.NewRequest("POST", "http://localhost:8000/api/trains/"+strconv.Itoa(trainId)+"/iot", jsonReader)
	m.Unlock()
	if err != nil {
		fmt.Println("Error: ", err)
	}

	fmt.Println("Tokens", tokens.AccessToken)
	req.Header.Set("Authorization", "Bearer "+tokens.AccessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error after request: ", err)
	}

	fmt.Println("Response status: ", resp.Status)
}
