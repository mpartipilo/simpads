import fs from 'fs';
import { RunSimulation } from './lib/simulation.js';

const filename = process.argv[2];
const randomSeed = process.argv[3] ?? 1000;
const pkRatio = process.argv[4] ?? 0.8;
const data = fs.readFileSync(filename, 'utf8');

console.log(`Using random seed: ${randomSeed}`)
const results = RunSimulation({data, randomSeed, pkRatio});

console.table(results)
