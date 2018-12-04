package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"regexp"
	"strconv"
	"time"
)

func part1(claims [][]byte) int {
	r := regexp.MustCompile(`@ (\d+),(\d+): (\d+)x(\d+)`)
	r.FindStringSubmatch(string(claims[0]))
	tokens := r.SubexpNames()

	x := tokens[0]

	fmt.Printf("%v\n", x)
	return 1
}

func main() {
	start := time.Now()

	size := 1000
	fabric := make([][]string, 1000)
	for i := range fabric {
		fabric[i] = make([]string, size)

		for j := range fabric[i] {
			fabric[i][j] = string('.')
		}
	}

	dat, _ := ioutil.ReadFile("input.txt")
	claims := bytes.Split(dat, []byte("\r\n"))
	areas := make(map[string]int)

	var re = regexp.MustCompile(`#(\d+) @ (\d+),(\d+): (\d+)x(\d+)`)
	for i := 0; i < len(claims); i++ {
		tokens := re.FindStringSubmatch(string(claims[i]))

		id := tokens[1]
		left, _ := strconv.Atoi(tokens[2])
		top, _ := strconv.Atoi(tokens[3])
		width, _ := strconv.Atoi(tokens[4])
		height, _ := strconv.Atoi(tokens[5])

		//store the area of that claim for part 2
		areas[id] = height * width

		for row := top; row < top+height; row++ {
			for col := left; col < left+width; col++ {
				if fabric[row][col] != string('.') {
					fabric[row][col] = string('X')
				} else {
					fabric[row][col] = id
				}
			}
		}
	}

	overlap := 0
	for r := 0; r < len(fabric); r++ {
		for c := 0; c < len(fabric[r]); c++ {
			if fabric[r][c] == string('X') {
				overlap++
			}
		}
	}

	fmt.Printf("Part 1: %d\n", overlap)

	for id, area := range areas {
		areaOnFabric := 0
		for r := 0; r < len(fabric); r++ {
			for c := 0; c < len(fabric[r]); c++ {
				if fabric[r][c] == id {
					areaOnFabric++
				}
			}
		}

		if areaOnFabric == area {
			fmt.Printf("Part 2: %v\n", id)
			break
		}
	}

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
