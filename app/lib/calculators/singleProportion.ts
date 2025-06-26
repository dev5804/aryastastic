// Single Proportion Sample Size Calculators
import { getZValue, getZValueOneTailed, getZValueOneTailedAlpha, CalculatorResult } from './utils';

export const calculateSinglePropCI = (confidenceLevel: number, expectedProportion: number, marginError: number): CalculatorResult => {
  try {
    const z = getZValue(confidenceLevel);
    const p = expectedProportion;
    const nExact = (z * z * p * (1 - p)) / (marginError * marginError);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Confidence Level = ${confidenceLevel}%`,
      `• Expected Proportion (p) = ${expectedProportion}`,
      `• Margin of Error (E) = ${marginError}`,
      ``,
      `Step 1: Find Z-value for ${confidenceLevel}% confidence`,
      `Z_{α/2} = ${z.toFixed(4)}`,
      ``,
      `Step 2: Apply the formula`,
      `n = Z_{α/2}² × p × (1-p) / E²`,
      `n = ${z.toFixed(4)}² × ${p} × ${(1-p).toFixed(3)} / ${marginError}²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: null,
      effectSize: null,
      interpretation: `For a ${confidenceLevel}% confidence interval with expected proportion ${expectedProportion} and margin of error ${marginError}, you need a sample size of ${n}.`,
      calculations: calculations
    };
  } catch {
    return {
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: 'Error in calculation. Please check your inputs.',
      calculations: []
    };
  }
};

export const calculateSinglePropCIFinite = (confidenceLevel: number, expectedProportion: number, marginError: number, populationSize: number): CalculatorResult => {
  try {
    const z = getZValue(confidenceLevel);
    const p = expectedProportion;
    const n0 = (z * z * p * (1 - p)) / (marginError * marginError);
    const correction = (n0 - 1) / populationSize;
    const nExact = n0 / (1 + correction);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Confidence Level = ${confidenceLevel}%`,
      `• Expected Proportion (p) = ${expectedProportion}`,
      `• Margin of Error (E) = ${marginError}`,
      `• Population Size (N) = ${populationSize}`,
      ``,
      `Step 1: Calculate initial sample size`,
      `n₀ = Z_{α/2}² × p × (1-p) / E²`,
      `n₀ = ${n0.toFixed(4)}`,
      ``,
      `Step 2: Apply finite population correction`,
      `n = n₀ / (1 + (n₀-1)/N)`,
      `n = ${n0.toFixed(4)} / (1 + ${correction.toFixed(4)})`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: null,
      effectSize: null,
      interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction (N=${populationSize}), you need a sample size of ${n}.`,
      calculations: calculations
    };
  } catch {
    return {
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: 'Error in calculation. Please check your inputs.',
      calculations: []
    };
  }
};

export const calculateSinglePropCIRel = (confidenceLevel: number, expectedProportion: number, relativeMarginError: number): CalculatorResult => {
  try {
    const z = getZValue(confidenceLevel);
    const p = expectedProportion;
    const absoluteMargin = relativeMarginError * p; // Convert relative to absolute
    const nExact = (z * z * p * (1 - p)) / (absoluteMargin * absoluteMargin);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Confidence Level = ${confidenceLevel}%`,
      `• Expected Proportion (p) = ${expectedProportion}`,
      `• Relative Margin of Error = ${relativeMarginError}`,
      ``,
      `Step 1: Convert relative margin to absolute`,
      `Absolute margin = ${relativeMarginError} × ${p} = ${absoluteMargin.toFixed(4)}`,
      ``,
      `Step 2: Apply the formula`,
      `n = Z_{α/2}² × p × (1-p) / (absolute margin)²`,
      `n = ${z.toFixed(4)}² × ${p} × ${(1-p).toFixed(3)} / ${absoluteMargin.toFixed(4)}²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: null,
      effectSize: null,
      interpretation: `For a ${confidenceLevel}% confidence interval with expected proportion ${expectedProportion} and relative margin of error ${relativeMarginError}, you need a sample size of ${n}.`,
      calculations: calculations
    };
  } catch {
    return {
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: 'Error in calculation. Please check your inputs.',
      calculations: []
    };
  }
};

