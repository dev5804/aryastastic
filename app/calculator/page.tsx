'use client';

import { useState, useRef } from 'react';
import { 
  calculateDiffMeansCI,
  calculateDiffMeansCIFinite,
  calculateDiffMeansTwoTailed,
  calculateDiffMeansOneTailed,
  calculateDiffMeansEquivA,
  calculateDiffMeansEquivB,
  calculateDiffMeansNonInf,
  calculateDiffMeansPaired,
  calculateDiffMeansCrossover
} from '../lib/calculators/differenceMeans';
import {
  calculateSinglePropCI,
  calculateSinglePropCIFinite,
  calculateSinglePropCIRelative,
  calculateSinglePropCIRelativeFinite,
  calculateSinglePropTestTwoTailed,
  calculateSinglePropTestOneTailed
} from '../lib/calculators/singleProportion';
import {
  calculateDiffPropCI,
  calculateDiffPropTwoTailed,
  calculateDiffPropOneTailed,
  calculateDiffPropEquivA,
  calculateDiffPropEquivB,
  calculateDiffPropNonInf,
  calculateDiffPropRelTwo,
  calculateDiffPropRelOne
} from '../lib/calculators/differenceProportions';
import {
  calculateSingleMeanCI,
  calculateSingleMeanCIFinite,
  calculateSingleMeanTestTwoTailed,
  calculateSingleMeanTestOneTailed,
  calculateMedianSignTest
} from '../lib/calculators/singleMean';

