import { readData } from '../../shared.ts';
import chalk from 'chalk';

function hash(word: string): number {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    const ascii = word.charCodeAt(i);
    result += ascii;
    result *= 17;
    result = result % 256;
  }
  return result;
}

export async function day15a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const words = data.map((line) => line.split(',')).flat();

  const hashes = words.map((word) => hash(word));

  return hashes.reduce((total, h) => total + h, 0);
}

const answer = await day15a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
