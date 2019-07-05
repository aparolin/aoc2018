import re
import math

def parse_input(input):
  scan = {}
  minY = 0
  minX = math.inf
  maxX = maxY = -math.inf

  with open(input, 'r') as f:
    content = f.read()
    lines = content.split('\n')
    for l in lines:
      x0 = x1 = y0 = y1 = 0
      if l[0] == 'x':
        values = list(map(int, re.search('x=(\d+).*y=(\d+)..(\d+)', l).groups()))
        x0 = x1 = values[0]
        y0 = values[1]
        y1 = values[2]
      else:
        values = list(map(int, re.search('y=(\d+).*x=(\d+)..(\d+)', l).groups()))
        y0 = y1 = values[0]
        x0 = values[1]
        x1 = values[2]

      for x in range(x0, x1+1):
        for y in range(y0, y1+1):
          if x < minX:
            minX = x
          if x > maxX:
            maxX = x
          if y < minY:
            minY = y
          if y > maxY:
            maxY = y

          scan[(x,y)] = 'clay'

    f.close()

  return scan, [(minX, minY), (maxX, maxY)]

def draw_scan(scan, bounds):
  for y in range(bounds[0][1] - 1, bounds[1][1] + 2):
    for x in range(bounds[0][0] - 1, bounds[1][0] + 2):
      if (x,y) in scan:
        if scan[(x,y)] == 'clay':
          print('#', end='')
        elif scan[(x,y)] == 'flowing':
          print('|', end='')
        elif scan[(x,y)] == 'stale':
          print('~', end='')
        else:
          raise Exception('Invalid type in scan: {}'.format(scan[(x,y)]))
      else:
        print('.', end='')
    print('\n')

scan, bounds = parse_input('sample_input.txt')

flow_list = [(500, 0)]
spreading_list_left = []
spreading_list_right = []
stale_list = []

while len(flow_list) > 0:
  # draw_scan(scan, bounds)

  # print(flow_list)
  node = flow_list[-1]

  # check if we can go down
  next_pos = (node[0], node[1]+1)
  if next_pos not in scan and next_pos[1] <= bounds[1][1]:
    flow_list.append(next_pos)
    scan[next_pos] = 'flowing'
    continue
  else:
    if next_pos[1] > bounds[1][1]:
      flow_list.pop()
      continue
    # node_left = (node[0]-1, node[1])
    # node_right = (node[0]+1, node[1])
    # if node_left in scan and scan[node_left] == 'flowing' and node_right in scan and scan[node_right] == 'flowing':
    #   flow_list.pop()
    #   continue
    if scan[next_pos] == 'flowing':
      flow_list.pop()
      continue

  # start spreading from current node
  node = flow_list.pop()
  hit_left = False
  hit_right = False
  left_wall = None
  right_wall = None

  # spread left
  spreading_node = node
  while True:
    spreading_node_falling = (spreading_node[0], spreading_node[1]+1)
    if spreading_node_falling not in scan:
      scan[spreading_node_falling] = 'flowing'
      flow_list.append(spreading_node_falling)
      break
    
    left_node = (spreading_node[0]-1, spreading_node[1])
    if left_node not in scan:
      scan[left_node] = 'flowing'
      spreading_node = left_node
    else:
      left_wall = left_node
      hit_left = True
      break

  # spread right
  spreading_node = node
  while True:
    spreading_node_falling = (spreading_node[0], spreading_node[1]+1)
    if spreading_node_falling not in scan:
      scan[spreading_node_falling] = 'flowing'
      flow_list.append(spreading_node_falling)
      break
    
    right_node = (spreading_node[0]+1, spreading_node[1])
    if right_node not in scan:
      scan[right_node] = 'flowing'
      spreading_node = right_node
    else:
      right_wall = right_node
      hit_right = True
      break

    # if we hit both sides, we are trapped and need to switch the water to stale state

  if hit_left and hit_right:
    y = node[1]
    for x in range(left_wall[0]+1, right_wall[0]):
      scan[(x,y)] = 'stale'

  # input("Press Enter to continue...")
draw_scan(scan, bounds)