import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Spring {
  sections: string[];
  damaged: number[];
}

function stringReplaceAt(s: string, index: number, replacement: string) {
  return s.substring(0, index) + replacement + s.substring(index + replacement.length);
}

function arrangementPossible(current: string[], solution: number[]) {
  return current.length <= solution.length && current
    .every((s, index) => s.length <= solution[index]);
}

function arrayEqual(a: number[], b: number[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function findSpringArrangements(spring: Spring) {
  if (!spring.sections.join('').includes('?')) {
    const lengths = spring.sections.map((s) => s.length);
    // Valid solution, so return 1
    if (arrayEqual(lengths, spring.damaged)) return 1;
    // Not a valid solution, so return 0
    return 0;
  }

  const tempString = spring.sections.join('.');
  const firstQuestionMarkPosition = tempString.indexOf('?');
  let validArrangements = 0;

  ['.', '#'].forEach((p) => {
    const newString = stringReplaceAt(tempString, firstQuestionMarkPosition, p);
    const intermediateSolution = newString.replaceAll('?', '').split('.').filter((s) => s !== '');
    // if (!arrangementPossible(intermediateSolution, spring.damaged)) return;
    validArrangements += findSpringArrangements({
      sections: newString.split('.').filter((s) => s !== ''),
      damaged: spring.damaged,
    });
  });

  return validArrangements;
}

export async function day12a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const springs: Spring[] = data.map((line) => {
    const [rawSections, rawGroups] = line.split(' ');
    const sections = rawSections.split('.').filter((c) => c !== '');
    const damaged = rawGroups.split(',').map((g) => parseInt(g));
    return { sections, damaged };
  });

  console.log('Start recursion');
  const arrangements = springs.map((spring) => {
    return findSpringArrangements(spring);
  });

  return arrangements.reduce((total, i) => total + i, 0);
}

const answer = await day12a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
