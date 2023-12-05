import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Seed {
  start: number;
  range: number;
}

interface MapResult extends Seed {
  difference: number;
}

class SingleGardenMap {
  private readonly destinationEnd: number;
  public readonly sourceEnd: number;

  constructor(
    private readonly destinationStart: number,
    public readonly sourceStart: number,
    public readonly length: number,
  ) {
    this.destinationEnd = this.destinationStart + length;
    this.sourceEnd = this.sourceStart + length;
  }

  public get mapDiff(): number {
    return this.destinationStart - this.sourceStart;
  }

  public get(seed: Seed): MapResult | undefined {
    // Seed after map
    if (this.sourceEnd <= seed.start) return undefined;
    // Seed in front of map
    if (this.sourceStart >= seed.start + seed.range) return undefined;
    if (this.sourceStart <= seed.start && this.sourceEnd < seed.start + seed.range) {
      return {
        start: seed.start,
        range: this.sourceEnd - seed.start,
        difference: this.mapDiff,
      }
    }
    if (this.sourceStart <= seed.start && this.sourceEnd >= seed.start + seed.range) {
      return {
        start: seed.start,
        range: seed.range,
        difference: this.mapDiff,
      }
    }
    if (this.sourceStart >= seed.start && this.sourceEnd < seed.start + seed.range) {
      return {
        start: this.sourceStart,
        range: this.length,
        difference: this.mapDiff,
      }
    }
    if (this.sourceStart > seed.start && this.sourceEnd > seed.start + seed.range) {
      return {
        start: this.sourceStart,
        range: seed.start + seed.range - this.sourceStart,
        difference: this.mapDiff,
      }
    }
  }
}

class GardenMap {
  private maps: SingleGardenMap[];

  constructor(maps: SingleGardenMap[]) {
    this.maps = maps.sort((a, b) => a.sourceStart - b.sourceStart);
  }

  public get(seed: Seed): Seed[] {
    const mapResults = this.maps.map((map) => {
      return map.get(seed);
    }).filter((res) => res !== undefined)
      .sort((a, b) => a.start - b.start);

    if (mapResults.length === 0) return [seed];

    const results: MapResult[]  = [];
    mapResults.forEach((mapResult) => {
      let newStart = seed.start;
      if (results.length > 0) {
        const lastResult = results[results.length - 1];
        newStart = lastResult.start + lastResult.range;
      }
      if (mapResult.start > newStart) {
        results.push({
          start: newStart,
          range: mapResult.start - newStart,
          difference: 0,
        });
      }
      results.push(mapResult);
    })

    const lastResult = results[results.length - 1];
    if (lastResult.start + lastResult.range < seed.start + seed.range) {
      results.push({
        start: lastResult.start + lastResult.range,
        range: (seed.start + seed.range) - (lastResult.start + lastResult.range),
        difference: 0,
      });
    }

    if (results.reduce((total, a) => total + a.range, 0) !== seed.range) {
      throw new Error('Seeds disappeared!');
    }

    return results.map((res) => ({
      start: res.start + res.difference,
      range: res.range,
    }));
  }
}

