import { readData } from '../../shared.ts';
import chalk from 'chalk';

class SingleGardenMap {
  constructor(
    private destination: number,
    private source: number,
    private length: number,
  ) {}

  private get difference() {
    return this.destination - this.source;
  }

  public has(key: number) {
    return key >= this.source && key < this.source + this.length;
  }

  public get(key: number) {
    if (!this.has(key)) return undefined;

    return key + this.difference;
  }
}

class GardenMap {
  constructor(private maps: SingleGardenMap[]) {}

  public has(key: number) {
    return this.maps.some((map) => map.has(key));
  }

  public get(key: number): number | undefined {
    if (!this.has(key)) return undefined;

    const values = this.maps.map((map) => map.get(key))
      .filter((v) => v !== undefined);
    if (values.length > 1) throw new Error(`Key ${key} is contained in ${values.length} maps.`);
    return values[0];
  }
}

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);
  let  slices: string[][] = [[]];
  data.forEach((line) => {
    if (line === '') {
      slices.push([]);
    } else {
      slices[slices.length - 1].push(line);
    }
  });
  slices = slices.slice(0, slices.length - 1);

  const seeds = slices[0][0].split(': ')[1].split(' ').map((n) => parseInt(n));

  // let highestId = Math.max(...seeds);
  const gardenMaps: GardenMap[] = slices.slice(1).map((inputMaps) => {
    const lines = inputMaps.slice(1).map((line) => line.split(' ').map((n) => parseInt(n)));
    const maps = lines.map((line) => new SingleGardenMap(line[0], line[1], line[2]));
    return new GardenMap(maps);
  });

  const locations = seeds.map((seedId) => {
    let resultId = seedId;
    gardenMaps.forEach((map, index) => {
      if (map.has(resultId)) resultId = map.get(resultId);
    });
    return resultId;
  })

  return Math.min(...locations);
}

const answer = await day5a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
