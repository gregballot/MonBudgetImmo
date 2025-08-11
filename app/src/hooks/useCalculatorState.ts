import { useReducer, useCallback, useEffect } from 'react';
import { CALCULATOR_DEFAULTS } from '../constants/calculator';
import { MortgageCalculator } from '../helpers/Calculator';
import type { CalculationMode, CalculationResult } from '../helpers/Calculator';
import type { ValidationError } from '../types';

// State interface
export interface CalculatorState {
  // Input values
  activeTab: CalculationMode;
  propertyPrice: number;
  monthlyPayment: number;
  requiredSalary: number;
  downPayment: number;
  loanDuration: number;
  interestRate: number;
  
  // Advanced mode
  isAdvancedMode: boolean;
  debtRate: number;
  existingLoans: number;
  rentalIncome: number;
  rentalIncomePercentage: number;
  
  // Salary mode
  isAnnualSalary: boolean;
  isNetSalary: boolean;
  
  // Derived state
  results: CalculationResult;
  validationErrors: ValidationError[];
  isCalculating: boolean;
}

// Action types
export type CalculatorAction =
  | { type: 'SET_ACTIVE_TAB'; payload: CalculationMode }
  | { type: 'SET_PROPERTY_PRICE'; payload: number }
  | { type: 'SET_MONTHLY_PAYMENT'; payload: number }
  | { type: 'SET_REQUIRED_SALARY'; payload: number }
  | { type: 'SET_DOWN_PAYMENT'; payload: number }
  | { type: 'SET_LOAN_DURATION'; payload: number }
  | { type: 'SET_INTEREST_RATE'; payload: number }
  | { type: 'SET_ADVANCED_MODE'; payload: boolean }
  | { type: 'SET_DEBT_RATE'; payload: number }
  | { type: 'SET_EXISTING_LOANS'; payload: number }
  | { type: 'SET_RENTAL_INCOME'; payload: number }
  | { type: 'SET_RENTAL_INCOME_PERCENTAGE'; payload: number }
  | { type: 'SET_IS_ANNUAL_SALARY'; payload: boolean }
  | { type: 'SET_IS_NET_SALARY'; payload: boolean }
  | { type: 'SET_RESULTS'; payload: CalculationResult }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationError[] }
  | { type: 'SET_IS_CALCULATING'; payload: boolean }
  | { type: 'RESET_ADVANCED_SETTINGS' };

// Initial state
const createInitialState = (): CalculatorState => ({
  activeTab: 'property',
  ...CALCULATOR_DEFAULTS,
  isAdvancedMode: false,
  isAnnualSalary: false,
  isNetSalary: true,
  results: {
    monthlyPayment: 0,
    requiredSalary: 0,
    totalCost: 0,
    propertyPrice: 0,
    loanAmount: 0,
    notaryFees: 0,
    totalPurchaseCost: 0,
    grossSalary: 0,
    totalOperationCost: 0,
  },
  validationErrors: [],
  isCalculating: false,
});

// Reducer
export const calculatorReducer = (
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_PROPERTY_PRICE':
      return { ...state, propertyPrice: action.payload };
    case 'SET_MONTHLY_PAYMENT':
      return { ...state, monthlyPayment: action.payload };
    case 'SET_REQUIRED_SALARY':
      return { ...state, requiredSalary: action.payload };
    case 'SET_DOWN_PAYMENT':
      return { ...state, downPayment: action.payload };
    case 'SET_LOAN_DURATION':
      return { ...state, loanDuration: action.payload };
    case 'SET_INTEREST_RATE':
      return { ...state, interestRate: action.payload };
    case 'SET_ADVANCED_MODE':
      return { ...state, isAdvancedMode: action.payload };
    case 'SET_DEBT_RATE':
      return { ...state, debtRate: action.payload };
    case 'SET_EXISTING_LOANS':
      return { ...state, existingLoans: action.payload };
    case 'SET_RENTAL_INCOME':
      return { ...state, rentalIncome: action.payload };
    case 'SET_RENTAL_INCOME_PERCENTAGE':
      return { ...state, rentalIncomePercentage: action.payload };
    case 'SET_IS_ANNUAL_SALARY':
      return { ...state, isAnnualSalary: action.payload };
    case 'SET_IS_NET_SALARY':
      return { ...state, isNetSalary: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    case 'SET_IS_CALCULATING':
      return { ...state, isCalculating: action.payload };
    case 'RESET_ADVANCED_SETTINGS':
      return {
        ...state,
        debtRate: CALCULATOR_DEFAULTS.debtRate,
        existingLoans: CALCULATOR_DEFAULTS.existingLoans,
        rentalIncome: CALCULATOR_DEFAULTS.rentalIncome,
        rentalIncomePercentage: CALCULATOR_DEFAULTS.rentalIncomePercentage,
      };
    default:
      return state;
  }
};

