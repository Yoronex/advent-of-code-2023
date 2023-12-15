import { readData } from '../../shared.ts';
import chalk from 'chalk';

function hash(word: string): number {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    const ascii = word.charCodeAt(i);
    result += ascii;
    result *= 17;
    result = result % 256;
  }
  return result;
}

interface Lens {
  label: string;
  focalLength: number;
}

type Boxes = Map<number, Lens[]>;

export async function day15b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const operations = data.map((line) => line.split(',')).flat();

  const boxes: Boxes = new Map();
  operations.forEach((operation) => {
    if (operation.endsWith('-')) {
      const label = operation.substring(0, operation.length - 1);
      const boxNumber = hash(label);
      // No box, so also no lenses
      if (!boxes.has(boxNumber)) return;
      const lenses = boxes.get(boxNumber);
      const index = lenses.findIndex((l) => l.label === label);
      // Lens with label not found
      if (index < 0) return;
      lenses.splice(index, 1);
      boxes.set(boxNumber, lenses);
    } else {
      const label = operation.substring(0, operation.length - 2);
      const focalLength = parseInt(operation.charAt(operation.length - 1));
      const lens: Lens = { label, focalLength };
      const boxNumber = hash(label);
      if (!boxes.has(boxNumber)) {
        // Box does not exist, so add a box with this single lens
        boxes.set(boxNumber, [lens]);
        return
      }
      const lenses = boxes.get(boxNumber);
      const index = lenses.findIndex((l) => l.label === label);
      if (index < 0) {
        // Lens with label not found
        lenses.push(lens);
      } else {
        // Swap with new lens
        lenses[index].focalLength = focalLength;
      }
      boxes.set(boxNumber, lenses);
    }
  });

  let focusPower = 0;
  boxes.forEach((lenses, boxNumber) => {
    focusPower += lenses.reduce((total, lens, index) =>
      total + (((boxNumber + 1) * (index + 1) * lens.focalLength)), 0);
  });

  return focusPower;
}

const answer = await day15b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
