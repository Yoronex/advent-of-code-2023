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

export async function day20b(dataPath?: string) {
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

  let modulesToProcess: string[];
  let i = 0;
  let rxEnabled = false;
  while (!rxEnabled) {
    if (i % 10000 === 0) console.log(`Button press: ${i + 1}`);
    modulesToProcess = ['broadcaster'];

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

        // Send the output to this module's inputs
        module.to.forEach((toId) => {
          // console.log(`${moduleId} -${currentOutput ? 'high' : 'low'}-> ${toId}`)
          if (toId === 'rx' && currentOutput === false) {
            rxEnabled = true;
            return;
          }
          if (!receivedPulses.has(toId)) return;
          const currentPulses = Array.from(receivedPulses.get(toId) || []);
          receivedPulses.set(toId, [...currentPulses, currentOutput]);
          newModulesToProcess.push(toId);
        });
      });
      modulesToProcess = newModulesToProcess;
    }

    i += 1;
  }

  return i + 1;
}

const answer = await day20b();
console.log(chalk.bgGreen('Your Answer:'), chalk.green(answer));
