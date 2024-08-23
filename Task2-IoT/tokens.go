package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Tokens struct {
	AccessToken  string `json:"access"`
	RefreshToken string `json:"refresh"`
}

func TokensFromResp(resp *http.Response) Tokens {
	var tokens Tokens
	err := json.NewDecoder(resp.Body).Decode(&tokens)
	if err != nil {
		log.Fatal(err)
	}
	return tokens
}
