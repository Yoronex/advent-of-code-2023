import { readData } from '../../shared.ts';
import chalk from 'chalk';
import _ from "lodash";

function tiltPlatform(platform: string[][]) {
  return platform.map((line) => {
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
}

function printPlatform(platform: string[][]) {
  console.log(platform.map((line) => line.join('')).join('\n'));
}

export async function day14b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  /**
   *   N
   * W . E
   *   S
   */
  const matrix = data.map((line) => line.split(''));

  /**
   *   W             E
   * N . S   ==>   N . S
   *   E             W
   */
  let north = _.reverse(_.unzip(matrix));
  let northString = JSON.stringify(north);

  let intermediates = [northString];

  let currentCycle = 0;
  const totalCycles = 1000000000;
  const start = new Date().getTime();
  while (currentCycle < totalCycles) {
    const tilted1 = tiltPlatform(north);

    /**
     *   W             N
     * N . S   ==>   W . E
     *   E             S
     */
    const west = _.unzip(_.reverse(tilted1));
    const tilted2 = tiltPlatform(west);

    /**
     *   S             W
     * W . E   ==>   S . N
     *   N             E
     */
    const south = _.unzip(_.reverse(tilted2));
    const tilted3 = tiltPlatform(south);

    /**
     *   E             S
     * S . N   ==>   E . W
     *   W             N
     */
    const east = _.unzip(_.reverse(tilted3));
    const tilted4 = tiltPlatform(east);

    /**
     *   N             E
     * E . W   ==>   N . S
     *   S             W
     */
    north = _.unzip(_.reverse(tilted4));
    northString = JSON.stringify(north);
    if (intermediates.includes(northString)) {
      console.log('Found match!');
      printPlatform(north);
      break;
    }
    intermediates.push(northString);

    // Continue
    currentCycle += 1;
    if (currentCycle % 100000 === 0) {
      console.log('\n\n')
      console.log(currentCycle);
      printPlatform(north);
      // const percentage = Math.round(currentCycle / totalCycles * 1000) / 1000
      // const timeDiff = new Date().getTime() - start;
      // const eta = new Date(Math.round(timeDiff / percentage + start));
      // console.log(`${percentage * 100}%  (ETA: ${eta.toLocaleTimeString()})`)
    }
  }

  const tail = intermediates.findIndex((s) => s === northString);
  const cycle = intermediates.length - tail;

  const billionthNorth = tail + ((totalCycles - tail) % cycle);
  north = JSON.parse(intermediates[billionthNorth]);

  const weightPerLine = north.map((line) => line.reduce((total, char, index, all) => {
    if (char === 'O') {
      return total + (all.length - index);
    }
    return total;
  }, 0))

  return weightPerLine.reduce((total, n) => total + n, 0);
}

const answer = await day14b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
