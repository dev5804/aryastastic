// Statistical utility functions for sample size calculations

export const getZValue = (confidenceLevel: number): number => {
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

export const getZValueOneTailed = (power: number): number => {
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
export const getZValueOneTailedAlpha = (alpha: number): number => {
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

// Common result type for all calculators
export interface CalculatorResult {
  sampleSize: number | null;
  power: number | null;
  effectSize: number | null;
  interpretation: string;
  calculations: string[];
} 