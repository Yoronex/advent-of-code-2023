import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface LotteryNumbers {
  winning: number[];
  mine: number[];
}

export async function day4b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const lotteryNumbers: LotteryNumbers[] = data.map((line) => {
    const [id, numbers] = line.split(': ');
    const [winningStrings, myStrings] = numbers.split(' | ');
    return {
      winning: winningStrings.split(' ').map((n) => parseInt(n.trim(), 10)).filter((i) => !Number.isNaN(i)),
      mine: myStrings.split(' ').map((n) => parseInt(n.trim(), 10)).filter((i) => !Number.isNaN(i)),
    }
  });

  const winningNumbers = lotteryNumbers.map((l) =>
    l.mine.filter((m) =>l.winning.includes(m)));

  const instances: number[] = new Array(winningNumbers.length).fill(1);
  winningNumbers.forEach((winnings, index) => {
    const copies = instances[index];
    for (let i = 1; i <= winnings.length; i++) {
      instances[index + i] = instances[index + i] + copies;
    }
  })

  return instances.reduce((total, p) => total + p, 0);
}

const answer = await day4b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
