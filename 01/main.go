package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"strconv"
	"time"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func part1(frequencies *[][]byte) {
	resultingFrequency := 0
	for i := 0; i < len(*frequencies); i++ {
		frequency, err := strconv.Atoi(string((*frequencies)[i]))
		check(err)
		resultingFrequency += frequency
	}
	fmt.Print("Part 1: " + strconv.Itoa(resultingFrequency) + "\n")
}

func part2(frequencies *[][]byte) {
	reachedSameFrequencyTwice := false
	resultingFreq := 0
	seenFrequencies := make(map[int]bool)
	for !reachedSameFrequencyTwice {
		for i := 0; i < len(*frequencies); i++ {
			frequency, err := strconv.Atoi(string((*frequencies)[i]))
			check(err)
			resultingFreq += frequency

			if _, ok := seenFrequencies[resultingFreq]; ok {
				fmt.Print("Part 2: " + strconv.Itoa(resultingFreq) + "\n")
				reachedSameFrequencyTwice = true
				break
			}

			seenFrequencies[resultingFreq] = true
		}
	}
}

func main() {
	start := time.Now()

	dat, err := ioutil.ReadFile("input.txt")
	check(err)

	frequencies := bytes.Split(dat, []byte("\r\n"))

	part1(&frequencies)
	part2(&frequencies)

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
