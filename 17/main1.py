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


def conflict(pos, water):
    return tuple(pos) in water and water[tuple(pos)] != 'flow'

def rotate_clockwise(vector):
    rm = np.matrix('0 1; -1 0')
    return np.squeeze(np.asarray(np.matmul(rm, vector)))


def rotate_counter_clockwise(vector):
    rm = np.matrix('0 -1; 1 0')
    return np.squeeze(np.asarray(np.matmul(rm, vector)))


def produce_water(clay_map):
    done = False

    # define unit vectors
    down_uv = np.array([1, 0])
    left_uv = np.array([0, -1])
    right_uv = np.array([0, 1])
    up_uv = np.array([-1, 0])

    left_flow_dirs = [down_uv, left_uv, right_uv, up_uv]
    right_flow_dirs = [down_uv, right_uv, left_uv, up_uv]

    # initialize water_flow with clockwise rotation
    water_path = {}
    water_path[tuple(water_source)] = 'flow'
    water_path_flows = [{
        "prev_pos": [-10, -10],
        "pos": water_source,
        "dirindex": 0,
        "direction": np.array([1, 0]),
        "rotate": "clockwise",
        "attempts": 1
    }]

    while not done:
        elements_to_remove = []

        for idx, flow in enumerate(water_path_flows):
            next_dir = left_flow_dirs[flow["dirindex"]] if flow["rotate"] == 'clockwise' else right_flow_dirs[flow["dirindex"]]
            next_pos = flow["pos"] + next_dir

            # hitting clay going down should split the flow
            if tuple(next_pos) in clay_map and flow["prev_pos"][0] == flow["pos"][0]-1:
                # update previous water state
                water_path[tuple(flow["pos"])] = 'stale'

                # go left
                next_pos = flow["pos"] + left_uv

                # spawn new flow to the right if not clay there too
                if tuple([flow["pos"][0], flow["pos"][1]+1]) not in clay_map:
                  new_flow = {
                      "prev_pos": [-10, 10],
                      "pos": flow["pos"],
                      "direction": down_uv,
                      "dirindex": 0,
                      "rotate": "counter_clockwise",
                      "attempts": 1
                  }
                  water_path_flows.append(new_flow)

            # hitting a wall or another water flow
            ignored = False
            flow["attempts"] = 0
            while tuple(next_pos) in clay_map or conflict(next_pos, water_path):
                # try to find next available direction
                flow["dirindex"] = 0 if flow["dirindex"] == len(left_flow_dirs)-1 else flow["dirindex"] + 1
                if flow["rotate"] == 'clockwise':
                    flow["direction"] = left_flow_dirs[flow["dirindex"]]
                else:
                    flow["direction"] = right_flow_dirs[flow["dirindex"]]

                next_pos = flow["pos"] + flow["direction"]
                flow["attempts"] += 1

                # there's no where to go
                if flow["attempts"] == 4:
                    elements_to_remove.append(idx)
                    flow["attempts"] = 1
                    ignored = True
                    break

            if not ignored:
                # update position and reset direction
                flow["prev_pos"] = flow["pos"]
                water_path[tuple(flow["pos"])] = 'flow' if flow["dirindex"] == 0 else 'stale'
                
                flow["pos"] = next_pos
                flow["dirindex"] = 0

                print('Filling position [{},{}]'.format(str(flow["pos"][0]), str(flow["pos"][1])))
        # remove redundant flows
        for idx2, el_to_remove_idx in enumerate(elements_to_remove):
            del water_path_flows[el_to_remove_idx - idx2]
        elements_to_remove = []

        # are we done?
        done = all(p[0] > depth for p in water_path)


water_source = np.array([0, 500])
clay_map, depth = parse_input('sample_input.txt')
print(clay_map)
print(depth)
produce_water(clay_map)
