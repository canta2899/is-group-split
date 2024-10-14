import { PartitionResult } from "./types";

let SEED = Math.random();
const setSeed = (val: number) => SEED = val;

/**
 * Calculate the average rating for a given partition in the rating matrix.
 * @param {number[]} partition - The indices of members in the partition.
 * @param {number[][]} matrix - The rating matrix.
 * @returns {number} The average rating of the partition.
 */
const calculateAverage = (partition: number[], matrix: number[][]): number => {
  if (partition.length === 0) return 0;
  let totalRating = 0;

  for (let i = 0; i < matrix.length; i++) {
    if (partition.includes(i)) {
      for (let j = 0; j < matrix.length; j++) {
        if (partition.includes(j)) {
          totalRating += matrix[i][j];
        }
      }
    }
  }

  return totalRating / partition.length;
}

// Seeded random number generator function
const seededRandom = () => {
  const x = Math.sin(SEED) * 10000;
  SEED += 31;
  return x - Math.floor(x);
};

// /**
//  * Swap random members between two teams.
//  * @param {number[]} t1 - The first team.
//  * @param {number[]} t2 - The second team.
//  */
const swapMembers = (t1: number[], t2: number[]): void => {
  // Generate two random indexes using the seeded random generator
  const randomIndex1 = Math.floor(seededRandom() * t1.length);
  const randomIndex2 = Math.floor(seededRandom() * t2.length);  // Use a slightly modified seed for second index

  // Swap the members at the chosen random indices
  [t1[randomIndex1], t2[randomIndex2]] = [t2[randomIndex2], t1[randomIndex1]];
};

/**
 * Generate an initial partition by alternating members.
 * @param {number} matrixSize - The size of the matrix (number of members).
 * @returns {{ team1: number[], team2: number[] }} An object containing the initial teams.
 */
const getInitialPartition = (matrixSize: number): { team1: number[]; team2: number[] } => {
  const team1: number[] = [];
  const team2: number[] = [];
  for (let i = 0; i < matrixSize; i++) {
    if (i % 2 === 0) {
      team1.push(i);
    } else {
      team2.push(i);
    }
  }

  return { team1, team2 }
}

/**
 * Calculate the ratings using an heuristic.
 * This is used for bigger matrices (N > 25) since brute force is not feasible
 * @param {number[][]} matrix - The rating matrix.
 * @returns {PartitionResult} An object containing the best median and partition.
 */
const calculateRatingsHeuristic = (matrix: number[][]): PartitionResult => {
  setSeed(42);

  const N = matrix.length;
  let bestMedian = -Infinity;
  let chosenPartition: number[][] = [[], []];

  const { team1, team2 } = getInitialPartition(N);

  const iterSize = 5000;

  for (let iter = 0; iter < iterSize; iter++) {
    const avg1 = calculateAverage(team1, matrix);
    const avg2 = calculateAverage(team2, matrix);
    const currentMedian = (avg1 + avg2) / 2;

    if (currentMedian > bestMedian) {
      bestMedian = currentMedian;
      chosenPartition = [team1.slice(), team2.slice()];
    }

    // Swap random members between teams and check if it improves the result
    swapMembers(team1, team2);
  }

  return {
    team1: chosenPartition[0],
    team2: chosenPartition[1]
  };
}

/**
 * Determine if the two teams can be processed based on their sizes.
 * @param {number[]} team1 - The first team.
 * @param {number[]} team2 - The second team.
 * @param {number} matrixSize - The size of the matrix.
 * @returns {boolean} True if teams can be processed, otherwise false.
 */
const shouldProcessTeams = (team1: number[], team2: number[], matrixSize: number) => {
  const isEven = matrixSize % 2 == 0
  const halfSize = matrixSize / 2;

  const canProcessEvenMatrix = isEven && team1.length === halfSize && team2.length === halfSize;

  const canProcessOddMatrix = !isEven && team1.length === Math.floor(halfSize) && team2.length === Math.ceil(halfSize);

  return canProcessEvenMatrix || canProcessOddMatrix;
}

/**
 * Calculate the ratings evaluating all possible combinations.
 * @param {number[][]} matrix - The rating matrix.
 * @returns {PartitionResult} An object containing the best median and partition.
 */
const calculateRatingsBruteForce = (matrix: number[][]): PartitionResult => {
  const N = matrix.length;
  let bestMedian = -Infinity;
  let chosenPartition: number[][] = [[], []];
  const totalSubsets = 1 << matrix.length; // 2^N subsets

  for (let mask = 1; mask < totalSubsets; mask++) { // each subset
    const team1 = [];
    const team2 = [];

    // Fill teams based on the current mask
    for (let i = 0; i < N; i++) {
      if (mask & (1 << i)) {
        team1.push(i);
      } else {
        team2.push(i);
      }
    }

    if (shouldProcessTeams(team1, team2, N)) {
      const avg1 = calculateAverage(team1, matrix);
      const avg2 = calculateAverage(team2, matrix);
      const currentMedian = (avg1 + avg2) / 2;

      if (currentMedian > bestMedian) {
        bestMedian = currentMedian;
        chosenPartition = [team1, team2];
      }
    }
  }

  return {
    team1: chosenPartition[0],
    team2: chosenPartition[1]
  }
}

/**
 * Calculate ratings based on the matrix size.
 * @param {number[][]} matrix - The rating matrix.
 * @returns {PartitionResult} An object containing the best median and partition.
 */
const calculateRatings = (matrix: number[][]): Promise<PartitionResult> => {
  return new Promise((resolve) => {
    if (matrix.length <= 23)
      return resolve(calculateRatingsBruteForce(matrix));

    return resolve(calculateRatingsHeuristic(matrix));

  })
}

export default { calculateRatings };
