import { useState, useEffect, useCallback } from 'react';
import { MortgageCalculator } from './Calculator';
import type { CalculationMode, CalculationResult } from './Calculator';

interface UseCalculatorReturn {
  // Results
  results: CalculationResult;
  
  // Actions
  updateCalculation: (inputs: {
    propertyPrice: number;
    monthlyPayment: number;
    requiredSalary: number;
    downPayment: number;
    loanDuration: number;
    interestRate: number;
  }, mode: CalculationMode) => void;
}

export const useCalculator = (): UseCalculatorReturn => {
  // Calculator instance
  const [calculator] = useState(() => new MortgageCalculator());
  
  // Results
  const [results, setResults] = useState<CalculationResult>({
    monthlyPayment: 0,
    requiredSalary: 0,
    totalCost: 0,
    propertyPrice: 0,
    loanAmount: 0,
    notaryFees: 0,
    totalPurchaseCost: 0,
  });

  // Update calculation method
  const updateCalculation = useCallback((inputs: {
    propertyPrice: number;
    monthlyPayment: number;
    requiredSalary: number;
    downPayment: number;
    loanDuration: number;
    interestRate: number;
  }, mode: CalculationMode) => {
    // Update calculator inputs
    calculator.propertyPrice = inputs.propertyPrice;
    calculator.monthlyPayment = inputs.monthlyPayment;
    calculator.requiredSalary = inputs.requiredSalary;
    calculator.downPayment = inputs.downPayment;
    calculator.loanDuration = inputs.loanDuration;
    calculator.interestRate = inputs.interestRate;

    // Calculate new results
    const newResults = calculator.calculate(mode);
    setResults(newResults);
  }, [calculator]);

  return {
    results,
    updateCalculation,
  };
}; 