// function transitivelyMergeMaps(gardenMapA: GardenMap, gardenMapB: GardenMap): GardenMap {
//   const resultMaps: SingleGardenMap[] = [];
//
//   let mapsA = gardenMapA.maps.sort((a, b) => a.destinationStart - b.destinationStart);
//   let mapsB = gardenMapB.maps.sort((a, b) => a.sourceStart - b.sourceStart);
//   let mapAIndex = 0;
//   let mapBIndex = 0;
//
//   let pointer = 0;
//
//   const pointerEnd = Math.max(mapsA[mapsA.length - 1]?.destinationEnd, mapsB[mapsB.length - 1]?.sourceEnd);
//
//   while (
//     // (mapsA.length > 0 || mapsB.length > 0)
//     // && pointer < (mapsA[mapsA.length - 1]?.destinationEnd || Number.POSITIVE_INFINITY)
//     // && pointer < (mapsB[mapsB.length - 1]?.sourceEnd || Number.POSITIVE_INFINITY)
//     pointer < pointerEnd
//   ) {
//     let mapA = mapsA[mapAIndex] || new SingleGardenMap(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
//     let mapB = mapsB[mapBIndex] || new SingleGardenMap(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
//
//     // Selected map is behind the pointer, so select the next map
//     if (mapA.destinationEnd <= pointer) {
//       mapAIndex += 1;
//       continue;
//     }
//     if (mapB.sourceEnd <= pointer) {
//       mapBIndex += 1;
//       continue;
//     }
//
//     // Move the pointer forwards if it is not laying on a mapping;
//     if (pointer < mapA.destinationStart && pointer < mapB.sourceStart) pointer = Math.min(mapA.destinationStart, mapB.sourceStart);
//
//     // Pointer lays on mapA (no overlap)
//     if (pointer >= mapA.destinationStart && pointer < mapB.sourceStart) {
//       const pointerDiff = pointer - mapA.destinationStart;
//       const length = mapA.length - pointerDiff - Math.max(0, mapA.destinationEnd - mapB.sourceStart);
//       resultMaps.push(new SingleGardenMap(mapA.destinationStart + pointerDiff, mapA.sourceStart + pointerDiff, length));
//       pointer = pointer + length;
//     // Pointer lays on mapB (no overlap)
//     } else if (pointer >= mapB.sourceStart && pointer < mapA.destinationStart) {
//       const pointerDiff = pointer - mapB.sourceStart;
//       const length = mapB.length - pointerDiff - Math.max(0, mapB.sourceEnd - mapA.destinationStart);
//       resultMaps.push(new SingleGardenMap(mapB.destinationStart + pointerDiff, mapB.sourceStart + pointerDiff, length));
//       pointer = pointer + length;
//     // Pointer lays on mapA and mapB (overlap)
//     } else {
//       const pointerDiffWithA = pointer - mapA.destinationStart;
//       const pointerDiffWithB = pointer - mapB.sourceStart;
//       const length = Math.min(mapA.length - pointerDiffWithA, mapB.length - pointerDiffWithB);
//       resultMaps.push(new SingleGardenMap(mapA.sourceStart + pointerDiffWithA, mapB.destinationEnd + pointerDiffWithB, length));
//       pointer = pointer + length;
//     }
//     // } else if (pointer === mapA.destinationStart) {
//     //   const pointerDiffWithB = pointer - mapB.sourceStart;
//     //   const length = Math.min(mapA.length, mapB.length - pointerDiffWithB);
//     //   resultMaps.push(new SingleGardenMap(mapB.destinationStart + pointerDiffWithB, mapA.sourceStart, length));
//     //   pointer = pointer + length;
//     //   // Pointer lays on mapA and mapB (overlap), with start point on B
//     // } else if (pointer === mapB.sourceStart) {
//     //   const pointerDiffWithA = pointer - mapA.destinationStart;
//     //   const length = Math.min(mapB.length, mapA.length - pointerDiffWithA);
//     //   resultMaps.push(new SingleGardenMap(mapB.destinationStart, mapA.sourceStart + pointerDiffWithA, length));
//     //   pointer = pointer + length;
//     // }
//   }
//
//   //   // Map A is in front of map B, so take A as starting point
//   //   if (Math.max(mapA.destinationStart, pointer) < Math.max(mapB.sourceStart, pointer)) {
//   //     const pointerDiff = Math.max(pointer - mapA.destinationStart, 0);
//   //
//   //     // MapA lays completely before mapB
//   //     if (pointer <= mapA.destinationStart && mapA.destinationEnd < mapB.sourceStart) {
//   //       resultMaps.push(new SingleGardenMap(mapA.destinationStart + pointerDiff, mapA.sourceStart + pointerDiff, mapA.length - pointerDiff));
//   //       pointer = mapA.destinationEnd + 1;
//   //     // MapB is fully contained in mapA
//   //     } else if (mapA.destinationStart < mapB.sourceStart && mapA.destinationEnd >= mapB.sourceEnd) {
//   //       const beforeLength = mapB.sourceStart - mapA.destinationStart - pointerDiff;
//   //       if (beforeLength < 0) throw new Error(`Unreachable state: beforelength is ${beforeLength} for mapA`);
//   //       const overlapLength = mapB.length;
//   //
//   //       if (beforeLength > 0) resultMaps.push(new SingleGardenMap(mapB.destinationStart, mapA.sourceStart, beforeLength));
//   //       resultMaps.push(new SingleGardenMap(mapB.destinationStart + beforeLength, mapA.sourceStart + overlapLength, overlapLength));
//   //
//   //       pointer = mapB.sourceEnd + 1;
//   //     } else if ()
//   //   // Select map B
//   //   } else {
//   //   }
//   // }
//   //
//   // // While we have not yet looped over all maps...
//   // while (mapAIndex < mapsA.length && mapBIndex < mapsB.length) {
//   //
//   //   // MapA lays completely before mapB
//   //   if (mapA.destinationEnd < mapB.sourceStart) {
//   //     resultMaps.push(mapA);
//   //     mapAIndex += 1;
//   //     pointer = mapA.sourceStart
//   //   // MapB is contained in mapA
//   //   } else if (mapA.destinationStart <= mapB.sourceStart && mapA.destinationEnd >= mapA.sourceEnd) {
//   //     const beforeLength = mapA.destinationStart - mapB.sourceStart;
//   //     const overlapLength = mapB.length;
//   //
//   //     if (beforeLength > 0) resultMaps.push(new SingleGardenMap(mapB.destinationStart, mapA.sourceStart, beforeLength));
//   //     resultMaps.push(new SingleGardenMap(mapB.destinationStart + beforeLength, mapA.sourceStart + overlapLength, overlapLength));
//   //
//   //     mapBIndex += 1;
//   //     if (beforeLength + overlapLength === mapA.length) mapAIndex += 1;
//   //   // Only ending part of mapA lays over mapB
//   //   } else if (mapA.destinationStart <= mapB.sourceStart && mapA.destinationEnd > mapB.sourceStart) {
//   //     const diff = mapB.sourceStart - mapA.destinationStart;
//   //     const maxOverlap = Math.min(mapA.destinationStart + mapA.length, mapB.sourceStart + mapB.length);
//   //     resultMaps.push(new SingleGardenMap(mapB.destinationStart, mapA.sourceStart, diff));
//   //     resultMaps.push(new SingleGardenMap(mapB.destinationStart + diff, mapA.sourceStart + diff, ))
//   //   }
//   // }
//   //
//   // mapsB.forEach((map, index) => {
//   //   // Second map does not cover this part of the first map
//   //   let mapA = mapsA[mapAIndex];
//   //   while (mapA !== undefined)
//   //   if (map.sourceStart > mapsA[mapAIndex].destinationStart + mapsA[mapAIndex].length) {
//   //     resultMaps.push(mapsA[mapAIndex]);
//   //     mapAIndex += 1;
//   //   } else if (map.sourceStart > mapsA[mapI])
//   // })
//
//   return new GardenMap(resultMaps);
// }

