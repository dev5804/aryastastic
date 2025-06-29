'use client';

import { useState, useRef } from 'react';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('single-mean-ci');
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<{
    sampleSize: number | null;
    power: number | null;
    effectSize: number | null;
    interpretation: string;
    calculations: string[];
  }>({
    sampleSize: null,
    power: null,
    effectSize: null,
    interpretation: '',
    calculations: []
  });

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Clear results when changing tabs
    setResults({
      sampleSize: null,
      power: null,
      effectSize: null,
      interpretation: '',
      calculations: []
    });
    // Smooth scroll to calculator section
    setTimeout(() => {
      calculatorRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Statistical functions

  const getZValue = (confidenceLevel: number): number => {
    const zTable: { [key: number]: number } = {
      80: 1.2816,
      85: 1.4395,
      90: 1.6449,
      95: 1.96,
      98: 2.326,
      99: 2.576,  // ✅ Fixed: 99% confidence → Z = 2.576
      99.5: 2.807,
      99.9: 3.291
    };
    return zTable[confidenceLevel] || 1.96; // fallback to 95%
  };

  const getZValueOneTailed = (power: number): number => {
    // For power calculations, we need Z_β where β = 1 - power
    const beta = 1 - power;
    const zTable: { [key: string]: number } = {
      '0.01': 2.33,   // 99% power → β = 0.01 → Z = 2.33
      '0.02': 2.05,   // 98% power → β = 0.02 → Z = 2.05  
      '0.05': 1.645,  // 95% power → β = 0.05 → Z = 1.645
      '0.1': 1.28,    // 90% power → β = 0.10 → Z = 1.28
      '0.2': 0.84,    // 80% power → β = 0.20 → Z = 0.84
    };
    
    const key = beta.toFixed(2);
    return zTable[key] || 1.28; // fallback to 80% power
  };

  // Get Z-value for one-tailed alpha
  const getZValueOneTailedAlpha = (alpha: number): number => {
    const zTable: { [key: string]: number } = {
      '0.001': 3.09,
      '0.005': 2.576,
      '0.01': 2.33,
      '0.025': 1.96,
      '0.05': 1.645,
      '0.1': 1.28,
      '0.2': 0.84
    };
    
    const key = alpha.toFixed(3);
    return zTable[key] || 1.645; // fallback to α=0.05
  };

  // Calculator functions
  const calculateSingleMeanCI = (confidenceLevel: number, stdDev: number, marginError: number) => {
    try {
      const alpha = (100 - confidenceLevel) / 100;
      const z = getZValue(confidenceLevel);
      const numerator = z * stdDev;
      const nExact = Math.pow(numerator / marginError, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Confidence Level = ${confidenceLevel}%`,
        `• Standard Deviation (σ) = ${stdDev}`,
        `• Margin of Error (E) = ${marginError}`,
        ``,
        `Step 1: Calculate α`,
        `α = (100 - ${confidenceLevel}) / 100 = ${alpha.toFixed(4)}`,
        ``,
        `Step 2: Find Z-value for ${confidenceLevel}% confidence`,
        `Z_{α/2} = Z_{${(alpha/2).toFixed(4)}} = ${z.toFixed(4)}`,
        ``,
        `Step 3: Apply the formula`,
        `n = (Z_{α/2} × σ / E)²`,
        `n = (${z.toFixed(4)} × ${stdDev} / ${marginError})²`,
        `n = (${numerator.toFixed(4)} / ${marginError})²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 4: Round up to nearest integer`,
        `Required sample size = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with margin of error ${marginError} and standard deviation ${stdDev}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  const calculateSingleMeanCIFinite = (confidenceLevel: number, stdDev: number, marginError: number, populationSize: number) => {
    try {
      const alpha = (100 - confidenceLevel) / 100;
      const z = getZValue(confidenceLevel);
      const numerator = z * stdDev;
      const n0 = Math.pow(numerator / marginError, 2);
      const correction = (n0 - 1) / populationSize;
      const nExact = n0 / (1 + correction);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Confidence Level = ${confidenceLevel}%`,
        `• Standard Deviation (σ) = ${stdDev}`,
        `• Margin of Error (E) = ${marginError}`,
        `• Population Size (N) = ${populationSize}`,
        ``,
        `Step 1: Calculate α`,
        `α = (100 - ${confidenceLevel}) / 100 = ${alpha.toFixed(4)}`,
        ``,
        `Step 2: Find Z-value for ${confidenceLevel}% confidence`,
        `Z_{α/2} = Z_{${(alpha/2).toFixed(4)}} = ${z.toFixed(4)}`,
        ``,
        `Step 3: Calculate initial sample size (infinite population)`,
        `n₀ = (Z_{α/2} × σ / E)²`,
        `n₀ = (${z.toFixed(4)} × ${stdDev} / ${marginError})²`,
        `n₀ = ${n0.toFixed(4)}`,
        ``,
        `Step 4: Apply finite population correction`,
        `n = n₀ / (1 + (n₀ - 1) / N)`,
        `n = ${n0.toFixed(4)} / (1 + (${n0.toFixed(4)} - 1) / ${populationSize})`,
        `n = ${n0.toFixed(4)} / (1 + ${correction.toFixed(4)})`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 5: Round up to nearest integer`,
        `Required sample size = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction (N=${populationSize}), margin of error ${marginError}, and standard deviation ${stdDev}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  const calculateSingleMeanTwoTailed = (alpha: number, power: number, mu0: number, mua: number, stdDev: number) => {
    try {
      const effectSize = Math.abs(mua - mu0);  // Calculate effect size from the means
      const zAlpha = getZValue((1 - alpha) * 100);  // For two-tailed: Z_{α/2}
      const zBeta = getZValueOneTailed(power);       // Z_β for power
      
      // Formula: n = ((Z_{α/2} + Z_β) × σ / |effect|)²
      const numerator = (zAlpha + zBeta) * stdDev;
      const nExact = Math.pow(numerator / effectSize, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Mean under H0 (μ₀) = ${mu0}`,
        `• Mean under H1 (μₐ) = ${mua}`,
        `• Standard Deviation (σ) = ${stdDev}`,
        ``,
        `Step 1: Calculate effect size`,
        `Effect size = |μₐ - μ₀| = |${mua} - ${mu0}| = ${effectSize}`,
        ``,
        `Step 2: Find Z-value for α (two-tailed)`,
        `Z_{α/2} = Z_{${(alpha/2).toFixed(3)}} = ${zAlpha.toFixed(3)}`,
        ``,
        `Step 3: Find Z-value for power (β = ${(1-power).toFixed(2)})`,
        `Z_{β} = Z_{${(1-power).toFixed(3)}} = ${zBeta.toFixed(3)}`,
        ``,
        `Step 4: Apply the two-tailed formula`,
        `n = ((Z_{α/2} + Z_{β}) × σ / |effect|)²`,
        `n = ((${zAlpha.toFixed(3)} + ${zBeta.toFixed(3)}) × ${stdDev} / ${effectSize})²`,
        `n = (${(zAlpha + zBeta).toFixed(3)} × ${stdDev} / ${effectSize})²`,
        `n = (${numerator.toFixed(3)} / ${effectSize})²`,
        `n = ${(numerator / effectSize).toFixed(3)}²`,
        `n = ${nExact.toFixed(3)}`,
        ``,
        `Step 5: Round up to nearest integer`,
        `Required sample size = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectSize / stdDev,
        interpretation: `For a two-tailed test with α=${alpha}, power=${power}, testing H0: μ=${mu0} vs H1: μ=${mua} (effect size=${effectSize}) with standard deviation=${stdDev}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  const calculateSingleMeanOneTailed = (alpha: number, power: number, effectSize: number, stdDev: number) => {
    try {
      // For one-tailed test, we need Z_α (not Z_{α/2})
      const zAlpha = getZValueOneTailedAlpha(alpha);
      const zBeta = getZValueOneTailed(power);
      
      // Formula: n = ((Z_α + Z_β) × σ / |effect|)²
      const numerator = (zAlpha + zBeta) * stdDev;
      const nExact = Math.pow(numerator / effectSize, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Effect Size (|μ₁ - μ₀|) = ${effectSize}`,
        `• Standard Deviation (σ) = ${stdDev}`,
        ``,
        `Step 1: Find Z-value for α (one-tailed)`,
        `Z_{α} = Z_{${alpha.toFixed(3)}} = ${zAlpha.toFixed(3)}`,
        ``,
        `Step 2: Find Z-value for power (β = ${(1-power).toFixed(2)})`,
        `Z_{β} = Z_{${(1-power).toFixed(3)}} = ${zBeta.toFixed(3)}`,
        ``,
        `Step 3: Apply the one-tailed formula`,
        `n = ((Z_{α} + Z_{β}) × σ / |effect|)²`,
        `n = ((${zAlpha.toFixed(3)} + ${zBeta.toFixed(3)}) × ${stdDev} / ${effectSize})²`,
        `n = (${(zAlpha + zBeta).toFixed(3)} × ${stdDev} / ${effectSize})²`,
        `n = (${numerator.toFixed(3)} / ${effectSize})²`,
        `n = ${(numerator / effectSize).toFixed(3)}²`,
        `n = ${nExact.toFixed(3)}`,
        ``,
        `Step 4: Round up to nearest integer`,
        `Required sample size = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectSize / stdDev,
        interpretation: `For a one-tailed test with α=${alpha}, power=${power}, effect size=${effectSize}, and standard deviation=${stdDev}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Mean - Sign Test
  const calculateSingleMeanSign = (alpha: number, power: number, p1: number) => {
    try {
      const p0 = 0.5; // Null hypothesis probability
      const zAlpha = getZValue((1-alpha) * 100);
      const zBeta = getZValueOneTailed(power);
      
      // Using normal approximation for binomial
      const nExact = Math.pow(zAlpha * Math.sqrt(p0 * (1 - p0)) + zBeta * Math.sqrt(p1 * (1 - p1)), 2) / Math.pow(p1 - p0, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Probability under H1 (p1) = ${p1}`,
        `• Probability under H0 (p0) = 0.5`,
        ``,
        `Step 1: Find Z-values`,
        `Z_{α/2} = ${zAlpha.toFixed(4)}`,
        `Z_{β} = ${zBeta.toFixed(4)}`,
        ``,
        `Step 2: Apply the formula for sign test`,
        `n = (Z_{α/2} × √(p0(1-p0)) + Z_{β} × √(p1(1-p1)))² / (p1-p0)²`,
        `n = (${zAlpha.toFixed(4)} × √(0.5×0.5) + ${zBeta.toFixed(4)} × √(${p1}×${(1-p1).toFixed(3)}))² / (${p1}-0.5)²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p0),
        interpretation: `For a sign test with α=${alpha}, power=${power}, and probability under H1=${p1}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - CI
  const calculateDiffMeansCI = (confidenceLevel: number, stdDev1: number, stdDev2: number, marginError: number) => {
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
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval of the difference in means with margin of error ${marginError}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - CI with Finite Correction
  const calculateDiffMeansCIFinite = (confidenceLevel: number, stdDev1: number, stdDev2: number, marginError: number, populationSize1: number, populationSize2: number) => {
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
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - Two Tailed Test
  const calculateDiffMeansTwoTailed = (alpha: number, power: number, effectSize: number, stdDev1: number, stdDev2: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectSize / Math.sqrt(pooledVariance),
        interpretation: `For a two-tailed test comparing two independent means with α=${alpha}, power=${power}, and effect size=${effectSize}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - One Tailed Test
  const calculateDiffMeansOneTailed = (alpha: number, power: number, effectSize: number, stdDev1: number, stdDev2: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectSize / Math.sqrt(pooledVariance),
        interpretation: `For a one-tailed test comparing two independent means with α=${alpha}, power=${power}, and effect size=${effectSize}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - Equivalence Study A
  const calculateDiffMeansEquivA = (alpha: number, power: number, equivalenceMargin: number, stdDev1: number, stdDev2: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: equivalenceMargin / Math.sqrt(pooledVariance),
        interpretation: `For an equivalence study with margin ${equivalenceMargin}, α=${alpha}, and power=${power}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - Equivalence Study B  
  const calculateDiffMeansEquivB = (alpha: number, power: number, equivalenceMargin: number, stdDev1: number, stdDev2: number, expectedDiff: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectiveDiff / Math.sqrt(pooledVariance),
        interpretation: `For equivalence study B with margin ${equivalenceMargin} and expected difference ${expectedDiff}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Independent) - Non-Inferiority
  const calculateDiffMeansNonInf = (alpha: number, power: number, nonInfMargin: number, stdDev1: number, stdDev2: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: nonInfMargin / Math.sqrt(pooledVariance),
        interpretation: `For a non-inferiority study with margin ${nonInfMargin}, α=${alpha}, and power=${power}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Related) - Paired t-test
  const calculateDiffMeansPaired = (alpha: number, power: number, effectSize: number, stdDevDiff: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectSize / stdDevDiff,
        interpretation: `For a paired t-test with α=${alpha}, power=${power}, and effect size=${effectSize}, you need ${n} paired observations.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Means (Related) - Crossover Design
  const calculateDiffMeansCrossover = (alpha: number, power: number, effectSize: number, stdDevWithin: number, carryoverEffect: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectSize / Math.sqrt(adjustedVariance),
        interpretation: `For a crossover design with α=${alpha}, power=${power}, and effect size=${effectSize}, accounting for carryover effects, you need ${n} subjects.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Proportion - CI (Absolute, No Finite)
  const calculateSinglePropCI = (confidenceLevel: number, expectedProportion: number, marginError: number) => {
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
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with expected proportion ${expectedProportion} and margin of error ${marginError}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Proportion - CI (Absolute, With Finite)
  const calculateSinglePropCIFinite = (confidenceLevel: number, expectedProportion: number, marginError: number, populationSize: number) => {
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
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction (N=${populationSize}), you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Proportion - CI (Relative, No Finite)
  const calculateSinglePropCIRel = (confidenceLevel: number, expectedProportion: number, relativeMarginError: number) => {
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
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with expected proportion ${expectedProportion} and relative margin of error ${relativeMarginError}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Proportion - CI (Relative, With Finite)
  const calculateSinglePropCIRelFinite = (confidenceLevel: number, expectedProportion: number, relativeMarginError: number, populationSize: number) => {
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
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval with finite population correction and relative margin of error ${relativeMarginError}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Proportion - Two Tailed Test
  const calculateSinglePropTwoTailed = (alpha: number, power: number, p0: number, p1: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p0),
        interpretation: `For a two-tailed test comparing proportions with α=${alpha}, power=${power}, p0=${p0}, and p1=${p1}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Single Proportion - One Tailed Test
  const calculateSinglePropOneTailed = (alpha: number, power: number, p0: number, p1: number) => {
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
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p0),
        interpretation: `For a one-tailed test comparing proportions with α=${alpha}, power=${power}, p0=${p0}, and p1=${p1}, you need a sample size of ${n}.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Independent) - CI
  const calculateDiffPropCI = (confidenceLevel: number, p1: number, p2: number, marginError: number) => {
    try {
      const z = getZValue(confidenceLevel);
      const pooledVariance = p1 * (1 - p1) + p2 * (1 - p2);
      const nExact = (2 * z * z * pooledVariance) / (marginError * marginError);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Confidence Level = ${confidenceLevel}%`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        `• Margin of Error (E) = ${marginError}`,
        ``,
        `Step 1: Calculate pooled variance`,
        `Var = p1(1-p1) + p2(1-p2) = ${p1}×${(1-p1).toFixed(3)} + ${p2}×${(1-p2).toFixed(3)} = ${pooledVariance.toFixed(4)}`,
        ``,
        `Step 2: Apply the formula`,
        `n = 2 × Z_{α/2}² × Var / E²`,
        `n = 2 × ${z.toFixed(4)}² × ${pooledVariance.toFixed(4)} / ${marginError}²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: null,
        effectSize: null,
        interpretation: `For a ${confidenceLevel}% confidence interval of the difference in proportions with margin of error ${marginError}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Independent) - Two Tailed Test
  const calculateDiffPropTwoTailed = (alpha: number, power: number, p1: number, p2: number) => {
    try {
      const zAlpha = getZValue((1 - alpha) * 100);
      const zBeta = getZValueOneTailed(power);
      const pooledP = (p1 + p2) / 2;
      const numerator1 = zAlpha * Math.sqrt(2 * pooledP * (1 - pooledP));
      const numerator2 = zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
      const nExact = Math.pow((numerator1 + numerator2) / Math.abs(p1 - p2), 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        ``,
        `Step 1: Calculate pooled proportion`,
        `p̄ = (p1 + p2) / 2 = ${pooledP.toFixed(4)}`,
        ``,
        `Step 2: Apply the formula`,
        `n = (Z_{α/2}√(2p̄(1-p̄)) + Z_{β}√(p1(1-p1)+p2(1-p2)))² / |p1-p2|²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p2),
        interpretation: `For a two-tailed test comparing two independent proportions with α=${alpha}, power=${power}, p1=${p1}, and p2=${p2}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Independent) - One Tailed Test
  const calculateDiffPropOneTailed = (alpha: number, power: number, p1: number, p2: number) => {
    try {
      const zAlpha = getZValueOneTailedAlpha(alpha);
      const zBeta = getZValueOneTailed(power);
      const pooledP = (p1 + p2) / 2;
      const numerator1 = zAlpha * Math.sqrt(2 * pooledP * (1 - pooledP));
      const numerator2 = zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
      const nExact = Math.pow((numerator1 + numerator2) / Math.abs(p1 - p2), 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        ``,
        `Step 1: Calculate pooled proportion`,
        `p̄ = (p1 + p2) / 2 = ${pooledP.toFixed(4)}`,
        ``,
        `Step 2: Apply the formula (one-tailed)`,
        `n = (Z_{α}√(2p̄(1-p̄)) + Z_{β}√(p1(1-p1)+p2(1-p2)))² / |p1-p2|²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p2),
        interpretation: `For a one-tailed test comparing two independent proportions with α=${alpha}, power=${power}, p1=${p1}, and p2=${p2}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Independent) - Equivalence A
  const calculateDiffPropEquivA = (alpha: number, power: number, equivalenceMargin: number, p1: number, p2: number) => {
    try {
      const zAlpha = getZValue((1 - alpha) * 100);
      const zBeta = getZValueOneTailed(power);
      const pooledVariance = p1 * (1 - p1) + p2 * (1 - p2);
      const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (equivalenceMargin * equivalenceMargin);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Equivalence Margin (δ) = ${equivalenceMargin}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        ``,
        `Step 1: Calculate pooled variance`,
        `Var = p1(1-p1) + p2(1-p2) = ${pooledVariance.toFixed(4)}`,
        ``,
        `Step 2: Apply equivalence formula`,
        `n = 2 × Var × (Z_{α/2} + Z_{β})² / δ²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: equivalenceMargin,
        interpretation: `For an equivalence study comparing proportions with margin ${equivalenceMargin}, α=${alpha}, and power=${power}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Independent) - Equivalence B
  const calculateDiffPropEquivB = (alpha: number, power: number, equivalenceMargin: number, p1: number, p2: number, expectedDiff: number) => {
    try {
      const zAlpha = getZValue((1 - alpha) * 100);
      const zBeta = getZValueOneTailed(power);
      const pooledVariance = p1 * (1 - p1) + p2 * (1 - p2);
      const effectiveDiff = equivalenceMargin - Math.abs(expectedDiff);
      const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (effectiveDiff * effectiveDiff);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Equivalence Margin (δ) = ${equivalenceMargin}`,
        `• Expected Difference = ${expectedDiff}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        ``,
        `Step 1: Calculate effective difference`,
        `Effective diff = δ - |expected diff| = ${equivalenceMargin} - |${expectedDiff}| = ${effectiveDiff.toFixed(4)}`,
        ``,
        `Step 2: Apply equivalence formula B`,
        `n = 2 × Var × (Z_{α/2} + Z_{β})² / (effective diff)²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: effectiveDiff,
        interpretation: `For equivalence study B comparing proportions with margin ${equivalenceMargin} and expected difference ${expectedDiff}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Independent) - Non-Inferiority
  const calculateDiffPropNonInf = (alpha: number, power: number, nonInfMargin: number, p1: number, p2: number) => {
    try {
      const zAlpha = getZValueOneTailedAlpha(alpha);
      const zBeta = getZValueOneTailed(power);
      const pooledVariance = p1 * (1 - p1) + p2 * (1 - p2);
      const nExact = (2 * pooledVariance * Math.pow(zAlpha + zBeta, 2)) / (nonInfMargin * nonInfMargin);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Non-Inferiority Margin (δ) = ${nonInfMargin}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        ``,
        `Step 1: Calculate pooled variance`,
        `Var = p1(1-p1) + p2(1-p2) = ${pooledVariance.toFixed(4)}`,
        ``,
        `Step 2: Apply non-inferiority formula`,
        `n = 2 × Var × (Z_{α} + Z_{β})² / δ²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: nonInfMargin,
        interpretation: `For a non-inferiority study comparing proportions with margin ${nonInfMargin}, α=${alpha}, and power=${power}, you need ${n} subjects per group (total N = ${2*n}).`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Related) - Two Tailed
  const calculateDiffPropRelTwo = (alpha: number, power: number, p1: number, p2: number, correlation: number) => {
    try {
      const zAlpha = getZValue((1 - alpha) * 100);
      const zBeta = getZValueOneTailed(power);
      const varDiff = p1 * (1 - p1) + p2 * (1 - p2) - 2 * correlation * Math.sqrt(p1 * (1 - p1) * p2 * (1 - p2));
      const nExact = (Math.pow(zAlpha + zBeta, 2) * varDiff) / Math.pow(p1 - p2, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        `• Correlation (ρ) = ${correlation}`,
        ``,
        `Step 1: Calculate variance of difference`,
        `Var(diff) = p1(1-p1) + p2(1-p2) - 2ρ√(p1(1-p1)×p2(1-p2))`,
        `Var(diff) = ${varDiff.toFixed(4)}`,
        ``,
        `Step 2: Apply related samples formula`,
        `n = (Z_{α/2} + Z_{β})² × Var(diff) / (p1-p2)²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size = ${n} pairs`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p2),
        interpretation: `For a two-tailed test comparing related proportions with α=${alpha}, power=${power}, and correlation=${correlation}, you need ${n} paired observations.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  // Calculate Difference in Proportions (Related) - One Tailed
  const calculateDiffPropRelOne = (alpha: number, power: number, p1: number, p2: number, correlation: number) => {
    try {
      const zAlpha = getZValueOneTailedAlpha(alpha);
      const zBeta = getZValueOneTailed(power);
      const varDiff = p1 * (1 - p1) + p2 * (1 - p2) - 2 * correlation * Math.sqrt(p1 * (1 - p1) * p2 * (1 - p2));
      const nExact = (Math.pow(zAlpha + zBeta, 2) * varDiff) / Math.pow(p1 - p2, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Proportion Group 1 (p1) = ${p1}`,
        `• Proportion Group 2 (p2) = ${p2}`,
        `• Correlation (ρ) = ${correlation}`,
        ``,
        `Step 1: Calculate variance of difference`,
        `Var(diff) = p1(1-p1) + p2(1-p2) - 2ρ√(p1(1-p1)×p2(1-p2))`,
        `Var(diff) = ${varDiff.toFixed(4)}`,
        ``,
        `Step 2: Apply related samples formula (one-tailed)`,
        `n = (Z_{α} + Z_{β})² × Var(diff) / (p1-p2)²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 3: Round up to nearest integer`,
        `Required sample size = ${n} pairs`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: Math.abs(p1 - p2),
        interpretation: `For a one-tailed test comparing related proportions with α=${alpha}, power=${power}, and correlation=${correlation}, you need ${n} paired observations.`,
        calculations: calculations
      });
    } catch {
      setResults({
        sampleSize: null,
        power: null,
        effectSize: null,
        interpretation: 'Error in calculation. Please check your inputs.',
        calculations: []
      });
    }
  };

  const tabs = [
    { id: 'single-mean-ci', name: 'Single Mean - CI (No Finite Correction)', icon: '📊' },
    { id: 'single-mean-ci-finite', name: 'Single Mean - CI (With Finite Correction)', icon: '📊' },
    { id: 'single-mean-two-tail', name: 'Single Mean - Two Tailed Test', icon: '📊' },
    { id: 'single-mean-one-tail', name: 'Single Mean - One Tailed Test', icon: '📊' },
    { id: 'single-mean-sign', name: 'Single Mean - Sign Test', icon: '📊' },
    { id: 'diff-means-ci', name: 'Diff Means (Indep) - CI (No Finite)', icon: '📈' },
    { id: 'diff-means-ci-finite', name: 'Diff Means (Indep) - CI (With Finite)', icon: '📈' },
    { id: 'diff-means-two-tail', name: 'Diff Means (Indep) - Two Tailed Test', icon: '📈' },
    { id: 'diff-means-one-tail', name: 'Diff Means (Indep) - One Tailed Test', icon: '📈' },
    { id: 'diff-means-equiv-a', name: 'Diff Means (Indep) - Equivalence Study A', icon: '📈' },
    { id: 'diff-means-equiv-b', name: 'Diff Means (Indep) - Equivalence Study B', icon: '📈' },
    { id: 'diff-means-non-inf', name: 'Diff Means (Indep) - Non-Inferiority', icon: '📈' },
    { id: 'diff-means-paired', name: 'Diff Means (Related) - Paired t-test', icon: '🔗' },
    { id: 'diff-means-crossover', name: 'Diff Means (Related) - Crossover Design', icon: '🔗' },
    { id: 'single-prop-ci', name: 'Single Proportion - CI (Absolute, No Finite)', icon: '📋' },
    { id: 'single-prop-ci-finite', name: 'Single Proportion - CI (Absolute, With Finite)', icon: '📋' },
    { id: 'single-prop-ci-rel', name: 'Single Proportion - CI (Relative, No Finite)', icon: '📋' },
    { id: 'single-prop-ci-rel-finite', name: 'Single Proportion - CI (Relative, With Finite)', icon: '📋' },
    { id: 'single-prop-two-tail', name: 'Single Proportion - Two Tailed Test', icon: '📋' },
    { id: 'single-prop-one-tail', name: 'Single Proportion - One Tailed Test', icon: '📋' },
    { id: 'diff-prop-ci', name: 'Diff Proportions (Indep) - CI', icon: '📉' },
    { id: 'diff-prop-two-tail', name: 'Diff Proportions (Indep) - Two Tailed Test', icon: '📉' },
    { id: 'diff-prop-one-tail', name: 'Diff Proportions (Indep) - One Tailed Test', icon: '📉' },
    { id: 'diff-prop-equiv-a', name: 'Diff Proportions (Indep) - Equivalence A', icon: '📉' },
    { id: 'diff-prop-equiv-b', name: 'Diff Proportions (Indep) - Equivalence B', icon: '📉' },
    { id: 'diff-prop-non-inf', name: 'Diff Proportions (Indep) - Non-Inferiority', icon: '📉' },
    { id: 'diff-prop-rel-two', name: 'Diff Proportions (Related) - Two Tailed', icon: '🔄' },
    { id: 'diff-prop-rel-one', name: 'Diff Proportions (Related) - One Tailed', icon: '🔄' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col lg:flex-row pt-20">
        {/* Left Side - Visual/Abstract */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-teal-100 via-cyan-50 to-slate-100 relative overflow-hidden py-16 lg:py-0">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract calculator elements */}
            <div className="relative w-full h-full">
              {/* Calculator grid */}
              <div className="absolute top-20 left-20 grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-teal-300 rounded opacity-60"></div>
                ))}
              </div>
              
              {/* Formula representations */}
              <div className="absolute top-40 right-20 w-32 h-20 border-2 border-cyan-400 rounded-xl opacity-50 rotate-12"></div>
              <div className="absolute bottom-40 left-32 w-20 h-20 bg-teal-200 rounded-full opacity-60"></div>
              <div className="absolute bottom-20 right-32 w-24 h-24 border-4 border-slate-300 rounded-lg opacity-40 -rotate-12"></div>
              
              {/* Statistical symbols */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-teal-400 opacity-30 font-light">
                n
              </div>
              <div className="absolute top-32 right-40 text-2xl text-cyan-500 opacity-50">α</div>
              <div className="absolute bottom-32 left-40 text-2xl text-teal-500 opacity-50">β</div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center py-16 lg:py-0">
          <div className="max-w-lg px-4 lg:px-12">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium tracking-wide">
                STATISTICAL TOOL
              </span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-light text-slate-800 mb-8 tracking-tight leading-tight">
              SAMPLE SIZE<br />
              CALCULATOR
            </h1>
            <p className="text-base lg:text-lg text-slate-600 mb-8 leading-relaxed font-light">
              Comprehensive statistical tool for calculating sample sizes across various study designs and statistical tests.
            </p>
            <div className="flex flex-col gap-4">
              <div className="px-4 py-3 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-700 font-medium">✓ Confidence Interval Estimation</p>
              </div>
              <div className="px-4 py-3 bg-cyan-50 rounded-lg">
                <p className="text-sm text-cyan-700 font-medium">✓ Hypothesis Testing</p>
              </div>
              <div className="px-4 py-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 font-medium">✓ Equivalence & Non-Inferiority Studies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Interface */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     {/* Tab Navigation */}
           <div className="mb-12">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
               {tabs.map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => handleTabChange(tab.id)}
                   className={`p-3 rounded-xl text-left transition-all duration-300 ${
                     activeTab === tab.id
                       ? 'bg-teal-600 text-white shadow-lg'
                       : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                   }`}
                 >
                   <div className="flex items-center gap-2">
                     <span className="text-lg">{tab.icon}</span>
                     <span className="font-medium text-xs">{tab.name}</span>
                   </div>
                 </button>
               ))}
             </div>
           </div>

                     {/* Calculator Content */}
           <div ref={calculatorRef} className="bg-slate-50 rounded-2xl p-6 lg:p-8">
             <div className="bg-white p-6 rounded-xl">
               <h2 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8">
                 {tabs.find(tab => tab.id === activeTab)?.name}
               </h2>
               
                               {/* Single Mean - CI (No Finite Correction) */}
                {activeTab === 'single-mean-ci' && (
                  <div className="max-w-lg mx-auto">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const confidenceLevel = Number(formData.get('confidenceLevel'));
                      const stdDev = Number(formData.get('stdDev'));
                      const marginError = Number(formData.get('marginError'));
                      calculateSingleMeanCI(confidenceLevel, stdDev, marginError);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                          <input 
                            type="number" 
                            name="confidenceLevel"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="95" 
                            min="1" 
                            max="99.99" 
                            step="0.01"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation (σ)</label>
                          <input 
                            type="number" 
                            name="stdDev"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter σ" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                          <input 
                            type="number" 
                            name="marginError"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter E" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                          Calculate Sample Size
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                               {/* Single Mean - CI (With Finite Correction) */}
                {activeTab === 'single-mean-ci-finite' && (
                  <div className="max-w-lg mx-auto">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const confidenceLevel = Number(formData.get('confidenceLevel'));
                      const stdDev = Number(formData.get('stdDev'));
                      const marginError = Number(formData.get('marginError'));
                      const populationSize = Number(formData.get('populationSize'));
                      calculateSingleMeanCIFinite(confidenceLevel, stdDev, marginError, populationSize);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                          <input 
                            type="number" 
                            name="confidenceLevel"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="95" 
                            min="1" 
                            max="99.99" 
                            step="0.01"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation (σ)</label>
                          <input 
                            type="number" 
                            name="stdDev"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter σ" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                          <input 
                            type="number" 
                            name="marginError"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter E" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Population Size (N)</label>
                          <input 
                            type="number" 
                            name="populationSize"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter N" 
                            min="1"
                            required 
                          />
                        </div>
                        <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                          Calculate Sample Size
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                               {/* Single Mean - Two Tailed Test */}
                {activeTab === 'single-mean-two-tail' && (
                  <div className="max-w-lg mx-auto">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const alpha = Number(formData.get('alpha'));
                      const power = Number(formData.get('power'));
                      const mu0 = Number(formData.get('mu0'));
                      const mua = Number(formData.get('mua'));
                      const stdDev = Number(formData.get('stdDev'));
                      calculateSingleMeanTwoTailed(alpha, power, mu0, mua, stdDev);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                          <input 
                            type="number" 
                            name="alpha"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="0.05" 
                            min="0.001" 
                            max="0.5" 
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                          <input 
                            type="number" 
                            name="power"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="0.80" 
                            min="0.5" 
                            max="0.999" 
                            step="0.01"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Mean under H₀ (μ₀)</label>
                          <input 
                            type="number" 
                            name="mu0"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter μ₀" 
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Mean under H₁ (μₐ)</label>
                          <input 
                            type="number" 
                            name="mua"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter μₐ" 
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation (σ)</label>
                          <input 
                            type="number" 
                            name="stdDev"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter σ" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                          Calculate Sample Size
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                               {/* Single Mean - One Tailed Test */}
                {activeTab === 'single-mean-one-tail' && (
                  <div className="max-w-lg mx-auto">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const alpha = Number(formData.get('alpha'));
                      const power = Number(formData.get('power'));
                      const effectSize = Number(formData.get('effectSize'));
                      const stdDev = Number(formData.get('stdDev'));
                      calculateSingleMeanOneTailed(alpha, power, effectSize, stdDev);
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                          <input 
                            type="number" 
                            name="alpha"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="0.05" 
                            min="0.001" 
                            max="0.5" 
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                          <input 
                            type="number" 
                            name="power"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="0.80" 
                            min="0.5" 
                            max="0.999" 
                            step="0.01"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (δ)</label>
                          <input 
                            type="number" 
                            name="effectSize"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter δ" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation (σ)</label>
                          <input 
                            type="number" 
                            name="stdDev"
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                            placeholder="Enter σ" 
                            min="0.001"
                            step="0.001"
                            required 
                          />
                        </div>
                        <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                          Calculate Sample Size
                        </button>
                      </div>
                    </form>
                  </div>
                )}

               {/* Single Mean - Sign Test */}
               {activeTab === 'single-mean-sign' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p1 = Number(formData.get('p1'));
                     calculateSingleMeanSign(alpha, power, p1);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input 
                           type="number" 
                           name="alpha"
                           className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                           placeholder="0.05" 
                           min="0.001" 
                           max="0.5" 
                           step="0.001"
                           required 
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input 
                           type="number" 
                           name="power"
                           className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                           placeholder="0.80" 
                           min="0.5" 
                           max="0.999" 
                           step="0.01"
                           required 
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Probability under H1 (p1)</label>
                         <input 
                           type="number" 
                           name="p1"
                           className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                           placeholder="Enter p1" 
                           min="0.001"
                           max="0.999"
                           step="0.001"
                           required 
                         />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - CI (No Finite) */}
               {activeTab === 'diff-means-ci' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     const marginError = Number(formData.get('marginError'));
                     calculateDiffMeansCI(confidenceLevel, stdDev1, stdDev2, marginError);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ1)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ2)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ2" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter E" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - CI (With Finite) */}
               {activeTab === 'diff-means-ci-finite' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     const marginError = Number(formData.get('marginError'));
                     const populationSize1 = Number(formData.get('populationSize1'));
                     const populationSize2 = Number(formData.get('populationSize2'));
                     calculateDiffMeansCIFinite(confidenceLevel, stdDev1, stdDev2, marginError, populationSize1, populationSize2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ1)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ2)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ2" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter E" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Population Size Group 1 (N1)</label>
                         <input type="number" name="populationSize1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter N1" min="1" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Population Size Group 2 (N2)</label>
                         <input type="number" name="populationSize2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter N2" min="1" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - Two Tailed Test */}
               {activeTab === 'diff-means-two-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     calculateDiffMeansTwoTailed(alpha, power, effectSize, stdDev1, stdDev2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (δ)</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter δ" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ1)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ2)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ2" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - One Tailed Test */}
               {activeTab === 'diff-means-one-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     calculateDiffMeansOneTailed(alpha, power, effectSize, stdDev1, stdDev2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (δ)</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter δ" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ1)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ2)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σ2" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Related) - Paired t-test */}
               {activeTab === 'diff-means-paired' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDevDiff = Number(formData.get('stdDevDiff'));
                     calculateDiffMeansPaired(alpha, power, effectSize, stdDevDiff);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (δ)</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter δ" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation of Differences (σd)</label>
                         <input type="number" name="stdDevDiff" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter σd" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Proportion - CI (Absolute, No Finite) */}
               {activeTab === 'single-prop-ci' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const expectedProportion = Number(formData.get('expectedProportion'));
                     const marginError = Number(formData.get('marginError'));
                     calculateSinglePropCI(confidenceLevel, expectedProportion, marginError);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Expected Proportion (p)</label>
                         <input type="number" name="expectedProportion" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Proportion - Two Tailed Test */}
               {activeTab === 'single-prop-two-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p0 = Number(formData.get('p0'));
                     const p1 = Number(formData.get('p1'));
                     calculateSinglePropTwoTailed(alpha, power, p0, p1);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion under H0 (p0)</label>
                         <input type="number" name="p0" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion under H1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.7" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Independent) - Two Tailed Test */}
               {activeTab === 'diff-prop-two-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     calculateDiffPropTwoTailed(alpha, power, p1, p2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.6" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 2 (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.4" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Mean - Two Tailed Test */}
               {activeTab === 'single-mean-two-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const mu0 = Number(formData.get('mu0'));
                     const mua = Number(formData.get('mua'));
                     const stdDev = Number(formData.get('stdDev'));
                     calculateSingleMeanTwoTailed(alpha, power, mu0, mua, stdDev);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Mean under H0 (μ₀)</label>
                         <input type="number" name="mu0" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Mean under H1 (μₐ)</label>
                         <input type="number" name="mua" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation (σ)</label>
                         <input type="number" name="stdDev" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Mean - One Tailed Test */}
               {activeTab === 'single-mean-one-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDev = Number(formData.get('stdDev'));
                     calculateSingleMeanOneTailed(alpha, power, effectSize, stdDev);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation (σ)</label>
                         <input type="number" name="stdDev" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Mean - Sign Test */}
               {activeTab === 'single-mean-sign' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p1 = Number(formData.get('p1'));
                     calculateSingleMeanSign(alpha, power, p1);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Probability of Success (p)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.7" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - CI (No Finite) */}
               {activeTab === 'diff-means-ci' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     const marginError = Number(formData.get('marginError'));
                     calculateDiffMeansCI(confidenceLevel, stdDev1, stdDev2, marginError);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - CI (With Finite) */}
               {activeTab === 'diff-means-ci-finite' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     const marginError = Number(formData.get('marginError'));
                     const populationSize1 = Number(formData.get('populationSize1'));
                     const populationSize2 = Number(formData.get('populationSize2'));
                     calculateDiffMeansCIFinite(confidenceLevel, stdDev1, stdDev2, marginError, populationSize1, populationSize2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Population Size Group 1 (N₁)</label>
                         <input type="number" name="populationSize1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1000" min="1" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Population Size Group 2 (N₂)</label>
                         <input type="number" name="populationSize2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1000" min="1" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - Two Tailed Test */}
               {activeTab === 'diff-means-two-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     calculateDiffMeansTwoTailed(alpha, power, effectSize, stdDev1, stdDev2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (|μ₁ - μ₂|)</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - One Tailed Test */}
               {activeTab === 'diff-means-one-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     calculateDiffMeansOneTailed(alpha, power, effectSize, stdDev1, stdDev2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (μ₁ - μ₂)</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - Equivalence Study A */}
               {activeTab === 'diff-means-equiv-a' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const equivalenceMargin = Number(formData.get('equivalenceMargin'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     calculateDiffMeansEquivA(alpha, power, equivalenceMargin, stdDev1, stdDev2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Equivalence Margin (δ)</label>
                         <input type="number" name="equivalenceMargin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - Equivalence Study B */}
               {activeTab === 'diff-means-equiv-b' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const equivalenceMargin = Number(formData.get('equivalenceMargin'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     const expectedDiff = Number(formData.get('expectedDiff'));
                     calculateDiffMeansEquivB(alpha, power, equivalenceMargin, stdDev1, stdDev2, expectedDiff);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Equivalence Margin (δ)</label>
                         <input type="number" name="equivalenceMargin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Expected Difference (μ₁ - μ₂)</label>
                         <input type="number" name="expectedDiff" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Independent) - Non-Inferiority */}
               {activeTab === 'diff-means-non-inf' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const nonInfMargin = Number(formData.get('nonInfMargin'));
                     const stdDev1 = Number(formData.get('stdDev1'));
                     const stdDev2 = Number(formData.get('stdDev2'));
                     calculateDiffMeansNonInf(alpha, power, nonInfMargin, stdDev1, stdDev2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Non-Inferiority Margin (Δ)</label>
                         <input type="number" name="nonInfMargin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                         <input type="number" name="stdDev1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                         <input type="number" name="stdDev2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Related) - Paired t-test */}
               {activeTab === 'diff-means-paired' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDevDiff = Number(formData.get('stdDevDiff'));
                     calculateDiffMeansPaired(alpha, power, effectSize, stdDevDiff);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Effect Size (μd)</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation of Differences (σd)</label>
                         <input type="number" name="stdDevDiff" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Means (Related) - Crossover Design */}
               {activeTab === 'diff-means-crossover' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const effectSize = Number(formData.get('effectSize'));
                     const stdDevWithin = Number(formData.get('stdDevWithin'));
                     const carryoverEffect = Number(formData.get('carryoverEffect'));
                     calculateDiffMeansCrossover(alpha, power, effectSize, stdDevWithin, carryoverEffect);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Treatment Effect Size</label>
                         <input type="number" name="effectSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Within-Subject Standard Deviation</label>
                         <input type="number" name="stdDevWithin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Carryover Effect</label>
                         <input type="number" name="carryoverEffect" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Proportion - CI (Absolute, With Finite) */}
               {activeTab === 'single-prop-ci-finite' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const expectedProportion = Number(formData.get('expectedProportion'));
                     const marginError = Number(formData.get('marginError'));
                     const populationSize = Number(formData.get('populationSize'));
                     calculateSinglePropCIFinite(confidenceLevel, expectedProportion, marginError, populationSize);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Expected Proportion (p)</label>
                         <input type="number" name="expectedProportion" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Population Size (N)</label>
                         <input type="number" name="populationSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1000" min="1" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Proportion - CI (Relative, No Finite) */}
               {activeTab === 'single-prop-ci-rel' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const expectedProportion = Number(formData.get('expectedProportion'));
                     const relativeMarginError = Number(formData.get('relativeMarginError'));
                     calculateSinglePropCIRel(confidenceLevel, expectedProportion, relativeMarginError);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Expected Proportion (p)</label>
                         <input type="number" name="expectedProportion" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Relative Margin of Error (%)</label>
                         <input type="number" name="relativeMarginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="10" min="0.1" max="50" step="0.1" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Proportion - CI (Relative, With Finite) */}
               {activeTab === 'single-prop-ci-rel-finite' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const expectedProportion = Number(formData.get('expectedProportion'));
                     const relativeMarginError = Number(formData.get('relativeMarginError'));
                     const populationSize = Number(formData.get('populationSize'));
                     calculateSinglePropCIRelFinite(confidenceLevel, expectedProportion, relativeMarginError, populationSize);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Expected Proportion (p)</label>
                         <input type="number" name="expectedProportion" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Relative Margin of Error (%)</label>
                         <input type="number" name="relativeMarginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="10" min="0.1" max="50" step="0.1" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Population Size (N)</label>
                         <input type="number" name="populationSize" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="1000" min="1" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Single Proportion - One Tailed Test */}
               {activeTab === 'single-prop-one-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p0 = Number(formData.get('p0'));
                     const p1 = Number(formData.get('p1'));
                     calculateSinglePropOneTailed(alpha, power, p0, p1);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion under H0 (p0)</label>
                         <input type="number" name="p0" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion under H1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.7" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Independent) - CI */}
               {activeTab === 'diff-prop-ci' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const confidenceLevel = Number(formData.get('confidenceLevel'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     const marginError = Number(formData.get('marginError'));
                     calculateDiffPropCI(confidenceLevel, p1, p2, marginError);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Confidence Level (%)</label>
                         <input type="number" name="confidenceLevel" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="95" min="1" max="99.99" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.6" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 2 (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.4" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Margin of Error (E)</label>
                         <input type="number" name="marginError" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.1" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Independent) - One Tailed Test */}
               {activeTab === 'diff-prop-one-tail' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     calculateDiffPropOneTailed(alpha, power, p1, p2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.6" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 2 (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.4" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Independent) - Equivalence A */}
               {activeTab === 'diff-prop-equiv-a' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const equivalenceMargin = Number(formData.get('equivalenceMargin'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     calculateDiffPropEquivA(alpha, power, equivalenceMargin, p1, p2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Equivalence Margin (δ)</label>
                         <input type="number" name="equivalenceMargin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 2 (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Independent) - Equivalence B */}
               {activeTab === 'diff-prop-equiv-b' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const equivalenceMargin = Number(formData.get('equivalenceMargin'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     const expectedDiff = Number(formData.get('expectedDiff'));
                     calculateDiffPropEquivB(alpha, power, equivalenceMargin, p1, p2, expectedDiff);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Equivalence Margin (δ)</label>
                         <input type="number" name="equivalenceMargin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Expected Difference (p1 - p2)</label>
                         <input type="number" name="expectedDiff" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 2 (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Independent) - Non-Inferiority */}
               {activeTab === 'diff-prop-non-inf' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const nonInfMargin = Number(formData.get('nonInfMargin'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     calculateDiffPropNonInf(alpha, power, nonInfMargin, p1, p2);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Non-Inferiority Margin (Δ)</label>
                         <input type="number" name="nonInfMargin" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.1" min="0.001" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 1 (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.6" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Group 2 (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.7" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Related) - Two Tailed */}
               {activeTab === 'diff-prop-rel-two' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     const correlation = Number(formData.get('correlation'));
                     calculateDiffPropRelTwo(alpha, power, p1, p2, correlation);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Before (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.4" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion After (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.6" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Correlation (ρ)</label>
                         <input type="number" name="correlation" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="-1" max="1" step="0.01" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* Difference in Proportions (Related) - One Tailed */}
               {activeTab === 'diff-prop-rel-one' && (
                 <div className="max-w-lg mx-auto">
                   <form onSubmit={(e) => {
                     e.preventDefault();
                     const formData = new FormData(e.currentTarget);
                     const alpha = Number(formData.get('alpha'));
                     const power = Number(formData.get('power'));
                     const p1 = Number(formData.get('p1'));
                     const p2 = Number(formData.get('p2'));
                     const correlation = Number(formData.get('correlation'));
                     calculateDiffPropRelOne(alpha, power, p1, p2, correlation);
                   }}>
                     <div className="space-y-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                         <input type="number" name="alpha" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" min="0.001" max="0.5" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                         <input type="number" name="power" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" min="0.5" max="0.999" step="0.01" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion Before (p1)</label>
                         <input type="number" name="p1" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.4" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Proportion After (p2)</label>
                         <input type="number" name="p2" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.6" min="0.001" max="0.999" step="0.001" required />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Correlation (ρ)</label>
                         <input type="number" name="correlation" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.5" min="-1" max="1" step="0.01" required />
                       </div>
                       <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                         Calculate Sample Size
                       </button>
                     </div>
                   </form>
                 </div>
               )}

               {/* For any remaining tabs not yet implemented */}
               {![
                 'single-mean-ci', 'single-mean-ci-finite', 'single-mean-two-tail', 'single-mean-one-tail', 'single-mean-sign',
                 'diff-means-ci', 'diff-means-ci-finite', 'diff-means-two-tail', 'diff-means-one-tail', 'diff-means-equiv-a', 'diff-means-equiv-b', 'diff-means-non-inf', 'diff-means-paired', 'diff-means-crossover',
                 'single-prop-ci', 'single-prop-ci-finite', 'single-prop-ci-rel', 'single-prop-ci-rel-finite', 'single-prop-two-tail', 'single-prop-one-tail',
                 'diff-prop-ci', 'diff-prop-two-tail', 'diff-prop-one-tail', 'diff-prop-equiv-a', 'diff-prop-equiv-b', 'diff-prop-non-inf', 'diff-prop-rel-two', 'diff-prop-rel-one'
               ].includes(activeTab) && (
                 <div className="text-center py-8">
                   <p className="text-slate-600">Calculator interface for this section will be implemented here.</p>
                   <p className="text-sm text-slate-500 mt-2">Complete implementation coming soon.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8 text-center">Calculation Results</h2>
            
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-teal-50 p-6 rounded-xl text-center">
                 <div className="text-3xl font-light text-teal-600 mb-2">
                   {results.sampleSize || '--'}
                 </div>
                 <div className="text-sm text-teal-700 font-medium">Required Sample Size</div>
               </div>
               <div className="bg-cyan-50 p-6 rounded-xl text-center">
                 <div className="text-3xl font-light text-cyan-600 mb-2">
                   {results.power ? (results.power * 100).toFixed(1) + '%' : '--'}
                 </div>
                 <div className="text-sm text-cyan-700 font-medium">Power Achieved</div>
               </div>
               <div className="bg-slate-50 p-6 rounded-xl text-center">
                 <div className="text-3xl font-light text-slate-600 mb-2">
                   {results.effectSize ? results.effectSize.toFixed(3) : '--'}
                 </div>
                 <div className="text-sm text-slate-700 font-medium">Standardized Effect Size</div>
               </div>
             </div>

             <div className="mt-8 p-4 bg-slate-50 rounded-lg">
               <h3 className="text-lg font-medium text-slate-800 mb-2">Interpretation</h3>
               <p className="text-slate-600 text-sm">
                 {results.interpretation || 'Results and interpretation will appear here after calculation.'}
               </p>
             </div>

             {results.calculations.length > 0 && (
               <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                 <h3 className="text-lg font-medium text-slate-800 mb-4">Step-by-Step Calculations</h3>
                 <div className="bg-white p-4 rounded-lg font-mono text-sm">
                   {results.calculations.map((line, index) => (
                     <div key={index} className={`${line === '' ? 'h-2' : ''} ${line.startsWith('•') ? 'text-slate-600 ml-2' : ''} ${line.startsWith('Step') || line === 'Given:' ? 'font-semibold text-slate-800 mt-2' : 'text-slate-700'}`}>
                       {line === '' ? '' : line}
                     </div>
                   ))}
                 </div>
                 <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                   <p className="text-xs text-teal-700">
                     <strong>Note:</strong> These calculations show the mathematical steps used to determine the sample size. 
                     Z-values are calculated using the inverse normal distribution function.
                   </p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-light text-slate-800 mb-6 tracking-tight">
            Need Expert Guidance?
          </h2>
          <p className="text-base lg:text-lg text-slate-600 mb-8 font-light">
            For complex study designs or customized sample size calculations, consult with Dr. Basannar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all duration-300">
              Schedule Consultation
            </button>
            <button className="px-8 py-3 text-slate-600 rounded-lg font-medium hover:text-slate-800 transition-all duration-300">
              View All Services
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}