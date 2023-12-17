import { readData } from '../../shared.ts';
import chalk from 'chalk';

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

interface Beam {
  x: number;
  y: number;
  direction: Direction;
}

export async function day16b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const grid = data.map((line) => line.split(''));
  const width = grid[0].length;
  const height = grid.length;

  const getTile = (x: number, y: number): string => {
    return grid[y][x];
  }

  const applyEncounter = (direction: Direction, encounter: string): Direction[] => {
    switch (encounter) {
      case '|':
        if (direction % 2 === 1) return [Direction.UP, Direction.DOWN];
        return [direction];
      case '-':
        if (direction % 2 === 0) return [Direction.LEFT, Direction.RIGHT];
        return [direction];
      case '/':
        if (direction % 2 === 1) return [(direction + 3) % 4];
        return [(direction + 1) % 4];
      case '\\':
        if (direction % 2 === 0) return [(direction + 3) % 4];
        return [(direction + 1) % 4];
      default:
        return [direction];
    }
  }

  const getNewBeams = (beam: Beam, newDirections: Direction[]): Beam[] => {
    const newBeams = newDirections.map((direction) => {
      const newBeam = {
        x: beam.x,
        y: beam.y,
        direction,
      }
      switch (direction) {
        case Direction.UP: newBeam.y -= 1; break;
        case Direction.DOWN: newBeam.y += 1; break;
        case Direction.LEFT: newBeam.x -= 1; break;
        case Direction.RIGHT: newBeam.x += 1; break;
      }
      return newBeam;
    });

    // Only return beams that are inside the grid
    return newBeams.filter((beam) => beam.x >= 0 && beam.x < width && beam.y >= 0 && beam.y < height);
  }

  const startPositionsTop: Beam[] = new Array(width).fill(0).map((x, i) => ({
    x: i,
    y: 0,
    direction: Direction.DOWN,
  }));
  const startPositionsBottom: Beam[] = new Array(width).fill(0).map((x, i) => ({
    x: i,
    y: height - 1,
    direction: Direction.UP,
  }));

  const startPositionsLeft: Beam[] = new Array(height).fill(0).map((x, i) => ({
    x: 0,
    y: i,
    direction: Direction.RIGHT,
  }));
  const startPositionsRight: Beam[] = new Array(height).fill(0).map((x, i) => ({
    x: width - 1,
    y: i,
    direction: Direction.LEFT,
  }));
  const startPositions = [...startPositionsTop, ...startPositionsRight, ...startPositionsBottom, ...startPositionsLeft];

  const energizedTiles = startPositions.map((start, index) => {
    if (index % 10 === 0) {
      console.log(`Start calculation start position ${index + 1}/${startPositions.length}`);
    }

    const beams: Beam[] = [start];
    const depthFirstSearch = (currentBeam: Beam) => {
      if (currentBeam.x === 7 && currentBeam.y === 6) {
        // console.log('break');
      }
      const encounter = getTile(currentBeam.x, currentBeam.y);
      const newDirections = applyEncounter(currentBeam.direction, encounter);
      const resultBeams = getNewBeams(currentBeam, newDirections);
      // Only keep beams that we have not seen before
      const newBeams = resultBeams.filter((b1) => beams.findIndex((b2) => b1.x === b2.x && b1.y === b2.y && b1.direction == b2.direction) < 0);
      beams.push(...newBeams);
      newBeams.forEach((newBeam) => {
        depthFirstSearch(newBeam);
      });
    }

    depthFirstSearch(beams[0]);

    const energizedTiles = beams.filter((beam1, index, all) => index === all
      .findIndex((beam2) => beam1.x === beam2.x && beam1.y === beam2.y));

    return energizedTiles.length;
  });

  return Math.max(...energizedTiles);
}

const answer = await day16b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
