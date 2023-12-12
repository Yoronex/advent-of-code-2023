import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Galaxy {
  x: number;
  y: number;
  index: number;
}

const arrayRange = (start: number, stop: number) =>
  Array.from(
    { length: (stop - start) },
    (value, index) => start + index
  );

export async function day11b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const galaxies: Galaxy[] = [];
  data.forEach((line, y) => line.split('').forEach((char, x) => {
    if (char === '#') {
      const index = galaxies.length + 1;
      galaxies.push({ x, y, index });
    }
  }));

  const rowsWithGalaxies = galaxies
    .map((g) => g.y)
    .filter((x, i, all) => i === all.findIndex((x2) => x2 === x))
    .sort();
  const colsWithGalaxies = galaxies
    .map((g) => g.x)
    .filter((y, i, all) => i === all.findIndex((y2) => y2 === y))
    .sort();
  const allRows = arrayRange(0, Math.max(...rowsWithGalaxies) + 1);
  const allCols = arrayRange(0, Math.max(...colsWithGalaxies) + 1);
  const rowsWithoutGalaxies = allRows.filter((i) => !rowsWithGalaxies.includes(i));
  const colsWithoutGalaxies = allCols.filter((i) => !colsWithGalaxies.includes(i));

  rowsWithoutGalaxies.forEach((row, index) => {
    galaxies.forEach((galaxy) => {
      if (galaxy.y > (row + (index * 999999))) galaxy.y += 999999;
    });
  });
  colsWithoutGalaxies.forEach((col, index) => {
    galaxies.forEach((galaxy) => {
      if (galaxy.x > (col + (index * 999999))) galaxy.x += 999999;
    });
  });

  const distances = galaxies.map((galaxy1) => galaxies
    .filter((galaxy2) => galaxy2.index > galaxy1.index)
    .map((galaxy2) => {
      const distance = Math.abs(galaxy2.x - galaxy1.x) + Math.abs(galaxy1.y - galaxy2.y);
      return distance;
    })
  ).flat();

  return distances.reduce((total, d) => total + d, 0);
}

const answer = await day11b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
