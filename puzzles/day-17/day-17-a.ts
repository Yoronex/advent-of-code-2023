import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from "lodash";

enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

interface Node {
  x: number;
  y: number;
  direction: Direction;
  length: number;
}

interface Step extends Node {
  heatLoss: number;
  heuristic: number;
  parent: Node;
}

export async function day17a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const grid = data.map((line) => line.split('').map((char) => parseInt(char)));
  const width = grid[0].length;
  const height = grid.length;
  const averageHeatLoss =  _.mean(grid.flat()) - 2;

  const getHeatLoss = (x: number, y: number): number => {
    return grid[y][x];
  }

  const getPossibleSteps = (step: Step): Step[] => {
    const newDirections: Direction[] = [(step.direction + 1) % 4, (step.direction + 3) % 4];
    if (step.length < 3) newDirections.push(step.direction);

    const newSteps: Step[] = newDirections.map((direction) => {
      let node: Node;
      let length = direction === step.direction ? step.length + 1 : 1
      switch (direction) {
        case Direction.UP: node = { x: step.x, y: step.y - 1, length, direction }; break;
        case Direction.DOWN: node = { x: step.x, y: step.y + 1, length, direction }; break;
        case Direction.LEFT: node = { x: step.x - 1, y: step.y, length, direction }; break;
        case Direction.RIGHT: node = { x: step.x + 1, y: step.y, length, direction }; break;
      }
      return {
        ...node,
        heuristic: Number.POSITIVE_INFINITY,
        heatLoss: step.heatLoss,
        parent: step,
      };
    });

    // Filter invalid steps
    const validSteps = newSteps.filter((newStep) => newStep.x >= 0 && newStep.x < width && newStep.y >= 0 && newStep.y < height);
    // Add correct heatLoss and calculate the heuristic
    return validSteps.map((newStep) => {
      const heatLoss = newStep.heatLoss + getHeatLoss(newStep.x, newStep.y);
      const distance = (width - newStep.x - 1) + (height - newStep.y - 1);
      const heuristic = heatLoss + distance * averageHeatLoss;
      return {
      ...newStep,
        heatLoss,
        heuristic,
      };
    });
  }

  const getStepIndex = (list: Step[], node: Node): number => {
    if (node === undefined) {
      console.log('break');
    }
    return list.findIndex((s) => s.x === node.x && s.y === node.y && s.direction === node.direction && node.length === s.length);
  }

  const getStep = (list: Step[], node: Node): Step | undefined => {
    const index = getStepIndex(list, node);
    if (index >= 0) return list[index];
    return undefined;
  }

  const addToList = (list: Step[], step: Step): Step[] => {
    const existingStepIndex = getStepIndex(list, step);
    if (existingStepIndex >= 0) {
      list.splice(existingStepIndex, 1);
    }
    list.push(step);
    return list;
  }

  let seenSteps: Step[] = [];
  let possibleSteps: Step[] = [{
    x: 0,
    y: 0,
    length: 1,
    heatLoss: 0,
    direction: Direction.RIGHT,
    heuristic: (width + height) * averageHeatLoss,
    parent: { x: 0, y: 0, length: 0, direction: Direction.RIGHT },
  }];
  let goal: Step = undefined;

  while (possibleSteps.length > 0 && !goal) {
    const step = possibleSteps.shift();
    seenSteps = addToList(seenSteps, step);
    const newSteps = getPossibleSteps(step);

    newSteps.forEach((newStep) => {
      if (goal) return;
      if (newStep.x === width - 1 && newStep.y === height - 1) {
        goal = newStep;
        return;
      }
      if (getStep(possibleSteps, newStep)?.heatLoss < newStep.heatLoss) return;
      if (getStep(seenSteps, newStep)?.heatLoss < newStep.heatLoss) return;

      possibleSteps = addToList(possibleSteps, newStep).sort((a, b) => a.heuristic - b.heuristic);
    });
  }

  if (goal === undefined) throw new Error('Target not found');

  const reconstructPath = (goal: Step, steps: Step[]): Step[] => {
    const path: Step[] = [goal];
    while (true) {
      const parent = getStep(steps, path[path.length - 1].parent);
      path.push(parent);
      if (parent.x === 0 && parent.y === 0) break;
    }
    return path.reverse();
  }

  const solutionGrid = grid.map((line) => line.map((char) => char.toString()));
  reconstructPath(goal, seenSteps).forEach((step) => {
    let char: string;
    switch (step.direction) {
      case Direction.UP: char = '^'; break;
      case Direction.RIGHT: char = '>'; break;
      case Direction.DOWN: char = 'v'; break;
      case Direction.LEFT: char = '<'; break;
    }
    solutionGrid[step.y][step.x] = char;
  });
  console.log(solutionGrid.map((line) => line.join('')).join('\n') + '\n\n');

  return goal.heatLoss;
}

const answer = await day17a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
