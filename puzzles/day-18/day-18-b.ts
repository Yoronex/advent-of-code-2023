import { readData } from '../../shared.ts';
import chalk from 'chalk';

enum Direction {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

interface DigStep {
  direction: Direction;
  length: number;
}

interface Node {
  x: number;
  y: number;
  length: number;
  sourceDirection: Direction;
}

export async function day18b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const instructionToDirection = (label: string): Direction => {
    switch (label) {
      case '3': return Direction.NORTH;
      case '1': return Direction.SOUTH;
      case '2': return Direction.WEST;
      case '0': return Direction.EAST;
      default: throw new Error(`Unknown direction label "${label}"`);
    }
  }

  const digSteps: DigStep[] = data.map((line): DigStep => {
    const parts = line.split(' ');
    const color = parts[2].substring(1, parts[2].length - 2);
    const direction = color.charAt(color.length - 1);
    const length = parseInt(color.substring(1, color.length - 1), 16);
    return {
      direction: instructionToDirection(direction),
      length,
    };
  });

  console.log(`${new Date().toLocaleTimeString()}: Parsed input data, now creating grid...`);

  const currentPosition = { x: 0, y: 0 };
  let visitedNodes: Node[] = [{ ...currentPosition, length: 0, sourceDirection: Direction.EAST}];
  digSteps.forEach((instruction, instructionNo, all) => {
    if (visitedNodes.length === 13) {
      console.log('');
    }
    for (let i = 0; i < instruction.length; i += 1) {
      const currentDirection = instruction.direction;

      const lastVisitedNode = visitedNodes[visitedNodes.length - 1];
      const previousDirection = lastVisitedNode.sourceDirection;
      const nextDirection = all[(instructionNo + 1) % all.length].direction;
      if (
        (currentDirection === Direction.EAST || currentDirection === Direction.WEST)
        && lastVisitedNode?.y === currentPosition.y
      ) {
        visitedNodes[visitedNodes.length - 1] = {
          ...lastVisitedNode,
          x: Math.min(currentPosition.x, lastVisitedNode.x),
          length: lastVisitedNode.length + 1,
        }
      } else {
        visitedNodes.push({...currentPosition, length: 1, sourceDirection: currentDirection});
      }

      switch (currentDirection) {
        case Direction.NORTH:
          currentPosition.y -= 1;
          break;
        case Direction.EAST:
          currentPosition.x += 1;
          break;
        case Direction.SOUTH:
          currentPosition.y += 1;
          break;
        case Direction.WEST:
          currentPosition.x -= 1;
          break;
      }
    }
  });
  console.log(`${new Date().toLocaleTimeString()}: Created grid, now setting the top left corner of the grid to 0,0...`);

  const xCoordinates = visitedNodes.map((n) => n.x).sort((a, b) => a - b);
  const yCoordinates = visitedNodes.map((n) => n.y).sort((a, b) => a - b);
  const xMin = xCoordinates[0];
  const width = xCoordinates[xCoordinates.length - 1] - xMin + 1;
  const yMin = yCoordinates[0];
  const height = yCoordinates[yCoordinates.length - 1] - yMin + 1;
  visitedNodes = visitedNodes.map((node) => {
    return {
      ...node,
      x: node.x - xMin,
      y: node.y - yMin,
    }
  });
  console.log(`${new Date().toLocaleTimeString()}: Moved the origin, now merging nodes in case of a zig-zag...`);

  visitedNodes = visitedNodes.filter((currentNode, i) => {
    const pNode2 = visitedNodes[(i - 2 + visitedNodes.length) % visitedNodes.length];
    const pNode1 = visitedNodes[(i - 1 + visitedNodes.length) % visitedNodes.length];
    if (pNode1.sourceDirection % 2 === 1 && pNode2.sourceDirection === currentNode.sourceDirection && pNode1.y === currentNode.y) {
      pNode1.length += 1;
      pNode1.x = Math.min(pNode1.x, currentNode.x);
      return false;
    }
    return true;
  });
  console.log(`${new Date().toLocaleTimeString()}: Merged nodes, now sorting the grid nodes...`);

  const sortedNodes = visitedNodes.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
  console.log(`${new Date().toLocaleTimeString()}: Sorted the grid nodes, now validating the grid...`);

  if (visitedNodes.length % 2 !== 0) {
    throw new Error('Not an even amount of nodes');
  }
  for (let y = 0; y < height; y += 1) {
    const nodes = visitedNodes.filter((n) => n.y === y);
    if (nodes.length % 2 !== 0) {
      throw new Error(`No even amount of nodes on y= ${y}`);
    }
  }
  console.log(`${new Date().toLocaleTimeString()}: Validated the grid, now calculating the area...`);

  let area = 0;
  let inside = false;
  let currentY = 0;
  sortedNodes.forEach((node, index, all) => {
    if (currentY !== node.y && inside) {
      throw new Error('Start new line inside grid');
    }
    if (inside) {
      const other = all[index - 1];
      area += Math.max(
        0,
        (node.x + node.length) - (other.x),
      );
    }
    inside = !inside;
    currentY = node.y;
  });

  return area;
}

const answer = await day18b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
