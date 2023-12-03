import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const dataset: string[][] = data
    .map((line) => line.split(''));
  const result: number[][][] = new Array(dataset.length).fill([])
    .map(() => new Array(dataset[0].length).fill(0).map(() => []));

  dataset.forEach((chars, rowIndex, all) => {
      let currentNumber = '';
      let gearLocation: { row: number, col: number } | undefined;

      chars.forEach((char, colIndex) => {
        const digit = parseInt(char, 10);
        if (!Number.isNaN(digit)) {
          currentNumber += char;

          const rowIndices = [rowIndex - 1, rowIndex, rowIndex + 1].filter((i) => i >= 0 && i < all.length);
          const columnIndices = [colIndex - 1, colIndex, colIndex + 1].filter((i) => i >= 0 && i < chars.length);

          rowIndices.forEach((row) => columnIndices.forEach((col) => {
            if (all[row][col] === '*') {
              gearLocation = { row, col };
            }
          }));

        } else if (gearLocation && currentNumber.length > 0) {
          result[gearLocation.row][gearLocation.col].push(parseInt(currentNumber, 10));
          currentNumber = '';
          gearLocation = undefined;
        } else {
          currentNumber = '';
          gearLocation = undefined;
        }
      });

      if (gearLocation && currentNumber.length > 0) result[gearLocation.row][gearLocation.col].push(parseInt(currentNumber, 10));
    });

  const gears = result.flat().filter((gear) => gear.length >= 2);
  const ratios = gears.map((gear) => gear.reduce((ratio, part) => ratio * part, 1));

  return ratios.reduce((total, ratio) => total + ratio, 0);
}

const answer = await day3b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
