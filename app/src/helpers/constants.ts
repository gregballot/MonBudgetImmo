export const CALCULATOR_DEFAULTS = {
  propertyPrice: 250000,
  monthlyPayment: 1189,
  requiredSalary: 3400,
  downPayment: 50000,
  loanDuration: 25,
  interestRate: 3.8,
};

export const LOAN_DURATION_OPTIONS = [10, 15, 20, 25] as const;

export const CALCULATOR_TABS = [
  { id: 'property', label: 'Prix du bien' },
  { id: 'monthly', label: 'Mensualité' },
  { id: 'salary', label: 'Salaire' },
];

export const ANIMATION_DURATION = 500; // milliseconds

export const SALARY_RATIO = 0.33; // 33% rule for mortgage affordability 
