// Difference in Means Sample Size Calculators
import { getZValue, getZValueOneTailed, getZValueOneTailedAlpha, CalculatorResult } from './utils';

// Independent Groups Calculators

export const calculateDiffMeansCI = (confidenceLevel: number, stdDev1: number, stdDev2: number, marginError: number): CalculatorResult => {
  try {
    const alpha = (100 - confidenceLevel) / 100;
    const z = getZValue(confidenceLevel);
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const nExact = (2 * z * z * pooledVariance) / (marginError * marginError);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Confidence Level = ${confidenceLevel}%`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      `• Margin of Error (E) = ${marginError}`,
      ``,
      `Step 1: Calculate α`,
      `α = (100 - ${confidenceLevel}) / 100 = ${alpha.toFixed(4)}`,
      ``,
      `Step 2: Find Z-value for ${confidenceLevel}% confidence`,
      `Z_{α/2} = ${z.toFixed(4)}`,
      ``,
      `Step 3: Calculate pooled variance`,
      `σ²pooled = σ1² + σ2² = ${stdDev1}² + ${stdDev2}² = ${pooledVariance.toFixed(4)}`,
      ``,
      `Step 4: Apply the formula`,
      `n = 2 × Z_{α/2}² × σ²pooled / E²`,
      `n = 2 × ${z.toFixed(4)}² × ${pooledVariance.toFixed(4)} / ${marginError}²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 5: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: null,
      effectSize: null,
      interpretation: `For a ${confidenceLevel}% confidence interval of the difference in means with margin of error ${marginError}, you need ${n} subjects per group (total N = ${2*n}).`,
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

export const calculateDiffMeansCIFinite = (confidenceLevel: number, stdDev1: number, stdDev2: number, marginError: number, populationSize1: number, populationSize2: number): CalculatorResult => {
  try {
    const z = getZValue(confidenceLevel);
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const n0 = (2 * z * z * pooledVariance) / (marginError * marginError);
    
    // Apply finite population corrections
    const correction1 = (n0 - 1) / populationSize1;
    const correction2 = (n0 - 1) / populationSize2;
    const avgCorrection = (correction1 + correction2) / 2;
    const nExact = n0 / (1 + avgCorrection);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Confidence Level = ${confidenceLevel}%`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      `• Margin of Error (E) = ${marginError}`,
      `• Population Size Group 1 (N1) = ${populationSize1}`,
      `• Population Size Group 2 (N2) = ${populationSize2}`,
      ``,
      `Step 1: Calculate initial sample size (infinite population)`,
      `n₀ = 2 × Z_{α/2}² × (σ1² + σ2²) / E²`,
      `n₀ = ${n0.toFixed(4)}`,
      ``,
      `Step 2: Apply finite population correction`,
      `n = n₀ / (1 + average((n₀-1)/N1, (n₀-1)/N2))`,
      `n = ${n0.toFixed(4)} / (1 + ${avgCorrection.toFixed(4)})`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: null,
      effectSize: null,
      interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction, you need ${n} subjects per group (total N = ${2*n}).`,
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

export const calculateDiffMeansTwoTailed = (alpha: number, power: number, effectSize: number, stdDev1: number, stdDev2: number): CalculatorResult => {
  try {
    const zAlpha = getZValue((1 - alpha) * 100);
    const zBeta = getZValueOneTailed(power);
    
    // For independent groups: n = 2 × (Z_{α/2} + Z_{β})² × (σ1² + σ2²) / δ²
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const nExact = (2 * Math.pow(zAlpha + zBeta, 2) * pooledVariance) / (effectSize * effectSize);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Effect Size (|μ₁ - μ₂|) = ${effectSize}`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      ``,
      `Step 1: Find Z-values`,
      `Z_{α/2} = ${zAlpha.toFixed(3)}`,
      `Z_{β} = ${zBeta.toFixed(3)}`,
      ``,
      `Step 2: Calculate pooled variance`,
      `σ²pooled = σ1² + σ2² = ${stdDev1}² + ${stdDev2}² = ${pooledVariance.toFixed(3)}`,
      ``,
      `Step 3: Apply the formula for two independent groups`,
      `n = 2 × (Z_{α/2} + Z_{β})² × σ²pooled / δ²`,
      `n = 2 × (${zAlpha.toFixed(3)} + ${zBeta.toFixed(3)})² × ${pooledVariance.toFixed(3)} / ${effectSize}²`,
      `n = 2 × ${Math.pow(zAlpha + zBeta, 2).toFixed(3)} × ${pooledVariance.toFixed(3)} / ${effectSize * effectSize}`,
      `n = ${nExact.toFixed(3)}`,
      ``,
      `Step 4: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: effectSize / Math.sqrt(pooledVariance),
      interpretation: `For a two-tailed test comparing two independent means with α=${alpha}, power=${power}, and effect size=${effectSize}, you need ${n} subjects per group (total N = ${2*n}).`,
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

export const calculateDiffMeansOneTailed = (alpha: number, power: number, effectSize: number, stdDev1: number, stdDev2: number): CalculatorResult => {
  try {
    const zAlpha = getZValueOneTailedAlpha(alpha);
    const zBeta = getZValueOneTailed(power);
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (effectSize * effectSize);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Effect Size (δ) = ${effectSize}`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      ``,
      `Step 1: Find Z-values (one-tailed)`,
      `Z_{α} = ${zAlpha.toFixed(4)}`,
      `Z_{β} = ${zBeta.toFixed(4)}`,
      ``,
      `Step 2: Calculate pooled variance`,
      `σ²pooled = σ1² + σ2² = ${pooledVariance.toFixed(4)}`,
      ``,
      `Step 3: Apply the formula`,
      `n = 2 × σ²pooled × (Z_{α} + Z_{β})² / δ²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 4: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: effectSize / Math.sqrt(pooledVariance),
      interpretation: `For a one-tailed test comparing two independent means with α=${alpha}, power=${power}, and effect size=${effectSize}, you need ${n} subjects per group (total N = ${2*n}).`,
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

export const calculateDiffMeansEquivA = (alpha: number, power: number, equivalenceMargin: number, stdDev1: number, stdDev2: number): CalculatorResult => {
  try {
    const zAlpha = getZValue((1 - alpha) * 100);
    const zBeta = getZValueOneTailed(power);
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (equivalenceMargin * equivalenceMargin);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Equivalence Margin (δ) = ${equivalenceMargin}`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      ``,
      `Step 1: Find Z-values`,
      `Z_{α/2} = ${zAlpha.toFixed(4)}`,
      `Z_{β} = ${zBeta.toFixed(4)}`,
      ``,
      `Step 2: Calculate pooled variance`,
      `σ²pooled = σ1² + σ2² = ${pooledVariance.toFixed(4)}`,
      ``,
      `Step 3: Apply equivalence formula`,
      `n = 2 × σ²pooled × (Z_{α/2} + Z_{β})² / δ²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 4: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: equivalenceMargin / Math.sqrt(pooledVariance),
      interpretation: `For an equivalence study with margin ${equivalenceMargin}, α=${alpha}, and power=${power}, you need ${n} subjects per group (total N = ${2*n}).`,
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

export const calculateDiffMeansEquivB = (alpha: number, power: number, equivalenceMargin: number, stdDev1: number, stdDev2: number, expectedDiff: number): CalculatorResult => {
  try {
    const zAlpha = getZValue((1 - alpha) * 100);
    const zBeta = getZValueOneTailed(power);
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const effectiveDiff = equivalenceMargin - Math.abs(expectedDiff);
    const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (effectiveDiff * effectiveDiff);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Equivalence Margin (δ) = ${equivalenceMargin}`,
      `• Expected Difference = ${expectedDiff}`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      ``,
      `Step 1: Calculate effective difference`,
      `Effective diff = δ - |expected diff| = ${equivalenceMargin} - |${expectedDiff}| = ${effectiveDiff.toFixed(4)}`,
      ``,
      `Step 2: Apply equivalence formula B`,
      `n = 2 × σ²pooled × (Z_{α/2} + Z_{β})² / (effective diff)²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: effectiveDiff / Math.sqrt(pooledVariance),
      interpretation: `For equivalence study B with margin ${equivalenceMargin} and expected difference ${expectedDiff}, you need ${n} subjects per group (total N = ${2*n}).`,
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

export const calculateDiffMeansNonInf = (alpha: number, power: number, nonInfMargin: number, stdDev1: number, stdDev2: number): CalculatorResult => {
  try {
    const zAlpha = getZValueOneTailedAlpha(alpha);
    const zBeta = getZValueOneTailed(power);
    const pooledVariance = stdDev1 * stdDev1 + stdDev2 * stdDev2;
    const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (nonInfMargin * nonInfMargin);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Non-Inferiority Margin (δ) = ${nonInfMargin}`,
      `• Standard Deviation Group 1 (σ1) = ${stdDev1}`,
      `• Standard Deviation Group 2 (σ2) = ${stdDev2}`,
      ``,
      `Step 1: Find Z-values (one-tailed for non-inferiority)`,
      `Z_{α} = ${zAlpha.toFixed(4)}`,
      `Z_{β} = ${zBeta.toFixed(4)}`,
      ``,
      `Step 2: Apply non-inferiority formula`,
      `n = 2 × σ²pooled × (Z_{α} + Z_{β})² / δ²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size per group = ${n}`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: nonInfMargin / Math.sqrt(pooledVariance),
      interpretation: `For a non-inferiority study with margin ${nonInfMargin}, α=${alpha}, and power=${power}, you need ${n} subjects per group (total N = ${2*n}).`,
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

// Related Groups Calculators

export const calculateDiffMeansPaired = (alpha: number, power: number, effectSize: number, stdDevDiff: number): CalculatorResult => {
  try {
    const zAlpha = getZValue((1 - alpha) * 100);
    const zBeta = getZValueOneTailed(power);
    const nExact = Math.pow((zAlpha + zBeta) * stdDevDiff / effectSize, 2);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Effect Size (δ) = ${effectSize}`,
      `• Standard Deviation of Differences (σd) = ${stdDevDiff}`,
      ``,
      `Step 1: Find Z-values`,
      `Z_{α/2} = ${zAlpha.toFixed(4)}`,
      `Z_{β} = ${zBeta.toFixed(4)}`,
      ``,
      `Step 2: Apply paired t-test formula`,
      `n = ((Z_{α/2} + Z_{β}) × σd / δ)²`,
      `n = ((${zAlpha.toFixed(4)} + ${zBeta.toFixed(4)}) × ${stdDevDiff} / ${effectSize})²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n} pairs`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: effectSize / stdDevDiff,
      interpretation: `For a paired t-test with α=${alpha}, power=${power}, and effect size=${effectSize}, you need ${n} paired observations.`,
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

export const calculateDiffMeansCrossover = (alpha: number, power: number, effectSize: number, stdDevWithin: number, carryoverEffect: number): CalculatorResult => {
  try {
    const zAlpha = getZValue((1 - alpha) * 100);
    const zBeta = getZValueOneTailed(power);
    const adjustedVariance = stdDevWithin * stdDevWithin + carryoverEffect * carryoverEffect;
    const nExact = (4 * adjustedVariance * Math.pow(zAlpha + zBeta, 2)) / (effectSize * effectSize);
    const n = Math.ceil(nExact);
    
    const calculations = [
      `Given:`,
      `• Significance Level (α) = ${alpha}`,
      `• Power (1-β) = ${power}`,
      `• Effect Size (δ) = ${effectSize}`,
      `• Within-Subject Standard Deviation (σw) = ${stdDevWithin}`,
      `• Carryover Effect (γ) = ${carryoverEffect}`,
      ``,
      `Step 1: Calculate adjusted variance`,
      `σ²adj = σw² + γ² = ${stdDevWithin}² + ${carryoverEffect}² = ${adjustedVariance.toFixed(4)}`,
      ``,
      `Step 2: Apply crossover formula`,
      `n = 4 × σ²adj × (Z_{α/2} + Z_{β})² / δ²`,
      `n = ${nExact.toFixed(4)}`,
      ``,
      `Step 3: Round up to nearest integer`,
      `Required sample size = ${n} subjects`
    ];
    
    return {
      sampleSize: n,
      power: power,
      effectSize: effectSize / Math.sqrt(adjustedVariance),
      interpretation: `For a crossover design with α=${alpha}, power=${power}, and effect size=${effectSize}, accounting for carryover effects, you need ${n} subjects.`,
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