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

export async function day2a(dataPath?: string) {
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

  const validGames = games.filter((game) => game.subsets
    .every((subset) => Object.keys(subset)
      .every((color) => subset[color] <= maximums[color])));

  return validGames.reduce((total, game) => total + game.id, 0);
}

const answer = await day2a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
