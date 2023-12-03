import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Subset {
  red: number;
  green: number;
  blue: number;
}

interface Game {
  id: number;
  subsets: Subset[]
}

const maximums: Subset = {
  red: 12,
  green: 13,
  blue: 14,
}

export async function day2b(dataPath?: string) {
  const data = await readData(dataPath);

  const games: Game[] = data
    .filter((d) => d !== '')
    .map((line) => {
      const [game, subsetsString] = line.split(': ')
      return {
        id: parseInt(game.split(' ')[1], 10),
        subsets: subsetsString.split('; ')
          .map((subset) => {
            const result: Subset = {
              red: 0,
              green: 0,
              blue: 0,
            };
            subset.split(', ').forEach((count) => {
              const [amount, color] = count.split(' ');
              result[color] = parseInt(amount, 10);
            });
            return result;
          }),
      }
    });

  const leastCubesRequired: Subset[] = games.map((game) => {
    const result = {
      red: 1,
      green: 1,
      blue: 1,
    };

    game.subsets.forEach((subset) => {
      Object.keys(subset).forEach((color) => {
        result[color] = Math.max(result[color], subset[color]);
      })
    })

    return result;
  })

  const powers: number[] = leastCubesRequired.map((least) => {
    return Object.keys(least).reduce((total, color) => total * least[color], 1)
  })

  return powers.reduce((total, power) => total + power, 0);
}

const answer = await day2b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
