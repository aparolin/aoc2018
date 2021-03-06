from copy import deepcopy
import itertools

def parse_input(path):
  grid = []

  with open(path, 'r') as f:
    grid = list(map(list, f.read().split('\n')))

  return grid

def check_surroundings(grid, row, col):
  total_open = 0
  total_trees = 0
  total_lumberyard = 0

  for r in range(row-1, row+2):
    for c in range(col-1, col+2):
      if r == row and c == col:
        continue

      if r >= 0 and r < len(grid) and c >= 0 and c < len(grid[0]):
        if grid[r][c] == '.':
          total_open += 1
        elif grid[r][c] == '|':
          total_trees += 1
        elif grid[r][c] == '#':
          total_lumberyard += 1
        else:
          raise Exception('Unexpected character: {}'.format(grid[r][c]))
  
  return (total_open, total_trees, total_lumberyard)

def apply_rules(grid, row, col):
  surrounds = check_surroundings(grid, row, col)

  if grid[row][col] == '.':
    if surrounds[1] >= 3:
      return '|'
    else:
      return '.'

  if grid[row][col] == '|':
    if surrounds[2] >= 3:
      return '#'
    else:
      return '|'

  if grid[row][col] == '#':
    if surrounds[2] >= 1 and surrounds[1] >= 1:
      return '#'
    else:
      return '.'

def grid2key(grid):
  grid_as_list = itertools.chain.from_iterable(grid)
  return ''.join(grid_as_list)

def change(grid):
  new_grid = deepcopy(grid)

  for row in range(len(grid)):
    for col in range(len(grid[0])):
      new_grid[row][col] = apply_rules(grid, row, col)

  return new_grid

def print_grid(grid):
  for row in range(len(grid)):
    for col in range(len(grid[0])):
      print(grid[row][col], end='')
    print('\n', end='')

def run(minutes):
  calculated_grids_catalog = {}
  calculated_grids = []

  grid = parse_input('input.txt')
  for i in range(minutes):
    grid_key = grid2key(grid)

    if grid_key in calculated_grids_catalog:
      previous_idx = calculated_grids_catalog[grid_key]
      delta = i - previous_idx
      missing_iterations = minutes - i - 1
      steps = missing_iterations % delta

      grid = calculated_grids[previous_idx + steps]
      break
    else:
      grid = change(grid)
      calculated_grids_catalog[grid_key] = i
      calculated_grids.append(grid)

  total_wooded = 0
  total_lumberyards = 0
  for row in range(len(grid)):
    for col in range(len(grid[0])):
      if grid[row][col] == '|':
        total_wooded += 1
      if grid[row][col] == '#':
        total_lumberyards += 1

  return total_wooded * total_lumberyards

print('Part 1: {}'.format(run(10)))
print('Part 2: {}'.format(run(1000000000)))