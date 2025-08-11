export const CALCULATOR_CONSTANTS = {
  // Loan and calculation limits
  MIN_LOAN_DURATION: 3,
  MAX_LOAN_DURATION: 30,
  DEFAULT_LOAN_DURATION: 25,
  
  MIN_INTEREST_RATE: 0.1,
  MAX_INTEREST_RATE: 15,
  DEFAULT_INTEREST_RATE: 3.8,
  
  MIN_DEBT_RATE: 5,
  MAX_DEBT_RATE: 60,
  DEFAULT_DEBT_RATE: 33,
  
  MIN_RENTAL_INCOME_PERCENTAGE: 0,
  MAX_RENTAL_INCOME_PERCENTAGE: 100,
  DEFAULT_RENTAL_INCOME_PERCENTAGE: 70,
  
  // Financial calculations
  NOTARY_FEE_RATE: 0.075, // 7.5% for existing properties
  NOTARY_FEE_RATE_DETAILED: 0.0793, // 7.93% detailed calculation
  
  // Salary conversions
  NET_TO_GROSS_RATIO: 0.75, // Net = Gross * 0.75
  GROSS_TO_NET_MULTIPLIER: 1.3, // Gross ≈ Net * 1.3 (simplified)
  
  // Currency limits
  MIN_CURRENCY_VALUE: 0,
  MAX_CURRENCY_VALUE: 999999999,
  
  // Animation
  ANIMATION_DURATION: 500, // milliseconds
  TOOLTIP_DELAY: 2000, // milliseconds
  TOOLTIP_FADE_DURATION: 300, // milliseconds
  
  // Precision
  DECIMAL_PRECISION: 2,
  CALCULATION_PRECISION: 0.01,
} as const;

export const CALCULATOR_DEFAULTS = {
  propertyPrice: 250000,
  monthlyPayment: 1189,
  requiredSalary: 3400,
  downPayment: 50000,
  loanDuration: CALCULATOR_CONSTANTS.DEFAULT_LOAN_DURATION,
  interestRate: CALCULATOR_CONSTANTS.DEFAULT_INTEREST_RATE,
  debtRate: CALCULATOR_CONSTANTS.DEFAULT_DEBT_RATE,
  existingLoans: 0,
  rentalIncome: 0,
  rentalIncomePercentage: CALCULATOR_CONSTANTS.DEFAULT_RENTAL_INCOME_PERCENTAGE,
  isAnnualSalary: false,
};

export const CALCULATOR_TABS = [
  { id: 'property', label: 'Prix du bien' },
  { id: 'monthly', label: 'Mensualité' },
  { id: 'salary', label: 'Salaire' },
];

// Validation limits
export const VALIDATION_LIMITS = {
  minLoanDuration: 1,
  maxLoanDuration: 50,
  minInterestRate: 0,
  maxInterestRate: 100,
  minDebtRate: CALCULATOR_CONSTANTS.MIN_DEBT_RATE,
  maxDebtRate: CALCULATOR_CONSTANTS.MAX_DEBT_RATE,
} as const;