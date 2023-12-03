import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const partNumbers: number[][] = data
    .map((line) => line.split(''))
    .map((chars, rowIndex, all) => {
      const result: number[] = [];
      let currentNumber = '';
      let hasAdjacentSymbol = false;

      chars.forEach((char, colIndex) => {
        const digit = parseInt(char, 10);
        if (!Number.isNaN(digit)) {
          currentNumber += char;

          const rowIndices = [rowIndex - 1, rowIndex, rowIndex + 1].filter((i) => i >= 0 && i < all.length);
          const columnIndices = [colIndex - 1, colIndex, colIndex + 1].filter((i) => i >= 0 && i < chars.length);

          rowIndices.forEach((row) => columnIndices.forEach((col) => {
            if (Number.isNaN(parseInt(all[row][col], 10)) && all[row][col] !== '.') {
              hasAdjacentSymbol = true;
            }
          }));

        } else if (hasAdjacentSymbol && currentNumber.length > 0) {
          result.push(parseInt(currentNumber, 10));
          currentNumber = '';
          hasAdjacentSymbol = false;
        } else {
          currentNumber = '';
          hasAdjacentSymbol = false;
        }
      });

      if (hasAdjacentSymbol && currentNumber.length > 0) result.push(parseInt(currentNumber, 10));

      return result;
    });

  return partNumbers.flat().reduce((total, part) => total + part, 0);
}

const answer = await day3a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
