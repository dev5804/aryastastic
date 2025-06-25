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
      99: 2.58,   // ✅ Fixed: 99% confidence → Z = 2.58
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

  const calculateSingleMeanTwoTailed = (alpha: number, power: number, effectSize: number, stdDev: number) => {
    try {
      const zAlpha = getZValue((1 - alpha) * 100);  // ✅ For α=0.01 → 99% → Z=2.58
      const zBeta = getZValueOneTailed(power);       // ✅ For power=0.99 → β=0.01 → Z=2.33
      const delta = effectSize / stdDev;             // ✅ Standardized effect size
      const numerator = zAlpha + zBeta;
      const nExact = Math.pow(numerator / delta, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Effect Size (δ) = ${effectSize}`,
        `• Standard Deviation (σ) = ${stdDev}`,
        ``,
        `Step 1: Find Z-value for α (two-tailed)`,
        `Z_{α/2} = Z_{${(alpha/2).toFixed(4)}} = ${zAlpha.toFixed(4)}`,
        ``,
        `Step 2: Find Z-value for power`,
        `Z_{β} = Z_{${(1-power).toFixed(4)}} = ${zBeta.toFixed(4)}`,
        ``,
        `Step 3: Calculate standardized effect size`,
        `Δ = δ / σ = ${effectSize} / ${stdDev} = ${delta.toFixed(4)}`,
        ``,
        `Step 4: Apply the formula`,
        `n = ((Z_{α/2} + Z_{β}) / Δ)²`,
        `n = ((${zAlpha.toFixed(4)} + ${zBeta.toFixed(4)}) / ${delta.toFixed(4)})²`,
        `n = (${numerator.toFixed(4)} / ${delta.toFixed(4)})²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 5: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: delta,
        interpretation: `For a two-tailed test with α=${alpha}, power=${power}, effect size=${effectSize}, and standard deviation=${stdDev}, you need a sample size of ${n} per group.`,
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
      const zAlpha = getZValueOneTailed(alpha);
      const zBeta = getZValueOneTailed(power);
      const delta = effectSize / stdDev; // Standardized effect size
      const numerator = zAlpha + zBeta;
      const nExact = Math.pow(numerator / delta, 2);
      const n = Math.ceil(nExact);
      
      const calculations = [
        `Given:`,
        `• Significance Level (α) = ${alpha}`,
        `• Power (1-β) = ${power}`,
        `• Effect Size (δ) = ${effectSize}`,
        `• Standard Deviation (σ) = ${stdDev}`,
        ``,
        `Step 1: Find Z-value for α (one-tailed)`,
        `Z_{α} = Z_{${alpha.toFixed(4)}} = ${zAlpha.toFixed(4)}`,
        ``,
        `Step 2: Find Z-value for power`,
        `Z_{β} = Z_{${(1-power).toFixed(4)}} = ${zBeta.toFixed(4)}`,
        ``,
        `Step 3: Calculate standardized effect size`,
        `Δ = δ / σ = ${effectSize} / ${stdDev} = ${delta.toFixed(4)}`,
        ``,
        `Step 4: Apply the formula`,
        `n = ((Z_{α} + Z_{β}) / Δ)²`,
        `n = ((${zAlpha.toFixed(4)} + ${zBeta.toFixed(4)}) / ${delta.toFixed(4)})²`,
        `n = (${numerator.toFixed(4)} / ${delta.toFixed(4)})²`,
        `n = ${nExact.toFixed(4)}`,
        ``,
        `Step 5: Round up to nearest integer`,
        `Required sample size per group = ${n}`
      ];
      
      setResults({
        sampleSize: n,
        power: power,
        effectSize: delta,
        interpretation: `For a one-tailed test with α=${alpha}, power=${power}, effect size=${effectSize}, and standard deviation=${stdDev}, you need a sample size of ${n} per group.`,
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
                      const effectSize = Number(formData.get('effectSize'));
                      const stdDev = Number(formData.get('stdDev'));
                      calculateSingleMeanTwoTailed(alpha, power, effectSize, stdDev);
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
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Significance Level (α)</label>
                       <input type="number" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.05" step="0.01" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                       <input type="number" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="0.80" step="0.01" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-slate-700 mb-2">Probability under H1 (p1)</label>
                       <input type="number" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" placeholder="Enter p1" step="0.01" />
                     </div>
                     <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                       Calculate Sample Size
                     </button>
                   </div>
                 </div>
               )}

               {/* For all other tabs - placeholder */}
               {!['single-mean-ci', 'single-mean-ci-finite', 'single-mean-two-tail', 'single-mean-one-tail', 'single-mean-sign'].includes(activeTab) && (
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