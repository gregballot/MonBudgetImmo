/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { useCalculatorState } from './useCalculatorState';
import { usePersistentState } from './usePersistentState';
import { CALCULATOR_DEFAULTS } from '../constants/calculator';
import type { CalculationMode } from '../helpers/Calculator';

/**
 * Hook that combines calculator state management with localStorage persistence
 * This provides a clean interface while maintaining backward compatibility
 */
export const usePersistentCalculatorState = () => {
  const { state, actions } = useCalculatorState();

  // Persistent state hooks (for localStorage integration)
  const [persistentActiveTab, setPersistentActiveTab] = usePersistentState<CalculationMode>('calculator-activeTab', 'property');
  const [persistentPropertyPrice, setPersistentPropertyPrice] = usePersistentState('calculator-propertyPrice', CALCULATOR_DEFAULTS.propertyPrice);
  const [persistentMonthlyPayment, setPersistentMonthlyPayment] = usePersistentState('calculator-monthlyPayment', CALCULATOR_DEFAULTS.monthlyPayment);
  const [persistentRequiredSalary, setPersistentRequiredSalary] = usePersistentState('calculator-requiredSalary', CALCULATOR_DEFAULTS.requiredSalary);
  const [persistentDownPayment, setPersistentDownPayment] = usePersistentState('calculator-downPayment', CALCULATOR_DEFAULTS.downPayment);
  const [persistentLoanDuration, setPersistentLoanDuration] = usePersistentState('calculator-loanDuration', 25);
  const [persistentInterestRate, setPersistentInterestRate] = usePersistentState('calculator-interestRate', 3.8);
  const [persistentIsAdvancedMode, setPersistentIsAdvancedMode] = usePersistentState('calculator-isAdvancedMode', false);
  const [persistentDebtRate, setPersistentDebtRate] = usePersistentState('calculator-debtRate', 33);
  const [persistentExistingLoans, setPersistentExistingLoans] = usePersistentState('calculator-existingLoans', CALCULATOR_DEFAULTS.existingLoans);
  const [persistentRentalIncome, setPersistentRentalIncome] = usePersistentState('calculator-rentalIncome', CALCULATOR_DEFAULTS.rentalIncome);
  const [persistentRentalIncomePercentage, setPersistentRentalIncomePercentage] = usePersistentState('calculator-rentalIncomePercentage', 70);
  const [persistentIsAnnualSalary, setPersistentIsAnnualSalary] = usePersistentState('calculator-isAnnualSalary', CALCULATOR_DEFAULTS.isAnnualSalary);
  const [persistentIsNetSalary, setPersistentIsNetSalary] = usePersistentState('calculator-isNetSalary', true);

  // Initialize state from localStorage on mount
  useEffect(() => {
    actions.setActiveTab(persistentActiveTab);
    actions.setPropertyPrice(persistentPropertyPrice);
    actions.setMonthlyPayment(persistentMonthlyPayment);
    actions.setRequiredSalary(persistentRequiredSalary);
    actions.setDownPayment(persistentDownPayment);
    actions.setLoanDuration(persistentLoanDuration);
    actions.setInterestRate(persistentInterestRate);
    actions.setAdvancedMode(persistentIsAdvancedMode);
    actions.setDebtRate(persistentDebtRate);
    actions.setExistingLoans(persistentExistingLoans);
    actions.setRentalIncome(persistentRentalIncome);
    actions.setRentalIncomePercentage(persistentRentalIncomePercentage);
    actions.setIsAnnualSalary(persistentIsAnnualSalary);
    actions.setIsNetSalary(persistentIsNetSalary);
  }, []); // Only run on mount

  // Wrapped actions that also update localStorage
  const wrappedActions = {
    setActiveTab: useCallback((tab: CalculationMode) => {
      actions.setActiveTab(tab);
      setPersistentActiveTab(tab);
    }, [actions.setActiveTab, setPersistentActiveTab]),

    setPropertyPrice: useCallback((price: number) => {
      actions.setPropertyPrice(price);
      setPersistentPropertyPrice(price);
    }, [actions.setPropertyPrice, setPersistentPropertyPrice]),

    setMonthlyPayment: useCallback((payment: number) => {
      actions.setMonthlyPayment(payment);
      setPersistentMonthlyPayment(payment);
    }, [actions.setMonthlyPayment, setPersistentMonthlyPayment]),

    setRequiredSalary: useCallback((salary: number) => {
      actions.setRequiredSalary(salary);
      setPersistentRequiredSalary(salary);
    }, [actions.setRequiredSalary, setPersistentRequiredSalary]),

    setDownPayment: useCallback((payment: number) => {
      actions.setDownPayment(payment);
      setPersistentDownPayment(payment);
    }, [actions.setDownPayment, setPersistentDownPayment]),

    setLoanDuration: useCallback((duration: number) => {
      actions.setLoanDuration(duration);
      setPersistentLoanDuration(duration);
    }, [actions.setLoanDuration, setPersistentLoanDuration]),

    setInterestRate: useCallback((rate: number) => {
      actions.setInterestRate(rate);
      setPersistentInterestRate(rate);
    }, [actions.setInterestRate, setPersistentInterestRate]),

    setAdvancedMode: useCallback((isAdvanced: boolean) => {
      actions.setAdvancedMode(isAdvanced);
      setPersistentIsAdvancedMode(isAdvanced);
    }, [actions.setAdvancedMode, setPersistentIsAdvancedMode]),

    setDebtRate: useCallback((rate: number) => {
      actions.setDebtRate(rate);
      setPersistentDebtRate(rate);
    }, [actions.setDebtRate, setPersistentDebtRate]),

    setExistingLoans: useCallback((loans: number) => {
      actions.setExistingLoans(loans);
      setPersistentExistingLoans(loans);
    }, [actions.setExistingLoans, setPersistentExistingLoans]),

    setRentalIncome: useCallback((income: number) => {
      actions.setRentalIncome(income);
      setPersistentRentalIncome(income);
    }, [actions.setRentalIncome, setPersistentRentalIncome]),

    setRentalIncomePercentage: useCallback((percentage: number) => {
      actions.setRentalIncomePercentage(percentage);
      setPersistentRentalIncomePercentage(percentage);
    }, [actions.setRentalIncomePercentage, setPersistentRentalIncomePercentage]),

    setIsAnnualSalary: useCallback((isAnnual: boolean) => {
      actions.setIsAnnualSalary(isAnnual);
      setPersistentIsAnnualSalary(isAnnual);
    }, [actions.setIsAnnualSalary, setPersistentIsAnnualSalary]),

    setIsNetSalary: useCallback((isNet: boolean) => {
      actions.setIsNetSalary(isNet);
      setPersistentIsNetSalary(isNet);
    }, [actions.setIsNetSalary, setPersistentIsNetSalary]),

    resetAdvancedSettings: useCallback(() => {
      actions.resetAdvancedSettings();
      setPersistentDebtRate(CALCULATOR_DEFAULTS.debtRate);
      setPersistentExistingLoans(CALCULATOR_DEFAULTS.existingLoans);
      setPersistentRentalIncome(CALCULATOR_DEFAULTS.rentalIncome);
      setPersistentRentalIncomePercentage(70);
    }, [actions.resetAdvancedSettings, setPersistentDebtRate, setPersistentExistingLoans, 
        setPersistentRentalIncome, setPersistentRentalIncomePercentage]),

    updateCalculation: actions.updateCalculation,
  };

  return {
    state,
    actions: wrappedActions,
  };
};