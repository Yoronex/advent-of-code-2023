import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Race {
  time: number;
  distance: number;
}

interface RaceOutcomes extends Race {
  outcomes: number[];
}

export async function day6a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const times = data[0].split(': ')[1].split(' ').filter((s) => s !== '').map((s) => parseInt(s));
  const distances = data[1].split(': ')[1].split(' ').filter((s) => s !== '').map((s) => parseInt(s));

  const races: Race[] = [];
  times.forEach((time, index) => {
    races.push({
      time,
      distance: distances[index],
    });
  });

  const possibleOutcomes: RaceOutcomes[] = races.map((race) => {
    const outcomes: number[] = new Array(race.time + 1).fill(0)
      .map((outcome, index) => {
        const pushTime = index;
        const speed = pushTime;
        const remainingTime = race.time - pushTime;
        return speed * remainingTime;
      });
    return {
      ...race,
      outcomes,
    };
  });

  const winningOutcomes = possibleOutcomes.map((outcome) => {
    return outcome.outcomes.filter((o) => o > outcome.distance).length;
  });
  return winningOutcomes.reduce((total, i) => total * i, 1);
}

const answer = await day6a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
