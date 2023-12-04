import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface LotteryNumbers {
  winning: number[];
  mine: number[];
}

export async function day4a(dataPath?: string) {
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
  const points = winningNumbers.map((l) => {
    if (l.length === 0) return 0;
    return 2 ** (l.length - 1);
  })

  return points.reduce((total, p) => total + p, 0);
}

const answer = await day4a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
