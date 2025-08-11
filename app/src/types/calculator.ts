// Specific calculator-related types
export type CalculationMode = 'property' | 'monthly' | 'salary';

export interface CalculationInputs {
  readonly propertyPrice: number;
  readonly monthlyPayment: number;
  readonly requiredSalary: number;
  readonly downPayment: number;
  readonly loanDuration: number;
  readonly interestRate: number;
  readonly debtRate: number;
  readonly existingLoans: number;
  readonly rentalIncome: number;
  readonly rentalIncomePercentage: number;
}

export interface CalculationResult {
  readonly monthlyPayment: number;
  readonly requiredSalary: number;
  readonly totalCost: number;
  readonly propertyPrice: number;
  readonly loanAmount: number;
  readonly notaryFees: number;
  readonly totalPurchaseCost: number;
  readonly grossSalary: number;
  readonly totalOperationCost: number;
}

// Tab configuration
export interface CalculatorTab {
  readonly id: CalculationMode;
  readonly label: string;
}

// Validation specific types
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: ReadonlyArray<ValidationError>;
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

// Animation types
export interface AnimatedValue {
  readonly current: number;
  readonly target: number;
  readonly isAnimating: boolean;
}

export type AnimatedResults = {
  readonly [K in keyof CalculationResult]: AnimatedValue;
};

// State management types
export interface CalculatorFormState {
  readonly activeTab: CalculationMode;
  readonly isAdvancedMode: boolean;
  readonly isAnnualSalary: boolean;
  readonly isNetSalary: boolean;
}

// Action types for reducer
export interface SetActiveTabAction {
  readonly type: 'SET_ACTIVE_TAB';
  readonly payload: CalculationMode;
}

export interface SetPropertyPriceAction {
  readonly type: 'SET_PROPERTY_PRICE';
  readonly payload: number;
}

export interface SetMonthlyPaymentAction {
  readonly type: 'SET_MONTHLY_PAYMENT';
  readonly payload: number;
}

export interface SetRequiredSalaryAction {
  readonly type: 'SET_REQUIRED_SALARY';
  readonly payload: number;
}

export interface SetDownPaymentAction {
  readonly type: 'SET_DOWN_PAYMENT';
  readonly payload: number;
}

export interface SetLoanDurationAction {
  readonly type: 'SET_LOAN_DURATION';
  readonly payload: number;
}

export interface SetInterestRateAction {
  readonly type: 'SET_INTEREST_RATE';
  readonly payload: number;
}

export interface SetAdvancedModeAction {
  readonly type: 'SET_ADVANCED_MODE';
  readonly payload: boolean;
}

export interface SetDebtRateAction {
  readonly type: 'SET_DEBT_RATE';
  readonly payload: number;
}

export interface SetExistingLoansAction {
  readonly type: 'SET_EXISTING_LOANS';
  readonly payload: number;
}

export interface SetRentalIncomeAction {
  readonly type: 'SET_RENTAL_INCOME';
  readonly payload: number;
}

export interface SetRentalIncomePercentageAction {
  readonly type: 'SET_RENTAL_INCOME_PERCENTAGE';
  readonly payload: number;
}

export interface SetIsAnnualSalaryAction {
  readonly type: 'SET_IS_ANNUAL_SALARY';
  readonly payload: boolean;
}

export interface SetIsNetSalaryAction {
  readonly type: 'SET_IS_NET_SALARY';
  readonly payload: boolean;
}

export interface SetResultsAction {
  readonly type: 'SET_RESULTS';
  readonly payload: CalculationResult;
}

export interface SetValidationErrorsAction {
  readonly type: 'SET_VALIDATION_ERRORS';
  readonly payload: ReadonlyArray<ValidationError>;
}

export interface SetIsCalculatingAction {
  readonly type: 'SET_IS_CALCULATING';
  readonly payload: boolean;
}

export interface ResetAdvancedSettingsAction {
  readonly type: 'RESET_ADVANCED_SETTINGS';
}

export type CalculatorAction =
  | SetActiveTabAction
  | SetPropertyPriceAction
  | SetMonthlyPaymentAction
  | SetRequiredSalaryAction
  | SetDownPaymentAction
  | SetLoanDurationAction
  | SetInterestRateAction
  | SetAdvancedModeAction
  | SetDebtRateAction
  | SetExistingLoansAction
  | SetRentalIncomeAction
  | SetRentalIncomePercentageAction
  | SetIsAnnualSalaryAction
  | SetIsNetSalaryAction
  | SetResultsAction
  | SetValidationErrorsAction
  | SetIsCalculatingAction
  | ResetAdvancedSettingsAction;

// Component prop types
export interface CalculatorFormActions {
  readonly setActiveTab: (tab: CalculationMode) => void;
  readonly setPropertyPrice: (price: number) => void;
  readonly setMonthlyPayment: (payment: number) => void;
  readonly setRequiredSalary: (salary: number) => void;
  readonly setDownPayment: (payment: number) => void;
  readonly setLoanDuration: (duration: number) => void;
  readonly setInterestRate: (rate: number) => void;
  readonly setAdvancedMode: (isAdvanced: boolean) => void;
  readonly setDebtRate: (rate: number) => void;
  readonly setExistingLoans: (loans: number) => void;
  readonly setRentalIncome: (income: number) => void;
  readonly setRentalIncomePercentage: (percentage: number) => void;
  readonly setIsAnnualSalary: (isAnnual: boolean) => void;
  readonly setIsNetSalary: (isNet: boolean) => void;
  readonly resetAdvancedSettings: () => void;
  readonly updateCalculation: () => void;
}