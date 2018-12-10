package main

import (
	"fmt"
	"time"
)

type node struct {
	data int
	prev *node
	next *node
}

func part1(totalPlayers int, lastMarble int) int {
	//initialize list
	marble0 := node{
		data: 0,
		prev: nil,
		next: nil,
	}
	marble0.next = &marble0
	marble0.prev = &marble0

	currentMarble := &marble0

	//initialize players with 0 points
	currentPlayer := 0
	players := make([]int, totalPlayers)
	for p := range players {
		players[p] = 0
	}

	for i := 1; i <= lastMarble; i++ {
		if i%23 == 0 {
			players[currentPlayer] += i

			for k := 0; k < 7; k++ {
				currentMarble = currentMarble.prev
			}

			players[currentPlayer] += currentMarble.data
			//remove marble from list
			currentMarble.prev.next = currentMarble.next
			currentMarble.next.prev = currentMarble.prev

			currentMarble = currentMarble.next
		} else {
			//circle twice to the right of the list
			for j := 0; j < 2; j++ {
				currentMarble = currentMarble.next
			}

			//include new marble in list
			newMarble := node{
				data: i,
				prev: currentMarble.prev,
				next: currentMarble,
			}
			currentMarble.prev.next = &newMarble
			currentMarble.prev = &newMarble

			currentMarble = &newMarble
		}

		//next player
		currentPlayer++
		if currentPlayer == totalPlayers {
			currentPlayer = 0
		}
	}

	highestScore := 0
	for i := range players {
		if players[i] > highestScore {
			highestScore = players[i]
		}
	}

	return highestScore
}

func main() {
	start := time.Now()

	fmt.Printf("Part 1: %d \n", part1(458, 71307))

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
