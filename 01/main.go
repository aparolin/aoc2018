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
	result := 0
	for i := 0; i < len(*frequencies); i++ {
		frequency, err := strconv.Atoi(string((*frequencies)[i]))
		check(err)
		result += frequency
	}
	fmt.Print("Part 1: " + strconv.Itoa(result) + "\n")
}

func part2(frequencies *[][]byte) {
	done := false
	result := 0
	seenFrequencies := make(map[int]bool)
	for !done {
		for i := 0; i < len(*frequencies); i++ {
			frequency, err := strconv.Atoi(string((*frequencies)[i]))
			check(err)
			result += frequency

			if _, ok := seenFrequencies[result]; ok {
				fmt.Print("Part 2: " + strconv.Itoa(result) + "\n")
				done = true
				break
			}

			seenFrequencies[result] = true
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
