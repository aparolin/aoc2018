import numpy as np
import re


def parse_input(filename):
    grid = {}
    f = open(filename)
    r = '\w=(\d+), ?\w=(\d+)..(\d+)'

    depth = 0
    for line in f:
        groups = list(map(int, re.search(r, line).groups()))

        if len(groups) == 0:
            raise Exception('Could not parse line', line)

        if line[0] == 'x':
            col = groups[0]
            startRow = groups[1]
            endRow = groups[2]+1

            if groups[2] > depth:
                depth = groups[2]

            for row in range(startRow, endRow):
                grid[(row, col)] = 'clay'

        elif line[0] == 'y':
            row = groups[0]
            startCol = groups[1]
            endCol = groups[2]+1

            if row > depth:
                depth = row

            for col in range(startCol, endCol):
                grid[(row, col)] = 'clay'

        else:
            raise Exception('Unexpected value for input', line)

    # do we need to sort this before returning?
    return grid, depth


def contains(element, list):
    return any((element == x).all() for x in list)


def produce_water():
    flow_dir = np.array([1, 0])
    done = False

    # initialize water_flow
    water_path = [water_source]
    while not done:
        next_water_pos = water_path[-1] + flow_dir

        # try to find next position
        if tuple(next_water_pos) in grid or contains(next_water_pos, water_path):
            found_next_pos = False

            blocked_left = False
            blocked_right = False

            level = 0
            step = 0
            while not found_next_pos:
                flow_dir_left = np.array([level, -step])
                flow_dir_right = np.array([level, step])

                next_water_pos_left = water_path[-1] + flow_dir_left
                next_water_pos_right = water_path[-1] + flow_dir_right

                if not blocked_left:
                    if tuple(next_water_pos_left) in grid:
                        blocked_left = True
                    elif not contains(next_water_pos_left, water_path):
                        next_water_pos = next_water_pos_left
                        found_next_pos = True
                        break

                if not blocked_right:
                    if tuple(next_water_pos_right) in grid:
                        blocked_right = True
                    elif not contains(next_water_pos_right, water_path):
                        next_water_pos = next_water_pos_right
                        found_next_pos = True
                        break

                step = step + 1

                # go up
                if blocked_left and blocked_right:
                    level -= 1
                    blocked_left = False
                    blocked_right = False
                    step = 0

        if (next_water_pos[0] > depth):
            done = True
            print(len(water_path))

        print('Filling position [{},{}]'.format(str(next_water_pos[0]), str(next_water_pos[1])))
        water_path.append(next_water_pos)


water_source = np.array([0, 500])
grid, depth = parse_input('sample_input.txt')
print(grid)
print(depth)
produce_water()
