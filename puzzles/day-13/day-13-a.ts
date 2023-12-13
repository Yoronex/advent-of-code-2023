import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day13a(dataPath?: string) {
  const data = await readData(dataPath);

  let maps: string[][] = [[]];
  data.forEach((line) => {
    if (line.trim() === '') {
      maps.push([]);
    } else {
      maps[maps.length - 1].push(line.trim());
    }
  });
  maps = maps.slice(0, maps.length - 1);

  const verticalMirrors: (number | undefined)[] = maps.map((map) => {
    const width = map[0].length;
    const height = map.length;
    for (let i = 1; i < width; i += 1) {
      const searchSpace = Math.min(i, width - i);
      // Every line should be equal
      if (map.every((line) => {
        // So every element in a line should be equal
        const substring1 = line.substring(i - searchSpace, i).split('').reverse().join('');
        const substring2 = line.substring(i, i + searchSpace);
        return substring1 === substring2;
        // Return the index if we found a mirror, undefined otherwise
      })) return i;
    }
    return undefined;
  }).filter((i) => i !== undefined);

  const horizontalMirrors: (number | undefined)[] = maps.map((map) => {
    const width = map[0].length;
    const height = map.length;
    for (let i = 1; i < height; i += 1) {
      const searchSpace = Math.min(i, height - i);
      let equal = true;
      for (let x = 1; x <= searchSpace; x += 1) {
        if (!equal) break;
        const line1 = map[i - x];
        const line2 = map[i + x - 1];
        if (line1 !== line2) {
          equal = false;
          break;
        }
      }
      if (equal) return i;
    }
    return undefined;
  }).filter((i) => i !== undefined);

  return verticalMirrors.reduce((total, i) => total + i, 0)
    + 100 * horizontalMirrors.reduce((total, i) => total + i, 0);
}

const answer = await day13a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
