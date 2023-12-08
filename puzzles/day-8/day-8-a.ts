import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  // Left is first element, right is second element in tuple
  const instructions = data[0].split('').map((instruction) => instruction === 'R' ? 1 : 0);

  const nodes = new Map<string, string[]>();
  data.slice(1).forEach((line) => {
    const [sourceNode, rawTargetNodes] = line.split(' = ');
    const targetNodes = rawTargetNodes.slice(1, rawTargetNodes.length - 1).split(', ');
    nodes.set(sourceNode, targetNodes);
  });

  let steps = 0;
  let currentNode = 'AAA';

  while (currentNode !== 'ZZZ') {
    currentNode = nodes.get(currentNode)[instructions[steps % instructions.length]];
    steps += 1;
  }

  return steps;
}

const answer = await day8a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
