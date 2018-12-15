package main

import (
	"fmt"
	"strconv"
	"time"
)

func createPowerGrid(serialNumber int) [][]int{
	width := 300
	height := 300
	grid := make([][]int, height)
	for y := range grid {
		grid[y] = make([]int, width)

		for x := 0; x < width; x++ {
			rackID := x + 10
			powerLevel := ((rackID * y) + serialNumber) * rackID
			powerLevelString := strconv.Itoa(powerLevel)
			l := len(powerLevelString)
			hundredDigit := 0
			if l > 2 {
				i := l-3
				hundredDigit, _ = strconv.Atoi(powerLevelString[i:i+1])
			}
			grid[y][x] = hundredDigit - 5
		}
	}

	return grid
}

func sumGridRegion(grid [][]int, x0 int, y0 int) int{
	sum := 0
	for y := 0; y < 3; y++ {
		for x := 0; x < 3; x++ {
			sum += grid[y0+x][x0+y]
		}
	}

	return sum
}

func part1(serialNumber int) []int{
	grid := createPowerGrid(serialNumber)

	highestSum := 0
	coordinates := make([]int, 2)
	for y := 0; y < len(grid) - 3; y++ {
		for x := 0; x < len(grid[y]) -3; x++ {
			sum := sumGridRegion(grid, x, y)
			if sum > highestSum {
				highestSum = sum
				coordinates[0] = x
				coordinates[1] = y
			}
		}
	}

	return coordinates
}

func main() {
	start := time.Now()

	serialNumber := 9798
	
	resultPart1 := part1(serialNumber)
	fmt.Printf("Part 1: %d,%d \n", resultPart1[0], resultPart1[1])
	// fmt.Printf("Part 2: %d \n", part2(nodes))

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
