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

	//initialize players scores with 0 points
	currentPlayer := 0
	scores := make([]int, totalPlayers)
	for p := range scores {
		scores[p] = 0
	}

	highestScore := 0
	for i := 1; i <= lastMarble; i++ {
		if i%23 == 0 {
			scores[currentPlayer] += i

			for k := 0; k < 7; k++ {
				currentMarble = currentMarble.prev
			}

			scores[currentPlayer] += currentMarble.data
			//remove marble from list
			currentMarble.prev.next = currentMarble.next
			currentMarble.next.prev = currentMarble.prev

			currentMarble = currentMarble.next

			if scores[currentPlayer] > highestScore {
				highestScore = scores[currentPlayer]
			}
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

	return highestScore
}

func main() {
	start := time.Now()

	players := 458
	lastMarble := 71307

	fmt.Printf("Part 1: %d \n", part1(players, lastMarble))
	fmt.Printf("Part 1: %d \n", part1(players, lastMarble*100))

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
