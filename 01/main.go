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

func part1(frequencies *[]int64) {
	var result int64 = 0
	for i := 0; i < len(*frequencies); i++ {
		frequency := (*frequencies)[i]
		result += frequency
	}
	fmt.Printf("Part 1: %v\n", result)
}

func part2(frequencies *[]int64) {
	done := false
	var result int64 = 0
	seenFrequencies := make(map[int64]bool)
	for !done {
		for i := 0; i < len(*frequencies); i++ {
			frequency := (*frequencies)[i]

			result += frequency

			if _, ok := seenFrequencies[result]; ok {
				fmt.Printf("Part 2: %v\n", result)
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

	tokens := bytes.Split(dat, []byte("\r\n"))
	frequencies := make([]int64, len(tokens))
	for i := 0; i < len(frequencies); i++ {
		val, _ := strconv.ParseInt(string(tokens[i]), 10, 64)
		frequencies[i] = val
	}

	part1(&frequencies)
	part2(&frequencies)

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
