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
    return any((pos == x).all() for x in water)

def rotate_clockwise(vector):
    rm = np.matrix('0 1; -1 0')
    return np.squeeze(np.asarray(np.matmul(rm, vector)))


def rotate_counter_clockwise(vector):
    rm = np.matrix('0 -1; 1 0')
    return np.squeeze(np.asarray(np.matmul(rm, vector)))

def run(water_source, clay_map, depth):
  fall_list = [water_source]

  spread_list = []
  water_path = set()

  while len(fall_list) > 0:
    cur_pos = fall_list.pop()
    # print('Filling position [{},{}]'.format(str(cur_pos[0]), str(cur_pos[1])))
    water_path.add(tuple(cur_pos))

    next_pos = cur_pos + down_uv
    # hit the clay
    if tuple(next_pos) in clay_map:
      spread_list.append(cur_pos)
    elif next_pos[0] <= depth:
      fall_list.append(next_pos)

    # spread everything
    while len(spread_list) > 0:
      cur_pos = spread_list.pop()

      # spread right
      next_pos = cur_pos + right_uv
      dead_end_r = True
      while tuple(next_pos) not in clay_map:
        water_path.add(tuple(next_pos))
        # print('Filling position [{},{}]'.format(str(next_pos[0]), str(next_pos[1])))
        
        # can go down?
        down_pos = next_pos + down_uv
        if tuple(down_pos) not in clay_map and not conflict(down_pos, water_path):
          fall_list.append(down_pos)
          dead_end_r = False
          break
        else:
          next_pos += right_uv

      # spread left
      next_pos = cur_pos + left_uv
      dead_end_l = True
      while tuple(next_pos) not in clay_map:
        water_path.add(tuple(next_pos))
        # print('Filling position [{},{}]'.format(str(next_pos[0]), str(next_pos[1])))
        
        # can go down?
        down_pos = next_pos + down_uv
        if tuple(down_pos) not in clay_map and not conflict(down_pos, water_path):
          fall_list.append(down_pos)
          dead_end_l = False
          break
        else:
          next_pos += left_uv

      # we have to go up
      if dead_end_l and dead_end_r:
        spread_list.append(cur_pos + up_uv)
  
  # -1 to remove the water spring
  return water_path
  # print('result', len(water_path)-1)

def print_result(result):
  f = open('result.txt','w')
 

# define some unit vectors
down_uv = np.array([1,0])
left_uv = np.array([0, -1])
right_uv = np.array([0, 1])
up_uv = np.array([-1, 0])

clay_map, depth = parse_input('input.txt')
water_source = np.array([0, 500])
water_path = run(water_source, clay_map, depth)
# print_result(water_path)