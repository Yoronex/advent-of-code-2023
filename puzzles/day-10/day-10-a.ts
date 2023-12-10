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

interface Pipe {
  from: Node;
  to: Node;
}

interface VisitedPipe extends Pipe {
  step?: number;
}

export async function day10a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  // const pipes: Pipe[] = [];
  let startPoint: Node;

  // const addPipe = ((from: Node, to: Node) => {
  //   // One direction of pipe does not exist in the current list of pipes
  //   const pipes1 = pipes.filter((p) =>
  //     (JSON.stringify(from) === JSON.stringify(p.from) && JSON.stringify(to) === JSON.stringify(p.to)
  //       || JSON.stringify(to) === JSON.stringify(p.from) && JSON.stringify(from) === JSON.stringify(p.to)));
  //   // If it does not exist, add the pipe in this single direction
  //   if (pipes1.length === 0) pipes.push({ from, to });
  //   // Other direction
  //   // const pipes2 = pipes.filter((p) =>
  //   //   JSON.stringify(to) === JSON.stringify(p.from) && JSON.stringify(from) === JSON.stringify(p.to));
  //   // if (pipes2.length === 0) pipes.push({ from: to, to: from });
  // });

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
  }))

  // data.forEach((line, y) => {
  //   console.log(`Next line: ${y}`);
  //   line.split('').forEach((char, x) => {
  //     switch (char) {
  //       case 'S': startPoint = { x, y }; break;
  //       case '|':
  //         addPipe({ x, y: y - 1 }, { x, y }, ); // North
  //         addPipe({ x, y: y + 1 }, { x, y }, ); // South
  //         break;
  //       case '-':
  //         addPipe({ x: x - 1, y }, { x, y }); // West
  //         addPipe({ x: x + 1, y }, { x, y }); // East
  //         break;
  //       case 'L':
  //         addPipe({ x: x, y: y - 1 }, { x, y }); // North
  //         addPipe({ x: x + 1, y }, { x, y }); // East
  //         break;
  //       case 'J':
  //         addPipe({ x: x, y: y - 1 }, { x, y }); // North
  //         addPipe({ x: x - 1, y }, { x, y }); // West
  //         break;
  //       case '7':
  //         addPipe({ x, y: y + 1 }, { x, y }, ); // South
  //         addPipe({ x: x - 1, y }, { x, y }); // West
  //         break;
  //       case 'F':
  //         addPipe({ x, y: y + 1 }, { x, y }, ); // South
  //         addPipe({ x: x + 1, y }, { x, y }); // East
  //         break;
  //       case '.': break;
  //       default: throw new Error('Unknown case: ' + char);
  //     }
  //   });
  // });

  // const visitedPipes: VisitedPipe[] = [...pipes];
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

    switch (newDirection) {
      case Direction.NORTH: currentPoint.y -= 1; break;
      case Direction.EAST: currentPoint.x += 1; break;
      case Direction.SOUTH: currentPoint.y += 1; break;
      case Direction.WEST: currentPoint.x -= 1; break;
    }
    currentDirection = newDirection;
  }

  return Math.floor(index / 2);
}

const answer = await day10a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
