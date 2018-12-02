package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"time"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func repeatingLetters(code []byte) (int, int) {
	letters := make(map[byte]int)

	for i := 0; i < len(code); i++ {
		letter := code[i]
		if _, ok := letters[letter]; ok {
			letters[letter]++
		} else {
			letters[letter] = 1
		}
	}

	twoLetters := 0
	threeLetters := 0
	for _, v := range letters {
		if v == 2 {
			twoLetters = 1
		}
		if v == 3 {
			threeLetters = 1
		}
	}

	return twoLetters, threeLetters
}

func part1(codes [][]byte) {
	twoLetters := 0
	threeLetters := 0
	for i := 0; i < len(codes); i++ {
		two, three := repeatingLetters(codes[i])
		twoLetters += two
		threeLetters += three
	}

	result := twoLetters * threeLetters
	fmt.Printf("Part 1: %d\n", result)
}

func compareCodes(code1 []byte, code2 []byte) (int, []byte) {
	diff := 0

	commonLetters := make([]byte, len(code1))
	idx := 0
	for i := 0; i < len(code1); i++ {
		if code1[i] != code2[i] {
			diff++
		} else {
			commonLetters[idx] = code1[i]
			idx++
		}
	}

	return diff, commonLetters

}

func part2(codes [][]byte) {
	done := false
	for i := 0; i < len(codes)-1; i++ {
		for j := i + 1; j < len(codes); j++ {
			diff, commonLetters := compareCodes(codes[i], codes[j])
			if diff == 1 {
				fmt.Printf("Part 2: %v\n", string(commonLetters))
				break
			}
		}

		if done {
			break
		}
	}
}

func main() {
	start := time.Now()

	dat, err := ioutil.ReadFile("input.txt")
	check(err)

	codes := bytes.Split(dat, []byte("\r\n"))

	part1(codes)
	part2(codes)

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
