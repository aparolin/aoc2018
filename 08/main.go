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
	parent   *node
}

func createNodes(parent *node, numbers []int, nodes []*node, idx int) (int, []*node) {
	numChildren := numbers[idx]
	idx++
	numMetadata := numbers[idx]
	idx++

	newNode := node{
		header:   []int{numChildren, numMetadata},
		metadata: nil,
	}

	if parent != nil {
		newNode.parent = parent
		parent.children = append(parent.children, newNode)
	}

	nodes = append(nodes, &newNode)

	for i := 0; i < numChildren; i++ {
		idx, nodes = createNodes(&newNode, numbers, nodes, idx)
	}

	metadata := make([]int, numMetadata)
	for i := 0; i < numMetadata; i++ {
		metadata[i] = numbers[idx]
		idx++
	}

	newNode.metadata = metadata

	return idx, nodes
}

func part1(nodes []*node) int {
	sum := 0
	for i := range nodes {
		for j := range nodes[i].metadata {
			sum += nodes[i].metadata[j]
		}
	}

	return sum
}

func part2(nodes []node) int {
	return 0
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

	//creating with size 0, as we don't know how many nodes we'll have. Is this right?
	nodes := make([]*node, 0)
	_, nodes = createNodes(nil, numbers, nodes, 0)

	fmt.Printf("Part 1: %d \n", part1(nodes))

	elapsed := time.Since(start)
	fmt.Print("Execution time: " + elapsed.String())
}
