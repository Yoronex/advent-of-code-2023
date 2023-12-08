import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day8b(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');

  // Left is first element, right is second element in tuple
  const instructions = data[0].split('').map((instruction) => instruction === 'R' ? 1 : 0);

  const nodes = new Map<string, string[]>();
  data.slice(1).forEach((line) => {
    const [sourceNode, rawTargetNodes] = line.split(' = ');
    const targetNodes = rawTargetNodes.slice(1, rawTargetNodes.length - 1).split(', ');
    nodes.set(sourceNode, targetNodes);
  });

  let currentNodes = Array.from(nodes.keys()).filter((node) => node.charAt(2) === 'A');

  // while (currentNodes.some((node) => node.charAt(2) !== 'Z')) {
  //   currentNodes = currentNodes.map((node) => nodes.get(node)[instructions[steps % instructions.length]]);
  //   steps += 1;
  //
  //   if (steps % 10000 === 0) {
  //     console.log(steps);
  //   }
  // }

  const stepsPerNode = currentNodes.map((node) => {
    let currentNode = node;
    let steps = 0;

    while (currentNode.charAt(2) !== 'Z') {
      currentNode = nodes.get(currentNode)[instructions[steps % instructions.length]];
      steps += 1;
    }

    return steps;
  });

  // TODO: calculate LCM for stepsPerNode
  // Or just use an online calculator instead, like I did

  return 0;
}

const answer = await day8b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
