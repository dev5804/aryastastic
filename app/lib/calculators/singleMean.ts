// Single Mean Sample Size Calculators
import { getZValue, getZValueOneTailed, getZValueOneTailedAlpha } from './utils';

// 1. Confidence Interval - No Finite Correction
export const calculateSingleMeanCI = (confidenceLevel: number, stdDev: number, marginError: number): number => {
  const z = getZValue(confidenceLevel);
  const nExact = Math.pow((z * stdDev) / marginError, 2);
  return Math.ceil(nExact);
};

// 2. Confidence Interval - With Finite Correction
export const calculateSingleMeanCIFinite = (confidenceLevel: number, stdDev: number, marginError: number, populationSize: number): number => {
  const z = getZValue(confidenceLevel);
  const n0 = Math.pow((z * stdDev) / marginError, 2);
  const nExact = n0 / (1 + (n0 - 1) / populationSize);
  return Math.ceil(nExact);
};

// 3. Two-Tailed Test
export const calculateSingleMeanTwoTailed = (alpha: number, power: number, mu0: number, mua: number, stdDev: number): number => {
  const effectSize = Math.abs(mua - mu0); // Calculate effect size from the means
  const zAlpha = getZValue((1 - alpha) * 100); // Z_{alpha/2}
  const zBeta = getZValueOneTailed(power); // Z_{beta}
  const numerator = (zAlpha + zBeta) * stdDev;
  const nExact = Math.pow(numerator / effectSize, 2);
  return Math.ceil(nExact);
};

// 4. One-Tailed Test
export const calculateSingleMeanOneTailed = (alpha: number, power: number, effectSize: number, stdDev: number): number => {
  const zAlpha = getZValueOneTailedAlpha(alpha); // Z_{alpha}
  const zBeta = getZValueOneTailed(power); // Z_{beta}
  const numerator = (zAlpha + zBeta) * stdDev;
  const nExact = Math.pow(numerator / effectSize, 2);
  return Math.ceil(nExact);
};

// 5. Sign Test (Normal Approximation)
export const calculateSingleMeanSign = (alpha: number, power: number, p1: number): number => {
  const p0 = 0.5;
  const zAlpha = getZValue((1 - alpha) * 100); // Z_{alpha/2}
  const zBeta = getZValueOneTailed(power); // Z_{beta}
  const term1 = zAlpha * Math.sqrt(p0 * (1 - p0));
  const term2 = zBeta * Math.sqrt(p1 * (1 - p1));
  const nExact = Math.pow(term1 + term2, 2) / Math.pow(p1 - p0, 2);
  return Math.ceil(nExact);
};
