import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day1b(dataPath?: string) {
  const data = await readData(dataPath);
  const writtenDigits = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
  };

  const numbers = data
    .map((item) => {
      let itemCopy = item;

      let i = 3;
      while (i <= itemCopy.length) {
        const substring = itemCopy.substring(0, i);
        let found = false;

        Object.keys(writtenDigits).forEach((writtenDigit) => {
          if (substring.includes(writtenDigit)) {
            itemCopy = itemCopy.replace(writtenDigit, `${writtenDigits[writtenDigit]}${writtenDigit.charAt(writtenDigit.length - 1)}`);
            found = true;
          }
        });

        if (found) {
          i = 3;
        } else {
          i += 1;
        }
      }
      return itemCopy;
    })
    .map((item) => {
      const digits = item
        .split('')
        .map((char) => parseInt(char, 10))
        .filter((digit) => !Number.isNaN(digit));
      return parseInt(`${digits[0]}${digits[digits.length - 1]}`, 10);
    })
    .filter((digit) => !Number.isNaN(digit));
  return numbers.reduce((total, item) => total + item, 0);
}

const answer = await day1b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
