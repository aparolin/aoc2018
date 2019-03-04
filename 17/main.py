import numpy as np
import re

def parse_input(filename):
    grid = {}
    f = open(filename)
    r = '\w=(\d+), ?\w=(\d+)..(\d+)'

    for line in f:
        groups = list(map(int, re.search(r, line).groups()))

        if len(groups) == 0:
            raise Exception('Could not parse line', line)

        if line[0] == 'x':
            col = groups[0]
            startRow = groups[1]
            endRow = groups[2]+1

            for row in range(startRow, endRow):
                grid[(row,col)] = 'clay'
        elif line[0] == 'y':
            row = groups[0]
            startCol = groups[1]
            endCol = groups[2]+1

            for col in range(startCol, endCol):
                grid[(row,col)] = 'clay'
        else:
            raise Exception('Unexpected value for input', line)
    
    #do we need to sort this before returning?
    return  grid

def next_available_pos(pos):
    candidates = [pos]
    
    while len(candidates) > 0:
        next_candidate = candidates.pop()

        if next_candidate not in grid:
            return next_candidate

        for row in range(-1,2,1):
            for col in range(-1,2,1):
                candidates.append(next_candidate + np.array([row,col]))

def produce_water(amount):
    flow_dir = np.array([1,0])
    done = False

    #initialize water_flow
    water_flow = [water_source]
    while not done:
        #update water
        for water_particle in water_flow:
            water_particle = next_available_pos(water_particle + flow_dir)

            
        if len(water_flow < amount):
            water_flow.append(water_source)
        

water_source = np.array([0, 500])   
grid = parse_input('sample_input.txt')
print(grid)
