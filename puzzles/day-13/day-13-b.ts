import { readData } from '../../shared.ts';
import chalk from 'chalk';

const differenceIndices = (line1: string, line2: string) => {
  const l1 = line1.split('');
  const l2 = line2.split('');
  const indices = l1.map((l, i) => i);

  return indices.filter((i) => l1[i] !== l2[i]);
}

export async function day13b(dataPath?: string) {
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

  // Original mirrors
  const verticalMirrors: number[][] = maps.map((map) => {
    const result: number[] = [];
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
      })) result.push(i);
    }
    return result;
  });

  const horizontalMirrors: number[][] = maps.map((map) => {
    const result: number[] = [];
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
      if (equal) result.push(i);
    }
    return result;
  });

  const verticalMirrorsWithSmudge: number[][] = maps.map((map) => {
    const result: number[] = [];
    const width = map[0].length;
    const height = map.length;
    for (let i = 1; i < width; i += 1) {
      const searchSpace = Math.min(i, width - i);
      let smudge = false;
      // Every line should be equal
      if (map.every((line) => {
        // So every element in a line should be equal
        const substring1 = line.substring(i - searchSpace, i).split('').reverse().join('');
        const substring2 = line.substring(i, i + searchSpace);
        const hasSmudge = differenceIndices(substring1, substring2).length === 1;
        if (substring1 === substring2 || (!smudge && hasSmudge)) {
          if (hasSmudge) smudge = true;
          return true;
        }
        // Return the index if we found a mirror, undefined otherwise
      })) result.push(i);
    }
    return result;
  });

  const horizontalMirrorsWithSmudge: number[][] = maps.map((map) => {
    const result: number[] = [];
    const width = map[0].length;
    const height = map.length;
    for (let i = 1; i < height; i += 1) {
      const searchSpace = Math.min(i, height - i);
      let equal = true;
      let smudge = false;
      for (let x = 1; x <= searchSpace; x += 1) {
        if (!equal) break;
        const line1 = map[i - x];
        const line2 = map[i + x - 1];
        const hasSmudge = differenceIndices(line1, line2).length === 1;
        if (!(line1 === line2 || (!smudge && hasSmudge))) {
          if (hasSmudge) smudge = true;
          equal = false;
          break;
        }
      }
      if (equal) result.push(i);
    }
    return result
  });

  const vertMir = verticalMirrorsWithSmudge.map((mirrors, i) => {
    return mirrors.filter((mir) => !verticalMirrors[i].includes(mir));
  }).flat();
  const horMir = horizontalMirrorsWithSmudge.map((mirrors, i) => {
    return mirrors.filter((mir) => !horizontalMirrors[i].includes(mir));
  }).flat();

  return vertMir.reduce((total, i) => total + i, 0)
    + 100 * horMir.reduce((total, i) => total + i, 0);
}

const answer = await day13b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
