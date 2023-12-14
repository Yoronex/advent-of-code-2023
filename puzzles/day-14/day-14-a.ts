import { readData } from '../../shared.ts';
import _ from 'lodash';
import chalk from 'chalk';

export async function day14a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const matrix = data.map((line) => line.split(''));
  const inverse = _.unzip(matrix);

  const tilted = inverse.map((line) => {
    let freePosition = 0;
    const result = line;
    line.forEach((char, index) => {
      switch (char) {
        case '#': freePosition = index + 1; break;
        case 'O':
          result[index] = '.';
          result[freePosition] = char;
          freePosition = freePosition + 1;
      }
    });
    return result;
  });

  const weightPerLine = tilted.map((line) => line.reduce((total, char, index, all) => {
    if (char === 'O') {
      return total + (all.length - index);
    }
    return total;
  }, 0))

  return weightPerLine.reduce((total, n) => total + n, 0);
}

const answer = await day14a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