// Custom hook
export const useCalculatorState = () => {
  const [state, dispatch] = useReducer(calculatorReducer, createInitialState());

  // Action creators
  const setActiveTab = useCallback((tab: CalculationMode) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  const setPropertyPrice = useCallback((price: number) => {
    dispatch({ type: 'SET_PROPERTY_PRICE', payload: price });
  }, []);

  const setMonthlyPayment = useCallback((payment: number) => {
    dispatch({ type: 'SET_MONTHLY_PAYMENT', payload: payment });
  }, []);

  const setRequiredSalary = useCallback((salary: number) => {
    dispatch({ type: 'SET_REQUIRED_SALARY', payload: salary });
  }, []);

  const setDownPayment = useCallback((payment: number) => {
    dispatch({ type: 'SET_DOWN_PAYMENT', payload: payment });
  }, []);

  const setLoanDuration = useCallback((duration: number) => {
    dispatch({ type: 'SET_LOAN_DURATION', payload: duration });
  }, []);

  const setInterestRate = useCallback((rate: number) => {
    dispatch({ type: 'SET_INTEREST_RATE', payload: rate });
  }, []);

  const setAdvancedMode = useCallback((isAdvanced: boolean) => {
    dispatch({ type: 'SET_ADVANCED_MODE', payload: isAdvanced });
  }, []);

  const setDebtRate = useCallback((rate: number) => {
    dispatch({ type: 'SET_DEBT_RATE', payload: rate });
  }, []);

  const setExistingLoans = useCallback((loans: number) => {
    dispatch({ type: 'SET_EXISTING_LOANS', payload: loans });
  }, []);

  const setRentalIncome = useCallback((income: number) => {
    dispatch({ type: 'SET_RENTAL_INCOME', payload: income });
  }, []);

  const setRentalIncomePercentage = useCallback((percentage: number) => {
    dispatch({ type: 'SET_RENTAL_INCOME_PERCENTAGE', payload: percentage });
  }, []);

  const setIsAnnualSalary = useCallback((isAnnual: boolean) => {
    dispatch({ type: 'SET_IS_ANNUAL_SALARY', payload: isAnnual });
  }, []);

  const setIsNetSalary = useCallback((isNet: boolean) => {
    dispatch({ type: 'SET_IS_NET_SALARY', payload: isNet });
  }, []);

  const resetAdvancedSettings = useCallback(() => {
    dispatch({ type: 'RESET_ADVANCED_SETTINGS' });
  }, []);

  // Calculate results when relevant inputs change
  const updateCalculation = useCallback(() => {
    dispatch({ type: 'SET_IS_CALCULATING', payload: true });
    
    try {
      const inputs = {
        propertyPrice: state.propertyPrice,
        monthlyPayment: state.monthlyPayment,
        requiredSalary: state.requiredSalary,
        downPayment: state.downPayment,
        loanDuration: state.loanDuration,
        interestRate: state.interestRate,
        debtRate: state.debtRate,
        existingLoans: state.existingLoans,
        rentalIncome: state.rentalIncome,
        rentalIncomePercentage: state.rentalIncomePercentage,
      };

      const calculator = new MortgageCalculator(inputs);
      const results = calculator.calculate(state.activeTab);
      
      dispatch({ type: 'SET_RESULTS', payload: results });
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: [] });
    } catch (error) {
      console.error('Calculation error:', error);
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: [
        { field: 'general', message: 'Erreur de calcul. Veuillez vérifier vos données.' }
      ] });
    } finally {
      dispatch({ type: 'SET_IS_CALCULATING', payload: false });
    }
  }, [state.propertyPrice, state.monthlyPayment, state.requiredSalary, state.downPayment, 
      state.loanDuration, state.interestRate, state.debtRate, state.existingLoans, 
      state.rentalIncome, state.rentalIncomePercentage, state.activeTab]);

  // Auto-calculate when inputs change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCalculation();
    }, 100); // Small debounce to prevent excessive calculations

    return () => clearTimeout(timeoutId);
  }, [updateCalculation]);

  return {
    state,
    actions: {
      setActiveTab,
      setPropertyPrice,
      setMonthlyPayment,
      setRequiredSalary,
      setDownPayment,
      setLoanDuration,
      setInterestRate,
      setAdvancedMode,
      setDebtRate,
      setExistingLoans,
      setRentalIncome,
      setRentalIncomePercentage,
      setIsAnnualSalary,
      setIsNetSalary,
      resetAdvancedSettings,
      updateCalculation,
    },
  };
};