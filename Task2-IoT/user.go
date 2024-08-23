package main

import (
	"math/rand"
)

type UserInfo struct {
	HeartRate int `json:'heart_rate'`
}

func (userInfo *UserInfo) GetHeartRate() int {
	userInfo.HeartRate += rand.Intn(3) - 1
	return userInfo.HeartRate
}