export default function CalculatorPage() {
  const [activeGroup] = useState('single-mean');
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



  // Calculator functions
  const handleSingleMeanCI = (confidenceLevel: number, stdDev: number, marginError: number) => {
    const result = calculateSingleMeanCI(confidenceLevel, stdDev, marginError);
    setResults(result);
  };

  const handleSingleMeanCIFinite = (confidenceLevel: number, stdDev: number, marginError: number, populationSize: number) => {
    const result = calculateSingleMeanCIFinite(populationSize, confidenceLevel, stdDev, marginError);
    setResults(result);
  };

  const handleSingleMeanTwoTailed = (alpha: number, power: number, mu0: number, mua: number, stdDev: number) => {
    const result = calculateSingleMeanTestTwoTailed(alpha, power, mu0, mua, stdDev);
    setResults(result);
  };

  const handleSingleMeanOneTailed = (alpha: number, power: number, mu0: number, mua: number, stdDev: number) => {
    const result = calculateSingleMeanTestOneTailed(alpha, power, mu0, mua, stdDev);
    setResults(result);
  };

  const handleSingleMeanSign = (alpha: number, power: number, hypothesizedMedian: number, proportionGreaterThanMedian: number) => {
    const result = calculateMedianSignTest(alpha, power, hypothesizedMedian, proportionGreaterThanMedian);
    setResults(result);
  };

  // Calculator groups structure
  const calculatorGroups = [
    {
      id: 'single-mean',
      name: 'Sample Size for Single Mean',
      icon: '📊',
      tabs: [
        { id: 'single-mean-ci', name: 'To estimate CI for mean - With absolute Error of Margin and no finite correction', icon: '📊' },
        { id: 'single-mean-ci-finite', name: 'To estimate CI for mean - With absolute Error of Margin and finite correction', icon: '📊' },
        { id: 'single-mean-two-tail', name: 'To hypothesis test about mean - Two tailed test', icon: '📊' },
        { id: 'single-mean-one-tail', name: 'To hypothesis test about mean - One tailed test', icon: '📊' },
        { id: 'single-mean-sign', name: 'To hypothesis test about Median-Sign Test', icon: '📊' }
      ]
    },
    {
      id: 'diff-means-independent',
      name: 'Sample Size for difference between means: Independent samples',
      icon: '📈',
      tabs: [
        { id: 'diff-means-ci', name: 'To estimate CI for difference between means - With absolute Error of Margin and no finite correction', icon: '📈' },
        { id: 'diff-means-ci-finite', name: 'To estimate CI for difference between means - With absolute Error of Margin and finite correction', icon: '📈' },
        { id: 'diff-means-two-tail', name: 'To hypothesis test about difference between means - Two tailed test', icon: '📈' },
        { id: 'diff-means-one-tail', name: 'To hypothesis test about difference between means - One tailed test', icon: '📈' },
        { id: 'diff-means-equiv-a', name: 'Equivalence Trial - Equivalence study (a)', icon: '📈' },
        { id: 'diff-means-equiv-b', name: 'Equivalence Trial - Equivalence study (b)', icon: '📈' },
        { id: 'diff-means-non-inf', name: 'Non-Inferiority Trial', icon: '📈' }
      ]
    },
    {
      id: 'diff-means-related',
      name: 'Sample Size for hypothesis test about difference between means: Related samples',
      icon: '🔗',
      tabs: [
        { id: 'diff-means-paired', name: 'Paired ‘t’ test', icon: '🔗' },
        { id: 'diff-means-crossover', name: 'Crossover Design', icon: '🔗' }
      ]
    },
    {
      id: 'single-proportion',
      name: 'Sample Size for Single Proportion',
      icon: '📋',
      tabs: [
        { id: 'single-prop-ci', name: 'To estimate CI for Proportion - With absolute Error of Margin and no finite correction', icon: '📋' },
        { id: 'single-prop-ci-finite', name: 'To estimate CI for Proportion - With absolute Error of Margin and finite correction', icon: '📋' },
        { id: 'single-prop-ci-rel', name: 'To estimate CI for Proportion - With relative Error of Margin and no finite correction', icon: '📋' },
        { id: 'single-prop-ci-rel-finite', name: 'To estimate CI for Proportion - With relative Error of Margin and finite correction', icon: '📋' },
        { id: 'single-prop-two-tail', name: 'To hypothesis test about Proportion - Two tailed test', icon: '📋' },
        { id: 'single-prop-one-tail', name: 'To hypothesis test about Proportion - One tailed test', icon: '📋' }
      ]
    },
    {
      id: 'diff-proportions-independent',
      name: 'Sample Size for difference between proportions: Independent samples',
      icon: '📉',
      tabs: [
        { id: 'diff-prop-ci', name: 'To estimate CI for difference between proportions', icon: '📉' },
        { id: 'diff-prop-two-tail', name: 'To hypothesis test about difference between proportions - Two tailed test', icon: '📉' },
        { id: 'diff-prop-one-tail', name: 'To hypothesis test about difference between proportions - One tailed test', icon: '📉' },
        { id: 'diff-prop-equiv-a', name: 'Equivalence Trial - Equivalence study (a)', icon: '📉' },
        { id: 'diff-prop-equiv-b', name: 'Equivalence Trial - Equivalence study (b)', icon: '📉' },
        { id: 'diff-prop-non-inf', name: 'Non-Inferiority Trial', icon: '📉' }
      ]
    },
    {
      id: 'diff-proportions-related',
      name: 'Sample Size for hypothesis test about difference between proportion: Related samples',
      icon: '🔄',
      tabs: [
        { id: 'diff-prop-rel-two', name: 'Two tailed test', icon: '🔄' },
        { id: 'diff-prop-rel-one', name: 'One tailed test', icon: '🔄' }
      ]
    }
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
          {/* All Categories Expanded */}
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-light text-slate-800 mb-6 text-center">
              Select Calculator Category
            </h2>
            
            {/* All Categories Expanded by Default */}
            <div className="space-y-6 max-w-6xl mx-auto">
              {calculatorGroups.map((group) => (
                <div key={group.id} className="border border-slate-200 rounded-xl overflow-hidden ">
                  {/* Category Header - Non-clickable, just for display */}
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{group.icon}</span>
                      <div>
                        <div className="font-medium text-slate-700">{group.name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {group.tabs.length} calculator{group.tabs.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Always Visible Calculators */}
                  <div className="bg-white">
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`p-3 rounded-lg text-left transition-all duration-300   cursor-pointer ${
                              activeTab === tab.id
                                ? 'bg-teal-100 text-teal-700 border-2 border-teal-300'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{tab.icon}</span>
                              <span className="font-medium text-xs leading-tight">{tab.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Content */}
          <div ref={calculatorRef} className="bg-slate-50 rounded-2xl p-6 lg:p-8">
            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-2xl lg:text-3xl font-light text-slate-800 mb-8">
                {calculatorGroups.find(g => g.id === activeGroup)?.tabs.find(t => t.id === activeTab)?.name}
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
                    handleSingleMeanCI(confidenceLevel, stdDev, marginError);
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
                    handleSingleMeanCIFinite(confidenceLevel, stdDev, marginError, populationSize);
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
                    handleSingleMeanTwoTailed(alpha, power, mu0, mua, stdDev);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population mean under H₀ (μ₀)</label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population mean under H₁ (μ₁)</label>
                        <input 
                          type="number" 
                          name="mua"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter μ₁" 
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
                    const mu0 = Number(formData.get('mu0'));
                    const mua = Number(formData.get('mua'));
                    const stdDev = Number(formData.get('stdDev'));
                    handleSingleMeanOneTailed(alpha, power, mu0, mua, stdDev);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population mean under H₀ (μ₀)</label>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population mean under H₁ (μ₁)</label>
                        <input 
                          type="number" 
                          name="mua"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter μ₁" 
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

              {/* Single Mean - Median Sign Test */}
              {activeTab === 'single-mean-sign' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const hypothesizedMedian = Number(formData.get('hypothesizedMedian'));
                    const proportionGreaterThanMedian = Number(formData.get('proportionGreaterThanMedian'));
                    handleSingleMeanSign(alpha, power, hypothesizedMedian, proportionGreaterThanMedian);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power (1-β)</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population median under H₀</label>
                        <input 
                          type="number" 
                          name="hypothesizedMedian"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter hypothesized median" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Proportion of observations greater than hypothesized median under H₁</label>
                        <input 
                          type="number" 
                          name="proportionGreaterThanMedian"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter proportion (0-1)" 
                          min="0"
                          max="0.999"
                          step="0.001"
                          required 
                        />
                        <p className="text-xs text-slate-500 mt-1">Must be less than 1</p>
                      </div>
                      <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                        Calculate Sample Size
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Difference Means - CI (No Finite Correction) */}
              {activeTab === 'diff-means-ci' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const stdDev1 = Number(formData.get('stdDev1'));
                    const stdDev2 = Number(formData.get('stdDev2'));
                    const marginError = Number(formData.get('marginError'));
                    const result = calculateDiffMeansCI(confidenceLevel, stdDev1, stdDev2, marginError);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence (%)</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD (Population 1)</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD (Population 2)</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Error of Margin</label>
                        <input 
                          type="number" 
                          name="marginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter margin of error" 
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

              {/* Difference Means - CI (With Finite Correction) */}
              {activeTab === 'diff-means-ci-finite' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const populationSize1 = Number(formData.get('populationSize1'));
                    const populationSize2 = Number(formData.get('populationSize2'));
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const stdDev1 = Number(formData.get('stdDev1'));
                    const stdDev2 = Number(formData.get('stdDev2'));
                    const marginError = Number(formData.get('marginError'));
                    const result = calculateDiffMeansCIFinite(confidenceLevel, stdDev1, stdDev2, marginError, populationSize1, populationSize2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population Size - 1</label>
                        <input 
                          type="number" 
                          name="populationSize1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter N₁" 
                          min="1"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population Size - 2</label>
                        <input 
                          type="number" 
                          name="populationSize2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter N₂" 
                          min="1"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence (%)</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD (Population 1)</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD (Population 2)</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Error of Margin</label>
                        <input 
                          type="number" 
                          name="marginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter margin of error" 
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

              {/* Difference Means - Two Tailed Test */}
              {activeTab === 'diff-means-two-tail' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const populationMean1 = Number(formData.get('populationMean1'));
                    const populationMean2 = Number(formData.get('populationMean2'));
                    const stdDev1 = Number(formData.get('stdDev1'));
                    const stdDev2 = Number(formData.get('stdDev2'));
                    const result = calculateDiffMeansTwoTailed(alpha, power, populationMean1, populationMean2, stdDev1, stdDev2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population Mean 1</label>
                        <input 
                          type="number" 
                          name="populationMean1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter μ₁" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population Mean 2</label>
                        <input 
                          type="number" 
                          name="populationMean2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter μ₂" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population SD 1</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population SD 2</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
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

              {/* Difference Means - Paired 't' test */}
              {activeTab === 'diff-means-paired' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const meanBefore = Number(formData.get('meanBefore'));
                    const meanAfter = Number(formData.get('meanAfter'));
                    const stdDevBefore = Number(formData.get('stdDevBefore'));
                    const stdDevAfter = Number(formData.get('stdDevAfter'));
                    const result = calculateDiffMeansPaired(alpha, power, meanBefore, meanAfter, stdDevBefore, stdDevAfter);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mean of variable of interest before intervention</label>
                        <input 
                          type="number" 
                          name="meanBefore"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter mean before" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mean of variable of interest after intervention</label>
                        <input 
                          type="number" 
                          name="meanAfter"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter mean after" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD of variable of interest before intervention</label>
                        <input 
                          type="number" 
                          name="stdDevBefore"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter SD before" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD of variable of interest after intervention</label>
                        <input 
                          type="number" 
                          name="stdDevAfter"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter SD after" 
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

              {/* Difference Means - Crossover Design */}
              {activeTab === 'diff-means-crossover' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const stdDevDiff = Number(formData.get('stdDevDiff'));
                    const treatmentEffect = Number(formData.get('treatmentEffect'));
                    const result = calculateDiffMeansCrossover(alpha, power, stdDevDiff, treatmentEffect);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">SD of difference between treatment scores</label>
                        <input 
                          type="number" 
                          name="stdDevDiff"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter SD of differences" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Treatment effect (Δ)</label>
                        <input 
                          type="number" 
                          name="treatmentEffect"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter treatment effect" 
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

              {/* Single Proportion - CI (Absolute Margin, No Finite Correction) */}
              {activeTab === 'single-prop-ci' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const anticipatedProportion = Number(formData.get('anticipatedProportion'));
                    const absoluteMarginError = Number(formData.get('absoluteMarginError'));
                    const result = calculateSinglePropCI(confidenceLevel, anticipatedProportion, absoluteMarginError);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence (%)</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anticipated value of population proportion</label>
                        <input 
                          type="number" 
                          name="anticipatedProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter proportion (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Absolute Error of Margin (δ)</label>
                        <input 
                          type="number" 
                          name="absoluteMarginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter absolute margin" 
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

              {/* Single Proportion - CI (Absolute Margin, Finite Correction) */}
              {activeTab === 'single-prop-ci-finite' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const populationSize = Number(formData.get('populationSize'));
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const anticipatedProportion = Number(formData.get('anticipatedProportion'));
                    const absoluteMarginError = Number(formData.get('absoluteMarginError'));
                    const result = calculateSinglePropCIFinite(populationSize, confidenceLevel, anticipatedProportion, absoluteMarginError);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
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
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence (%)</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anticipated value of population proportion</label>
                        <input 
                          type="number" 
                          name="anticipatedProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter proportion (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Absolute Error of Margin (δ)</label>
                        <input 
                          type="number" 
                          name="absoluteMarginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter absolute margin" 
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

              {/* Single Proportion - CI (Relative Margin, No Finite Correction) */}
              {activeTab === 'single-prop-ci-rel' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const anticipatedProportion = Number(formData.get('anticipatedProportion'));
                    const relativeMarginError = Number(formData.get('relativeMarginError'));
                    const result = calculateSinglePropCIRelative(confidenceLevel, anticipatedProportion, relativeMarginError);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence (%)</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anticipated value of population proportion</label>
                        <input 
                          type="number" 
                          name="anticipatedProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter proportion (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Relative Error of Margin (ε)</label>
                        <input 
                          type="number" 
                          name="relativeMarginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter relative margin (0-1)" 
                          min="0.001"
                          max="0.999"
                          step="0.001"
                          required 
                        />
                        <p className="text-xs text-slate-500 mt-1">e.g., 0.1 for 10% relative margin</p>
                      </div>
                      <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                        Calculate Sample Size
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Single Proportion - CI (Relative Margin, Finite Correction) */}
              {activeTab === 'single-prop-ci-rel-finite' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const populationSize = Number(formData.get('populationSize'));
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const anticipatedProportion = Number(formData.get('anticipatedProportion'));
                    const relativeMarginError = Number(formData.get('relativeMarginError'));
                    const result = calculateSinglePropCIRelativeFinite(populationSize, confidenceLevel, anticipatedProportion, relativeMarginError);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
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
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence (%)</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anticipated value of population proportion</label>
                        <input 
                          type="number" 
                          name="anticipatedProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter proportion (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Relative Error of Margin (ε)</label>
                        <input 
                          type="number" 
                          name="relativeMarginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter relative margin (0-1)" 
                          min="0.001"
                          max="0.999"
                          step="0.001"
                          required 
                        />
                        <p className="text-xs text-slate-500 mt-1">e.g., 0.1 for 10% relative margin</p>
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
                    const nullProportion = Number(formData.get('nullProportion'));
                    const alternativeProportion = Number(formData.get('alternativeProportion'));
                    const result = calculateSinglePropTestTwoTailed(alpha, power, nullProportion, alternativeProportion);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population proportion under null hypothesis</label>
                        <input 
                          type="number" 
                          name="nullProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter null proportion" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population proportion under alternative hypothesis</label>
                        <input 
                          type="number" 
                          name="alternativeProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter alternative proportion" 
                          min="0"
                          max="1"
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

              {/* Single Proportion - One Tailed Test */}
              {activeTab === 'single-prop-one-tail' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const nullProportion = Number(formData.get('nullProportion'));
                    const alternativeProportion = Number(formData.get('alternativeProportion'));
                    const result = calculateSinglePropTestOneTailed(alpha, power, nullProportion, alternativeProportion);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population proportion under null hypothesis</label>
                        <input 
                          type="number" 
                          name="nullProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter null proportion" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Value of population proportion under alternative hypothesis</label>
                        <input 
                          type="number" 
                          name="alternativeProportion"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter alternative proportion" 
                          min="0"
                          max="1"
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

              {/* Difference Proportions - CI */}
              {activeTab === 'diff-prop-ci' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const confidenceLevel = Number(formData.get('confidenceLevel'));
                    const p1 = Number(formData.get('p1'));
                    const p2 = Number(formData.get('p2'));
                    const marginError = Number(formData.get('marginError'));
                    const result = calculateDiffPropCI(confidenceLevel, p1, p2, marginError);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Confidence</label>
                        <select 
                          name="confidenceLevel"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Confidence Level</option>
                          <option value="90">90%</option>
                          <option value="95">95%</option>
                          <option value="99">99%</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anticipated value of population proportion1</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Anticipated value of population proportion2</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₂ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Absolute Error of Margin (δ)</label>
                        <input 
                          type="number" 
                          name="marginError"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter margin of error" 
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

              {/* Difference Proportions - Two Tailed Test */}
              {activeTab === 'diff-prop-two-tail' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const p1 = Number(formData.get('p1'));
                    const p2 = Number(formData.get('p2'));
                    const result = calculateDiffPropTwoTailed(alpha, power, p1, p2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion1</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion2</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₂ (0-1)" 
                          min="0"
                          max="1"
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

              {/* Difference Proportions - One Tailed Test */}
              {activeTab === 'diff-prop-one-tail' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const p1 = Number(formData.get('p1'));
                    const p2 = Number(formData.get('p2'));
                    const result = calculateDiffPropOneTailed(alpha, power, p1, p2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion1</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion2</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₂ (0-1)" 
                          min="0"
                          max="1"
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

              {/* Difference Proportions - Equivalence Study (a) */}
              {activeTab === 'diff-prop-equiv-a' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const p1 = Number(formData.get('p1'));
                    const p2 = Number(formData.get('p2'));
                    const equivalenceMargin = Number(formData.get('equivalenceMargin'));
                    const result = calculateDiffPropEquivA(alpha, power, equivalenceMargin, p1, p2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Experimental treatment Group(π₁)</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter π₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Treatment Group(π₂)</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter π₂ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Acceptable threshold for equivalence (∆E)</label>
                        <input 
                          type="number" 
                          name="equivalenceMargin"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter ∆E" 
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

              {/* Difference Proportions - Equivalence Study (b) */}
              {activeTab === 'diff-prop-equiv-b' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const p1 = Number(formData.get('p1'));
                    const p2 = Number(formData.get('p2'));
                    const equivalenceMargin = Number(formData.get('equivalenceMargin'));
                    const expectedDiff = Number(formData.get('expectedDiff'));
                    const result = calculateDiffPropEquivB(alpha, power, equivalenceMargin, p1, p2, expectedDiff);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Experimental treatment Group(π₁)</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter π₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Treatment Group(π₂)</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter π₂ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Acceptable threshold for equivalence (∆E)</label>
                        <input 
                          type="number" 
                          name="equivalenceMargin"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter ∆E" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expected difference between proportions</label>
                        <input 
                          type="number" 
                          name="expectedDiff"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter expected difference" 
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

              {/* Difference Proportions - Non-Inferiority Trial */}
              {activeTab === 'diff-prop-non-inf' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const p1 = Number(formData.get('p1'));
                    const p2 = Number(formData.get('p2'));
                    const nonInfMargin = Number(formData.get('nonInfMargin'));
                    const result = calculateDiffPropNonInf(alpha, power, nonInfMargin, p1, p2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Experimental treatment Group(π₁)</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter π₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Treatment Group(π₂)</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter π₂ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Non-inferiority margin (∆E)</label>
                        <input 
                          type="number" 
                          name="nonInfMargin"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter ∆E" 
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

              {/* Difference Proportions - Related Samples - Two Tailed */}
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
                    const result = calculateDiffPropRelTwo(alpha, power, p1, p2, correlation);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion1</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion2</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₂ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Correlation between paired observations</label>
                        <input 
                          type="number" 
                          name="correlation"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter correlation (-1 to 1)" 
                          min="-1"
                          max="1"
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

              {/* Difference Proportions - Related Samples - One Tailed */}
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
                    const result = calculateDiffPropRelOne(alpha, power, p1, p2, correlation);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of significance</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion1</label>
                        <input 
                          type="number" 
                          name="p1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₁ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population proportion2</label>
                        <input 
                          type="number" 
                          name="p2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter p₂ (0-1)" 
                          min="0"
                          max="1"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Correlation between paired observations</label>
                        <input 
                          type="number" 
                          name="correlation"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter correlation (-1 to 1)" 
                          min="-1"
                          max="1"
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

              {/* Difference Means - One Tailed Test */}
              {activeTab === 'diff-means-one-tail' && (
                <div className="max-w-lg mx-auto">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const alpha = Number(formData.get('alpha'));
                    const power = Number(formData.get('power'));
                    const populationMean1 = Number(formData.get('populationMean1'));
                    const populationMean2 = Number(formData.get('populationMean2'));
                    const stdDev1 = Number(formData.get('stdDev1'));
                    const stdDev2 = Number(formData.get('stdDev2'));
                    const result = calculateDiffMeansOneTailed(alpha, power, populationMean1, populationMean2, stdDev1, stdDev2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population Mean 1</label>
                        <input 
                          type="number" 
                          name="populationMean1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter μ₁" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population Mean 2</label>
                        <input 
                          type="number" 
                          name="populationMean2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter μ₂" 
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population SD 1</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Population SD 2</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
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

              {/* Difference Means - Equivalence Study (a) */}
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
                    const result = calculateDiffMeansEquivA(alpha, power, equivalenceMargin, stdDev1, stdDev2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Equivalence Margin (δ)</label>
                        <input 
                          type="number" 
                          name="equivalenceMargin"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter δ" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
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

              {/* Difference Means - Equivalence Study (b) */}
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
                    const result = calculateDiffMeansEquivB(alpha, power, equivalenceMargin, stdDev1, stdDev2, expectedDiff);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Equivalence Margin (δ)</label>
                        <input 
                          type="number" 
                          name="equivalenceMargin"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter δ" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expected Difference</label>
                        <input 
                          type="number" 
                          name="expectedDiff"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter expected difference" 
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

              {/* Difference Means - Non-Inferiority Trial */}
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
                    const result = calculateDiffMeansNonInf(alpha, power, nonInfMargin, stdDev1, stdDev2);
                    setResults(result);
                  }}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Level of Significance (α)</label>
                        <select 
                          name="alpha"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select α</option>
                          <option value="0.10">0.10</option>
                          <option value="0.05">0.05</option>
                          <option value="0.01">0.01</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Power</label>
                        <select 
                          name="power"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          required
                        >
                          <option value="">Select Power</option>
                          <option value="0.80">0.80</option>
                          <option value="0.85">0.85</option>
                          <option value="0.90">0.90</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Non-Inferiority Margin (δ)</label>
                        <input 
                          type="number" 
                          name="nonInfMargin"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter δ" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 1 (σ₁)</label>
                        <input 
                          type="number" 
                          name="stdDev1"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₁" 
                          min="0.001"
                          step="0.001"
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Standard Deviation Group 2 (σ₂)</label>
                        <input 
                          type="number" 
                          name="stdDev2"
                          className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
                          placeholder="Enter σ₂" 
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

              {/* Add placeholder for other calculators */}
              {!['single-mean-ci', 'single-mean-ci-finite', 'single-mean-two-tail', 'single-mean-one-tail', 'single-mean-sign', 'diff-means-ci', 'diff-means-ci-finite', 'diff-means-two-tail', 'diff-means-paired', 'diff-means-crossover', 'single-prop-ci', 'single-prop-ci-finite', 'single-prop-ci-rel', 'single-prop-ci-rel-finite', 'single-prop-two-tail', 'single-prop-one-tail', 'diff-prop-ci', 'diff-prop-two-tail', 'diff-prop-one-tail', 'diff-prop-equiv-a', 'diff-prop-equiv-b', 'diff-prop-non-inf', 'diff-prop-rel-two', 'diff-prop-rel-one', 'diff-means-one-tail', 'diff-means-equiv-a', 'diff-means-equiv-b', 'diff-means-non-inf'].includes(activeTab) && (
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