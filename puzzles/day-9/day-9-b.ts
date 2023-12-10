import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Sequence = number[];

type DifferenceSequence = Sequence[];

export async function day9b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const sequences: Sequence[] = data.map((line) => line.split(' ').map((n) => parseInt(n)));

  const getDifferenceSequence = (seq: Sequence): Sequence => {
    return seq.reduce((total, d, currentIndex, array) => {
      if (currentIndex === 0) return total;
      return [...total, d - array[currentIndex - 1]];
    }, []);
  }

  const differenceSequences: DifferenceSequence[] = sequences.map((sequence) => {
    const results: Sequence[] = [sequence];
    const lastResult = () => results[results.length - 1];
    while (lastResult().some((d) => d !== 0)) {
      results.push(getDifferenceSequence(lastResult()));
    }
    return results;
  });

  differenceSequences.forEach((differenceSequence) => {
    differenceSequence[differenceSequence.length - 1].unshift(0);
    for (let i = differenceSequence.length - 2; i >= 0; i -= 1) {
      const lastElement = differenceSequence[i][0];
      const difference = differenceSequence[i + 1][0];
      differenceSequence[i].unshift(lastElement - difference);
    }
  });

  const predictions = differenceSequences
    .map((differenceSequence) => differenceSequence[0][0]);

  return predictions.reduce((total, i) => total + i, 0);
}

const answer = await day9b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
