import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath);

  let maps: string[][] = [[]];
  data.forEach((line) => {
    if (line === '') {
      maps.push([]);
    } else {
      maps[maps.length - 1].push(line);
    }
  });
  maps = maps.slice(0, maps.length - 1);

  const width = maps[0][0].length;
  const height = maps[0].length;

  const horizontalMirrors: (number | undefined)[] = maps.map((map) => {
    for (let i = 1; i <= height; i += 1) {
      // Every line should be equal
      if (map.every((line) => {
        // So every element in a line should be equal
        const searchSpace = Math.min(i, height - i);
        for (let x = 1; x <= searchSpace; x += 1) {
          // Return false if one of the elements is not equal
          if (line[i - x] !== line[i + x - 1]) return false;
        }
        return true;
        // Return the index if we found a mirror, undefined otherwise
      })) return i;
    }
    return undefined;
  });

  const verticalMirrors: (number | undefined)[] = maps.map((map) => {
    for (let i = 1; i <= width; i += 1) {
      if
    }
  })

  return 0;
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
