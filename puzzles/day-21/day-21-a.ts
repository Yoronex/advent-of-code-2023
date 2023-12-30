import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Position {
  x: number;
  y: number;
}

export async function day21a(dataPath?: string) {
  const data = await readData(dataPath);
  const grid = data.map((line) => line.split(''));
  const width = grid[0].length;
  const height = grid.length;

  let startPosition: Position;
  grid.forEach((line, y) => line.forEach((char, x) => {
    if (char === 'S') {
      startPosition = { x, y };
      grid[y][x] = '.';
    }
  }));
  if (!startPosition) throw new Error('No starting point found');

  const cellIsGarden = ({ x, y }: Position) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    return grid[y][x] === '.';
  }

  const getNewPositions = ({ x, y }: Position): Position[] => {
    const newPositions: Position[] = [
      { x, y: y - 1 },
      { x, y: y + 1 },
      { x: x - 1, y },
      { x: x + 1, y },
    ];
    return newPositions.filter((position) => cellIsGarden(position));
  };

  const printGrid = (positions: Position[]) => {
    const gridCopy: string[][] = JSON.parse(JSON.stringify(grid));
    positions.forEach(({ x, y }) => gridCopy[y][x] = 'O');

    console.log(gridCopy.map((line) => line.join('')).join('\n'));
    console.log('');
  }

  const steps = 64;
  let positions: Position[] = [startPosition];
  for (let i = 0; i < steps; i += 1) {
    positions = positions
      .map((position) => getNewPositions(position))
      .flat()
      .filter((pos1, index, all) => {
        return index === all.findIndex((pos2) => pos1.x === pos2.x && pos1.y === pos2.y)
      });

    console.log(`${i + 1} steps`);
    printGrid(positions);
  }

  return positions.length;
}

const answer = await day21a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
