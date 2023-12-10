import { readData } from '../../shared.ts';
import chalk from 'chalk';

enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

interface Node {
  x: number;
  y: number;
}

interface VisitedNode extends Node {
  width: number;
  sourceDirection: Direction;
}

export async function day10b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  // const pipes: Pipe[] = [];
  let startPoint: Node;

  let north = false;
  let east = false;
  let south = false;
  let west = false;
  const grid = data.map((line, y) => line.split(''));
  grid.forEach((line, y) => line.forEach((char, x) => {
    if (char === 'S') {
      startPoint = { x, y };
      if (['-', 'L', 'F'].includes(grid[y][x - 1])) west = true;
      if (['-', 'J', '7'].includes(grid[y][x + 1])) east = true;
      if (['|', '7', 'F'].includes(grid[y - 1][x])) north = true;
      if (['|', 'L', 'J'].includes(grid[y + 1][x])) south = true;

      if ([north, east, south, west].reduce((total, i) => total + (i ? 1 : 0), 0) !== 2) {
        throw new Error('Did not find two directions');
      }

      if (north && east) {
        grid[y][x] = 'L';
      } else if (north && west) {
        grid[y][x] = 'J';
      } else if (south && west) {
        grid[y][x] = '7';
      } else if (south && east) {
        grid[y][x] = 'F';
      } else if (north && south) {
        grid[y][x] = '|';
      } else if (west && east) {
        grid[y][x] = '-';
      }
    }
  }));

  if (startPoint === undefined) throw new Error('No starting point');

  const visitedNodes: VisitedNode[] = [];
  let index = 0;
  let currentPoint: Node = { ...startPoint };
  let currentDirection: Direction;
  if (south) {
    currentDirection = Direction.NORTH;
  } else if (west) {
    currentDirection = Direction.EAST;
  } else if (north) {
    currentDirection = Direction.SOUTH;
  } else if (east) {
    currentDirection = Direction.WEST;
  }

  const getCounterDirection = (direction: Direction): Direction => {
    return (direction + 2) % 4;
  }

  const getDirections = (char: string): Direction[] => {
    switch (char) {
      case '|': return [Direction.NORTH, Direction.SOUTH];
      case '-': return [Direction.WEST, Direction.EAST];
      case 'L': return [Direction.NORTH, Direction.EAST];
      case 'J': return [Direction.NORTH, Direction.WEST];
      case '7': return [Direction.SOUTH, Direction.WEST];
      case 'F': return [Direction.SOUTH, Direction.EAST];
      case '.': return [];
      default: throw new Error(`Unknown case: ${char}`);
    }
  }

  while (JSON.stringify(currentPoint) !== JSON.stringify(startPoint) || index === 0) {
    index += 1;
    const char = grid[currentPoint.y][currentPoint.x]
    const directions = getDirections(char);
    const newDirections = directions.filter((d) => d !== getCounterDirection(currentDirection));
    if (newDirections.length !== 1) throw new Error('Not exactly one new direction!');
    const newDirection = newDirections[0];

    const lastVisitedNode = visitedNodes[visitedNodes.length - 1];
    if (
      (newDirection === Direction.EAST || newDirection === Direction.WEST || newDirection === lastVisitedNode?.sourceDirection)
        && lastVisitedNode?.y === currentPoint.y
    ) {
      visitedNodes[visitedNodes.length - 1] = {
        ...lastVisitedNode,
        x: Math.min(currentPoint.x, lastVisitedNode.x),
        width: lastVisitedNode.width + 1,
      }
    } else {
      visitedNodes.push({ ...currentPoint, width: 1, sourceDirection: currentDirection });
    }

    switch (newDirection) {
      case Direction.NORTH: currentPoint.y -= 1; break;
      case Direction.EAST: currentPoint.x += 1; break;
      case Direction.SOUTH: currentPoint.y += 1; break;
      case Direction.WEST: currentPoint.x -= 1; break;
    }
    currentDirection = newDirection;
  }

  if (visitedNodes.length % 2 !== 0) {
    throw new Error('Not an even amount of nodes');
  }
  for (let y = 0; y < grid.length; y += 1) {
    const nodes = visitedNodes.filter((n) => n.y === y);
    if (nodes.length % 2 !== 0) {
      throw new Error(`No even amount of nodes on y= ${y + 1}`);
    }
  }

  const sortedNodes = visitedNodes.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  let count = 0;
  let inside = false;
  let currentY = 0;
  sortedNodes.forEach((node, index, all) => {
    if (currentY !== node.y && inside) {
      throw new Error('Start new line inside grid');
    }
    if (inside) {
      const other = all[index - 1];
      count += Math.max(
        0,
        (node.x + node.width) - (other.x),
      );
    }
    inside = !inside;
    currentY = node.y;
  })

  const pathArea = sortedNodes.reduce((total, node) => total + node.width, 0)

  return count - pathArea;
}

const answer = await day10b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
