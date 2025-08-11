import { calculatorReducer } from '../useCalculatorState';
import { CALCULATOR_DEFAULTS } from '../../constants/calculator';

describe('calculatorReducer', () => {
  const initialState = {
    activeTab: 'property' as const,
    propertyPrice: CALCULATOR_DEFAULTS.propertyPrice,
    monthlyPayment: CALCULATOR_DEFAULTS.monthlyPayment,
    requiredSalary: CALCULATOR_DEFAULTS.requiredSalary,
    downPayment: CALCULATOR_DEFAULTS.downPayment,
    loanDuration: CALCULATOR_DEFAULTS.loanDuration,
    interestRate: CALCULATOR_DEFAULTS.interestRate,
    isAdvancedMode: false,
    debtRate: CALCULATOR_DEFAULTS.debtRate,
    existingLoans: CALCULATOR_DEFAULTS.existingLoans,
    rentalIncome: CALCULATOR_DEFAULTS.rentalIncome,
    rentalIncomePercentage: CALCULATOR_DEFAULTS.rentalIncomePercentage,
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
  };

  it('should set property price', () => {
    const action = { type: 'SET_PROPERTY_PRICE' as const, payload: 300000 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.propertyPrice).toBe(300000);
    expect(newState).not.toBe(initialState); // Should create new state
  });

  it('should set monthly payment', () => {
    const action = { type: 'SET_MONTHLY_PAYMENT' as const, payload: 1500 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.monthlyPayment).toBe(1500);
  });

  it('should set active tab', () => {
    const action = { type: 'SET_ACTIVE_TAB' as const, payload: 'monthly' as const };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.activeTab).toBe('monthly');
  });

  it('should toggle advanced mode', () => {
    const action = { type: 'SET_ADVANCED_MODE' as const, payload: true };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.isAdvancedMode).toBe(true);
  });

  it('should set required salary', () => {
    const action = { type: 'SET_REQUIRED_SALARY' as const, payload: 4000 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.requiredSalary).toBe(4000);
  });

  it('should set down payment', () => {
    const action = { type: 'SET_DOWN_PAYMENT' as const, payload: 60000 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.downPayment).toBe(60000);
  });

  it('should set loan duration', () => {
    const action = { type: 'SET_LOAN_DURATION' as const, payload: 20 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.loanDuration).toBe(20);
  });

  it('should set interest rate', () => {
    const action = { type: 'SET_INTEREST_RATE' as const, payload: 4.2 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.interestRate).toBe(4.2);
  });

  it('should set debt rate', () => {
    const action = { type: 'SET_DEBT_RATE' as const, payload: 35 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.debtRate).toBe(35);
  });

  it('should set existing loans', () => {
    const action = { type: 'SET_EXISTING_LOANS' as const, payload: 500 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.existingLoans).toBe(500);
  });

  it('should set rental income', () => {
    const action = { type: 'SET_RENTAL_INCOME' as const, payload: 1000 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.rentalIncome).toBe(1000);
  });

  it('should set rental income percentage', () => {
    const action = { type: 'SET_RENTAL_INCOME_PERCENTAGE' as const, payload: 80 };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.rentalIncomePercentage).toBe(80);
  });

  it('should set annual salary flag', () => {
    const action = { type: 'SET_IS_ANNUAL_SALARY' as const, payload: true };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.isAnnualSalary).toBe(true);
  });

  it('should set net salary flag', () => {
    const action = { type: 'SET_IS_NET_SALARY' as const, payload: false };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.isNetSalary).toBe(false);
  });

  it('should set validation errors', () => {
    const errors = [{ field: 'propertyPrice', message: 'Test error' }];
    const action = { type: 'SET_VALIDATION_ERRORS' as const, payload: errors };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.validationErrors).toEqual(errors);
  });

  it('should set calculating flag', () => {
    const action = { type: 'SET_IS_CALCULATING' as const, payload: true };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.isCalculating).toBe(true);
  });

  it('should set results', () => {
    const results = {
      monthlyPayment: 1200,
      requiredSalary: 3600,
      totalCost: 50000,
      propertyPrice: 250000,
      loanAmount: 200000,
      notaryFees: 18750,
      totalPurchaseCost: 268750,
      grossSalary: 4800,
      totalOperationCost: 318750,
    };
    const action = { type: 'SET_RESULTS' as const, payload: results };
    const newState = calculatorReducer(initialState, action);
    
    expect(newState.results).toEqual(results);
  });

  it('should reset advanced settings to defaults', () => {
    const stateWithAdvancedSettings = {
      ...initialState,
      debtRate: 40,
      existingLoans: 500,
      rentalIncome: 1000,
      rentalIncomePercentage: 80,
    };
    
    const action = { type: 'RESET_ADVANCED_SETTINGS' as const };
    const newState = calculatorReducer(stateWithAdvancedSettings, action);
    
    expect(newState.debtRate).toBe(CALCULATOR_DEFAULTS.debtRate);
    expect(newState.existingLoans).toBe(CALCULATOR_DEFAULTS.existingLoans);
    expect(newState.rentalIncome).toBe(CALCULATOR_DEFAULTS.rentalIncome);
    expect(newState.rentalIncomePercentage).toBe(CALCULATOR_DEFAULTS.rentalIncomePercentage);
  });

  it('should return current state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION', payload: 'test' } as never;
    const newState = calculatorReducer(initialState, unknownAction);
    
    expect(newState).toBe(initialState);
  });
});