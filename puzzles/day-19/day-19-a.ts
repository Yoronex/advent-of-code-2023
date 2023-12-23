import { readData } from '../../shared.ts';
import chalk from 'chalk';

interface Gear {
  x: number;
  m: number;
  a: number;
  s: number;
}

enum Comparator {
  LESS_THAN = '<',
  // LESS_THAN_OR_EQUAL = '<=',
  // EQUAL = '=',
  // GREATER_THAN_OR_EQUAL = '>=',
  GREATER_THAN = '>',
}

interface Comparison {
  attribute: keyof Gear;
  comparator: Comparator;
  value: number;
  result: string;
}

interface Workflow {
  name: string;
  defaultResult: string;
  comparisons: Comparison[];
}

export async function day19a(dataPath?: string) {
  const data = await readData(dataPath);

  const chunks: string[][] = [[]];
  data.forEach((line) => {
    if (line === '') {
      chunks.push([]);
    } else {
      chunks[chunks.length - 1].push(line);
    }
  });
  const [rawWorkflows, rawParts] = chunks;

  const workflows: Workflow[] = rawWorkflows.map((line) => {
    const [name, rawComparisonsString] = line.split('{');
    const rawComparisons = rawComparisonsString.substring(0, rawComparisonsString.length - 1).split(',');
    const defaultResult = rawComparisons.pop();
    const comparisons: Comparison[] = rawComparisons.map((c) => {
      const [comp, result] = c.split(':');
      const attribute = comp.charAt(0) as keyof Gear;
      const comparator = comp.charAt(1) === '<' ? Comparator.LESS_THAN : Comparator.GREATER_THAN;
      const value = parseInt(comp.substring(2));
      return { attribute, comparator, value, result };
    });
    return { name, defaultResult, comparisons };
  });

  const gears: Gear[] = rawParts.map((rawPart) => {
    const rawAttributes = rawPart.substring(1, rawPart.length - 1).split(',');
    const result = { x: undefined, m: undefined, a: undefined, s: undefined };
    rawAttributes.forEach((rawAttribute) => {
      const [name, rawValue] = rawAttribute.split('=');
      result[name] = parseInt(rawValue);
    });
    return result;
  });

  const executeFlow = (workflowName: string, gear: Gear): boolean => {
    if (workflowName === 'A') return true;
    if (workflowName === 'R') return false;

    const workflow = workflows.find((w) => w.name === workflowName);
    if (workflow === undefined) throw new Error(`Could not find workflow with name "${workflowName}"`);

    const satisfiedComparisons = workflow.comparisons.filter((c) => {
      switch (c.comparator) {
        case Comparator.LESS_THAN: return gear[c.attribute] < c.value;
        case Comparator.GREATER_THAN: return gear[c.attribute] > c.value;
        default: throw new Error(`Unknown comparator "${c.comparator}"`);
      }
    });

    return executeFlow(satisfiedComparisons[0]?.result ?? workflow.defaultResult, gear);
  }

  const acceptedGears = gears.filter((gear) => executeFlow('in', gear));
  const sumAttributes = acceptedGears.map((gear) => Object.keys(gear)
    .reduce((total2, key) => total2 + gear[key], 0));

  return sumAttributes.reduce((total, gear) => total + gear, 0);
}

const answer = await day19a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
