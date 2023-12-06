import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Race {
  time: number;
  distance: number;
}

interface RaceOutcomes extends Race {
  minPushTime: number;
  maxPushTime: number;
}

export async function day6b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  const times = [parseInt(data[0].split(': ')[1].split(' ').filter((s) => s !== '')
    .reduce((total, s) => total + s, ''))];
  const distances = [parseInt(data[1].split(': ')[1].split(' ').filter((s) => s !== '')
    .reduce((total, s) => total + s, ''))];

  const races: Race[] = [];
  times.forEach((time, index) => {
    races.push({
      time,
      distance: distances[index],
    });
  });

  const possibleOutcomes: RaceOutcomes[] = races.map((race) => {
    let minPushTime = 0;
    let maxPushTime = race.time;
    for (let i = 0; i <= race.time; i += 1) {
      if (i * (race.time - i) > race.distance) {
        minPushTime = i;
        maxPushTime = race.time - i;
        break;
      }
    }

    return {
      ...race,
      minPushTime,
      maxPushTime,
    };
  });

  const winningOutcomes = possibleOutcomes.map((outcome) => {
    return outcome.maxPushTime - outcome.minPushTime + 1;
  });
  return winningOutcomes.reduce((total, i) => total * i, 1);
}

const answer = await day6b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
