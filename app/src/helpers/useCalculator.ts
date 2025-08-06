import { useState, useCallback } from 'react';
import { MortgageCalculator } from './Calculator';
import type { CalculationMode, CalculationResult } from './Calculator';

export const useCalculator = () => {
  const [results, setResults] = useState<CalculationResult>({
    monthlyPayment: 0,
    requiredSalary: 0,
    totalCost: 0,
    propertyPrice: 0,
    loanAmount: 0,
    notaryFees: 0,
    totalPurchaseCost: 0,
    grossSalary: 0,
    totalOperationCost: 0,
  });

  const updateCalculation = useCallback((inputs: {
    propertyPrice: number;
    monthlyPayment: number;
    requiredSalary: number;
    downPayment: number;
    loanDuration: number;
    interestRate: number;
    debtRate: number;
    existingLoans: number;
    rentalIncome: number;
    rentalIncomePercentage: number;
  }, mode: CalculationMode) => {
    const calculator = new MortgageCalculator(inputs);
    const newResults = calculator.calculate(mode);
    setResults(newResults);
  }, []);

  return { results, updateCalculation };
};
