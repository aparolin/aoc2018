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

type node struct {
	header   []int
	children []node
	metadata []int
}

func createNodes(numbers []int, nodes []node, idx int) (int, []node) {
	numChildren := numbers[idx]
	idx++
	numMetadata := numbers[idx]
	idx++

	for i := 0; i < numChildren; i++ {
		idx, nodes = createNodes(numbers, nodes, idx)
	}

	metadata := make([]int, numMetadata)
	for i := 0; i < numMetadata; i++ {
		metadata[i] = numbers[idx]
		idx++
	}

	newNode := node{
		header:   []int{numChildren, numMetadata},
		metadata: metadata}
	nodes = append(nodes, newNode)

	return idx, nodes
}

func part1(numbers []int) int {
	//creating with size 0, as we don't know how many nodes we'll have. Is this right?
	nodes := make([]node, 0)
	_, nodes = createNodes(numbers, nodes, 0)

	sum := 0
	for i := range nodes {
		for j := range nodes[i].metadata {
			sum += nodes[i].metadata[j]
		}
	}

	return sum
}

func main() {
	start := time.Now()

	dat, err := ioutil.ReadFile("input.txt")
	check(err)

	input := bytes.Split(dat, []byte(" "))
	numbers := make([]int, len(input))
	for i := range input {
		number, _ := strconv.Atoi(string(input[i]))
		numbers[i] = number
	}

	fmt.Printf("Part 1: %d \n", part1(numbers))

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
