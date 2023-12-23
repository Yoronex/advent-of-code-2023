import { readData } from '../../shared.ts';
import chalk from 'chalk';

type ModuleType = '%' | '&' | '';

interface Module {
  id: string;
  to: string[];
  from: string[];
  type: ModuleType; // Flip-flop or conjunction or nothing
}

type ModuleStates = Map<string, boolean>;

export async function day20a(dataPath?: string) {
  const data = (await readData(dataPath)).filter((d) => d !== '');
  const modules: Module[] = data.map((line) => {
    const [before, after] = line.split(' -> ');
    const type: ModuleType = (['%', '&'].includes(before.charAt(0)) ? before.charAt(0) : '') as ModuleType;
    const id = type === '' ? before : before.substring(1);
    const to = after.split(', ').map((s) => s.trim());
    return { id, to, type, from: [] };
  });

  const modulesMap = new Map<string, Module>();
  modules.forEach((m) => modulesMap.set(m.id, m));
  modules.forEach((m) => m.to.forEach((toId) => {
    const toModule = modulesMap.get(toId);
    if (!toModule) return;
    toModule.from.push(m.id);
  }));
  modules.forEach((m) => modulesMap.set(m.id, m));

  const outputPulses: ModuleStates = new Map<string, boolean>();
  const receivedPulses = new Map<string, boolean[]>();
  modules.forEach((m) => {
    outputPulses.set(m.id, false);
    receivedPulses.set(m.id, []);
  });

  const twoMapsEqual = (m1: ModuleStates, m2: ModuleStates) => {
    const keys1 = Array.from(m1.keys()).sort();
    const keys2 = Array.from(m2.keys()).sort();
    if (JSON.stringify(keys1) !== JSON.stringify(keys2)) return false;
    let equal = true;
    keys1.forEach((key) => {
      if (m1.get(key) !== m2.get(key)) equal = false;
    });
    return equal;
  }

  let nrLowPulses = 0;
  let nrHighPulses = 0;

  const intermediateResults: { state: ModuleStates, low: number, high: number }[] = []
  let modulesToProcess: string[];
  let tail: number;
  for (let i = 0; i < 1000; i += 1) {
    // console.log('\n')
    // console.log(`New cycle: ${i + 1}`);
    // console.log(`button -low-> broadcaster`)
    // if (i % 10 === 0) console.log(`${i + 1} / 1000`);
    console.log(`${i + 1} / 1000`)
    modulesToProcess = ['broadcaster'];
    nrLowPulses += 1; // button press

    while (modulesToProcess.length > 0) {
      const newModulesToProcess: string[] = [];

      modulesToProcess.forEach((moduleId) => {
        const module = modulesMap.get(moduleId);
        if (module === undefined) return;

        // Get the current state of the module (low or high) and get its incoming input (low or high)
        let currentOutput = outputPulses.get(module.id);
        const newInput = receivedPulses.get(module.id) || [];
        const currentInput = module.from.map((fromId) => outputPulses.get(fromId));
        // Reset the new incoming input
        receivedPulses.set(module.id, []);

        switch (module.type) {
          case "&":
            currentOutput = currentInput.length > 0 && !currentInput.every((p) => p === true);
            break;
          case "%":
            const lowPulses = newInput.filter((p) => p === false);
            if (lowPulses.length === 0) return;
            lowPulses.forEach(() => currentOutput = !currentOutput);
            break;
          case "": currentOutput = newInput.length > 0 ? newInput.pop() : currentOutput; break;
          default: throw new Error(`Unknown module type "${module.type}"`);
        }

        // Set the current output state to the new state
        outputPulses.set(module.id, currentOutput);

        // Increment the pulse count
        if (currentOutput) {
          nrHighPulses += module.to.length;
        } else {
          nrLowPulses += module.to.length;
        }

        // Send the output to this module's inputs
        module.to.forEach((toId) => {
          // console.log(`${moduleId} -${currentOutput ? 'high' : 'low'}-> ${toId}`)

          if (!receivedPulses.has(toId)) return;
          const currentPulses = Array.from(receivedPulses.get(toId) || []);
          receivedPulses.set(toId, [...currentPulses, currentOutput]);
          newModulesToProcess.push(toId);
        });
      });
      modulesToProcess = newModulesToProcess;
    }

    tail = intermediateResults.findIndex((m) => twoMapsEqual(m.state, outputPulses));
    if (tail >= 0) break;

    intermediateResults.push({
      state: new Map(outputPulses),
      low: nrLowPulses,
      high: nrHighPulses,
    });
  }

  if (tail === -1) return nrLowPulses * nrHighPulses;

  const cycle = intermediateResults.length - tail;
  const nrCycles = Math.floor((1000 - tail) / cycle);
  const remainderInCycle = (1000 - tail) % cycle;
  const lowsInCycle = nrLowPulses - (intermediateResults[tail - 1]?.low || 0) - intermediateResults[tail].low;
  const highsInCycle = nrHighPulses - (intermediateResults[tail - 1]?.high || 0) - intermediateResults[tail].high;
  const remainderLows = (intermediateResults[tail + remainderInCycle - 1]?.low || 0) - (intermediateResults[tail - 1]?.low || 0);
  const remainderHighs = (intermediateResults[tail + remainderInCycle - 1]?.high || 0) - (intermediateResults[tail - 1]?.high || 0);
  const totalLows = (intermediateResults[tail - 1]?.low || 0) + nrCycles * lowsInCycle + remainderLows;
  const totalHighs = (intermediateResults[tail - 1]?.high || 0) + nrCycles * highsInCycle + remainderHighs;

  return totalLows * totalHighs;
}

const answer = await day20a();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