export async function day5b(dataPath?: string) {
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

  const seedNumbers = slices[0][0].split(': ')[1].split(' ').map((n) => parseInt(n));
  let seeds: Seed[] = new Array(Math.round(seedNumbers.length / 2)).fill(0).map((value, index) => ({
    start: seedNumbers[index * 2],
    range: seedNumbers[index * 2 + 1],
  }));

  // let highestId = Math.max(...seeds);
  const gardenMaps: GardenMap[] = slices.slice(1).map((inputMaps) => {
    const lines = inputMaps.slice(1).map((line) => line.split(' ').map((n) => parseInt(n)));
    const maps = lines.map((line) => new SingleGardenMap(line[0], line[1], line[2]));
    return new GardenMap(maps);
  });

  // let mergedMap = transitivelyMergeMaps(gardenMaps[gardenMaps.length - 2], gardenMaps[gardenMaps.length - 1]);
  // for (let i = gardenMaps.length - 3; i >= 0; i -= 1) {
  //   mergedMap = transitivelyMergeMaps(mergedMap, gardenMaps[i]);
  // }
  // gardenMaps.forEach((map) => mergedMap = transitivelyMergeMaps(mergedMap, map));

  let parsedSeeds = seeds.map((s) => [s]);
  gardenMaps.forEach((gardenMap, index) => {
    const newSeeds: Seed[][] = parsedSeeds.map((initialSeeds) => initialSeeds.map((seed) => gardenMap.get(seed)).flat());

    parsedSeeds = newSeeds;
  })

  return Math.min(...parsedSeeds.flat().map((s) => s.start));
}

const answer = await day5b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
