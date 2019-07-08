import re
import math

def parse_input(input):
  scan = {}
  minY = minX = math.inf
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
    print('\n', end='')

def spread(from_node, dir, flow_list, node_popped):
  spreading = True

  dir_factor = 1 if dir == 'right' else -1

  wall = None
  popped = False
  while spreading:
    next_node = (from_node[0] + dir_factor, from_node[1])
    next_node_down = (from_node[0], from_node[1]+1)
    if next_node_down not in scan:
      scan[next_node_down] = 'flowing'
      flow_list.append(next_node_down)
      break
    
    if next_node not in scan:
      scan[next_node] = 'flowing'
      flow_list.append(next_node)
    elif scan[next_node] == 'clay':
      wall = next_node
      break
    elif scan[next_node] == 'flowing':
      if dir == 'left' or (dir == 'right' and not node_popped):
        flow_list.remove(from_node)
        popped = True

      # check if we are trapped anyway
      while True:
        next_node = (next_node[0] + dir_factor, next_node[1])
        if next_node in scan and scan[next_node] == 'clay':
          spreading = False
          wall = next_node
          break
        elif next_node not in scan:
          spreading = False
          break

      spreading = False
      break
    from_node = next_node

  return wall, popped

scan, bounds = parse_input('input.txt')

flow_list = [(500, 0)]
while len(flow_list) > 0:
  node = flow_list[-1]

  if node in scan and scan[node] == 'stale':
    flow_list.remove(node)
    continue

  # check if we can go down or if we should remove elements from the list
  next_pos = (node[0], node[1]+1)
  if next_pos not in scan and next_pos[1] <= bounds[1][1]:
    flow_list.append(next_pos)
    scan[next_pos] = 'flowing'
    continue
  else:
    if next_pos[1] > bounds[1][1] or scan[next_pos] == 'flowing':
      flow_list.remove(node)
      continue

  left_wall, popped = spread(node, 'left', flow_list, False)
  right_wall, _ = spread(node, 'right', flow_list, popped)

  # if we hit both sides, we are trapped and need to switch the water to stale state
  if left_wall is not None and right_wall is not None:
    y = node[1]
    for x in range(left_wall[0]+1, right_wall[0]):
      scan[(x,y)] = 'stale'

draw_scan(scan, bounds)

total_flowing = 0
total_stale = 0
for item in scan:
  # allow 1 extra position in x direction at the edges
  if item[0] >= bounds[0][0]-1 and item[0] <= bounds[1][0]+1 and \
  item[1] >= bounds[0][1] and item[1] <= bounds[1][1]:
    if scan[item] == 'flowing':
      total_flowing += 1
    if scan[item] == 'stale':
      total_stale += 1

print('Result part 1: {}'.format(total_flowing + total_stale))
print('Result part 2: {}'.format(total_stale))