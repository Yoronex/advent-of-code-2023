import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);
  const numbers = data.map((item) => {
    const digits = item
      .split('')
      .map((char) => parseInt(char, 10))
      .filter((digit) => !Number.isNaN(digit));
    return parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
  }).filter((digit) => !Number.isNaN(digit));
  return numbers.reduce((total, item) => total + item, 0);
}

const answer = await day1a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