export const calculateSinglePropCIRelFinite = (confidenceLevel: number, expectedProportion: number, relativeMarginError: number, populationSize: number): CalculatorResult => {
  try {
    const z = getZValue(confidenceLevel);
    const p = expectedProportion;
    const absoluteMargin = relativeMarginError * p;
    const n0 = (z * z * p * (1 - p)) / (absoluteMargin * absoluteMargin);
    const correction = (n0 - 1) / populationSize;
    const nExact = n0 / (1 + correction);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Confidence Level = ${confidenceLevel}%`,
      `• Expected Proportion (p) = ${expectedProportion}`,
      `• Relative Margin of Error = ${relativeMarginError}`,
      `• Population Size (N) = ${populationSize}`,
      ``,
      `Step 1: Convert relative margin to absolute`,
      `Absolute margin = ${relativeMarginError} × ${p} = ${absoluteMargin.toFixed(4)}`,
      ``,
      `Step 2: Calculate initial sample size`,
      `n₀ = Z_{α/2}² × p × (1-p) / (absolute margin)²`,
      `n₀ = ${n0.toFixed(4)}`,
      ``,
      `Step 3: Apply finite population correction`,
      `n = n₀ / (1 + (n₀-1)/N)`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 4: Round up to nearest integer`,
      `Required sample size = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: null,
      effectSize: null,
      interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction and relative margin of error ${relativeMarginError}, you need a sample size of ${n}.`,
      calculations: calculations
    };
  } catch {
    return {
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: 'Error in calculation. Please check your inputs.',
      calculations: []
    };
  }
};

export const calculateSinglePropTwoTailed = (alpha: number, power: number, p0: number, p1: number): CalculatorResult => {
  try {
    const zAlpha = getZValue((1 - alpha) * 100);
    const zBeta = getZValueOneTailed(power);
    const numerator = zAlpha * Math.sqrt(p0 * (1 - p0)) + zBeta * Math.sqrt(p1 * (1 - p1));
    const nExact = Math.pow(numerator / Math.abs(p1 - p0), 2);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Proportion under H0 (p0) = ${p0}`,
      `• Proportion under H1 (p1) = ${p1}`,
      ``,
      `Step 1: Find Z-values`,
      `Z_{α/2} = ${zAlpha.toFixed(4)}`,
      `Z_{β} = ${zBeta.toFixed(4)}`,
      ``,
      `Step 2: Apply the formula`,
      `n = (Z_{α/2}√(p0(1-p0)) + Z_{β}√(p1(1-p1)))² / |p1-p0|²`,
      `n = (${zAlpha.toFixed(4)}√(${p0}×${(1-p0).toFixed(3)}) + ${zBeta.toFixed(4)}√(${p1}×${(1-p1).toFixed(3)}))² / |${p1}-${p0}|²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: Math.abs(p1 - p0),
      interpretation: `For a two-tailed test comparing proportions with α=${alpha}, power=${power}, p0=${p0}, and p1=${p1}, you need a sample size of ${n}.`,
      calculations: calculations
    };
  } catch {
    return {
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: 'Error in calculation. Please check your inputs.',
      calculations: []
    };
  }
};

export const calculateSinglePropOneTailed = (alpha: number, power: number, p0: number, p1: number): CalculatorResult => {
  try {
    const zAlpha = getZValueOneTailedAlpha(alpha);
    const zBeta = getZValueOneTailed(power);
    const numerator = zAlpha * Math.sqrt(p0 * (1 - p0)) + zBeta * Math.sqrt(p1 * (1 - p1));
    const nExact = Math.pow(numerator / Math.abs(p1 - p0), 2);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Proportion under H0 (p0) = ${p0}`,
      `• Proportion under H1 (p1) = ${p1}`,
      ``,
      `Step 1: Find Z-values (one-tailed)`,
      `Z_{α} = ${zAlpha.toFixed(4)}`,
      `Z_{β} = ${zBeta.toFixed(4)}`,
      ``,
      `Step 2: Apply the formula`,
      `n = (Z_{α}√(p0(1-p0)) + Z_{β}√(p1(1-p1)))² / |p1-p0|²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: Math.abs(p1 - p0),
      interpretation: `For a one-tailed test comparing proportions with α=${alpha}, power=${power}, p0=${p0}, and p1=${p1}, you need a sample size of ${n}.`,
      calculations: calculations
    };
  } catch {
    return {
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: 'Error in calculation. Please check your inputs.',
      calculations: []
    };
  }
}; 