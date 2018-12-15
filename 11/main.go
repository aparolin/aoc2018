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

func sumGridRegion(grid [][]int, x0 int, y0 int, size int) int{
	sum := 0
	for y := 0; y < size; y++ {
		for x := 0; x < size; x++ {
			sum += grid[y0+x][x0+y]
		}
	}

	return sum
}

func part1(grid [][]int, serialNumber int, size int) ([]int, int) {
	highestSum := 0
	coordinates := make([]int, 2)
	for y := 0; y < len(grid) - size; y++ {
		for x := 0; x < len(grid[y]) -size; x++ {
			sum := sumGridRegion(grid, x, y, size)
			if sum > highestSum {
				highestSum = sum
				coordinates[0] = x
				coordinates[1] = y
			}
		}
	}

	return coordinates, highestSum
}

func part2(grid [][]int, serialNumber int) ([]int, int) {
	highestSum := 0
	coordinates := make([]int, 2)
	bestSize := 0

	//I'll assume size is in between 3 and 50. I was right :)
	for size := 3; size < 50; size++ {
		coords, sum := part1(grid, serialNumber, size)

		if (sum > highestSum){
			highestSum = sum
			coordinates = coords
			bestSize = size
		}
	}	
	
	return coordinates, bestSize
}

func main() {
	start := time.Now()

	serialNumber := 9798
	
	grid := createPowerGrid(serialNumber)
	resultPart1, _ := part1(grid, serialNumber, 3)
	coordinatesPart2, sizePart2 := part2(grid, serialNumber)

	fmt.Printf("Part 1: %d,%d \n", resultPart1[0], resultPart1[1])
	fmt.Printf("Part 2: %d,%d,%d \n", coordinatesPart2[0],coordinatesPart2[1],sizePart2)

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
