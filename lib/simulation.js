/**
 * seedRandom initializes a pseudo-random number generator returning values.
 *
 * @param {number} seed - The initial seed value for the random number generator.
 * @returns {Function} A function that returns a different value between 0 and 1 each time it is called.
 */
function seedRandom(seed) {
  let localSeed = seed;
  return () => {
    let x = Math.sin(localSeed++) * 10000;
    return x - Math.floor(x);
  };
}

/**
 * randomGenerator returns a function that returns a different value between 0 and 100 each time it's called.
 *
 * @param {number} randomSeed - The initial seed value for the random number generator.
 * @returns {Function} A function that returns a different value between 0 and 100 each time it is called.
 */
function randomGenerator(randomSeed) {
  const seeder = seedRandom(randomSeed);
  return () => seeder() * 100;
}

/**
 * Represents a simulation for detecting hostile entities and calculating missile engagement success.
 */
class Simulator {
  /**
   * Creates a new instance of the Simulator class.
   *
   * @param {Object} options - An object containing the configuration options for the simulator.
   * @param {number} [options.pkRatio=0.8] - The probability of kill ratio used to calculate missile engagement success.
   * @param {number} [options.randomSeed=1000] - The initial seed value for the random number generator.
   * @param {Function} [options.uniformRand] - A function that returns a different value between 0 and 100 each time it is called.
   */
  constructor({ pkRatio = 0.8, randomSeed = 1000, uniformRand }) {
    this.randomSeed = randomSeed;
    this.pkRatio = pkRatio;
    this.uniformRand = uniformRand ?? randomGenerator(randomSeed);

    this.TranslateDatagram = this.TranslateDatagram.bind(this);
    this.IFFDetectHostileEntity = this.IFFDetectHostileEntity.bind(this);
    this.CalculateMissileEngagementSuccess =
      this.CalculateMissileEngagementSuccess.bind(this);
    this.SimulateTimeStep = this.SimulateTimeStep.bind(this);
  }

  /**
   * Translates a datagram to determine if it represents an odd or even binary-encoded integer.
   *
   * @param {string} datagram - A string representing a binary number, where the last character determines parity.
   * @returns {number} 1 if the binary-encoded integer is odd (last digit of datagram is '1'), otherwise 0.
   */
  TranslateDatagram(datagram) {
    return datagram.split("").at(-1) == "1" ? 1 : 0;
  }

  /**
   * The function calculates whether there is an imbalance in the number of ones and zeroes within the dataframe.
   * It returns true if there are more ones than zeroes (after ensuring that no negative value can be returned),
   * otherwise it returns false.
   *
   * @param {number[]} dataFrame - The array of numbers to analyze.
   * @returns {boolean} True if there are more odd numbers than even numbers, indicating a potential hostile entity; otherwise false.
   */
  IFFDetectHostileEntity(dataFrame) {
    const odds = dataFrame.reduce((acc, c) => acc + (c > 0 ? 1 : 0), 0);
    const evens = dataFrame.length - odds;

    return Math.max(0, odds - evens) > 0;
  }

  /**
   * Calculates the success of missile engagement based on a given threshold and calculated probability of kill.
   *
   * @param {number} successThreshold - The threshold used to determine if the engagement was successful.
   * @param {number} calculatedPoK - The calculated probability of kill for the engagement.
   * @returns {boolean} True if the engagement was successful; otherwise false.
   */
  CalculateMissileEngagementSuccess(successThreshold, calculatedPoK) {
    return calculatedPoK <= successThreshold * 100;
  }

  /**
   * Simulates a time step by translating datagrams and calculating missile engagement success.
   *
   * @param {string[]} timeStep - An array of strings representing the datagrams for the time step.
   * @returns {Object} An object containing the results of the simulation, including radar input,
   * hostile detection status, missile firing status, calculated probability of kill, and engagement success status.
   */
  SimulateTimeStep(timeStep) {
    timeStep = timeStep.map(this.TranslateDatagram);

    const result = {
      radarInput: timeStep.sort().join(""),
      hostileDetected: false,
      missileFired: false,
      calculatedPok: "0.0",
      engagementSuccess: false,
    };

    result.hostileDetected = result.missileFired =
      this.IFFDetectHostileEntity(timeStep);

    if (result.hostileDetected) {
      const pok = this.uniformRand();
      result.calculatedPok = pok.toFixed(2);
      result.engagementSuccess = this.CalculateMissileEngagementSuccess(
        this.pkRatio,
        pok
      );
    }

    return result;
  }

  /**
   * Runs the simulation for a given set of radar data.
   *
   * @param {string} radarData - A string containing the radar data to be processed by the simulator.
   * @returns {Object[]} An array of objects containing the results of each time step in the simulation.
   */
  Run(radarData) {
    const dataLines = radarData.split("\n");
    const timeSteps = dataLines.map((l) => l.split(";"));

    const results = timeSteps.map(this.SimulateTimeStep);

    return results;
  }
}

/**
 * Runs a simulation for detecting hostile entities and calculating missile engagement success.
 *
 * @param {Object} options - An object containing the configuration options for the simulation.
 * @param {string} options.data - A string containing the radar data to be processed by the simulator.
 * @param {number} [options.randomSeed=1000] - The initial seed value for the random number generator.
 * @param {number} [options.pkRatio=0.8] - The probability of kill ratio used to calculate missile engagement success.
 * @returns {Object[]} An array of objects containing the results of each time step in the simulation.
 */
function RunSimulation({ data, randomSeed = 1000, pkRatio = 0.8 }) {
  const sim = new Simulator({ randomSeed, pkRatio });

  return sim.Run(data);
}

export { 
  Simulator, 
  RunSimulation 
};
