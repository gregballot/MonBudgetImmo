import { CALCULATOR_CONSTANTS, VALIDATION_LIMITS } from '../constants/calculator';
import type { CalculationInputs, ValidationError, ValidationResult, CalculationMode } from '../types/calculator';

// Validation rule functions

export const validationRules = {
  required: <T>(value: T): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value) && isFinite(value);
    return value !== null && value !== undefined;
  },

  min: (value: number, min: number): boolean => value >= min,
  max: (value: number, max: number): boolean => value <= max,
  positive: (value: number): boolean => value > 0,
  nonNegative: (value: number): boolean => value >= 0,
  percentage: (value: number): boolean => value >= 0 && value <= 100,
  currency: (value: number): boolean => 
    value >= CALCULATOR_CONSTANTS.MIN_CURRENCY_VALUE && 
    value <= CALCULATOR_CONSTANTS.MAX_CURRENCY_VALUE,
  integer: (value: number): boolean => Number.isInteger(value),
  
  decimal: (value: number, decimals: number = CALCULATOR_CONSTANTS.DECIMAL_PRECISION): boolean => {
    const decimalPlaces = value.toString().split('.')[1]?.length || 0;
    return decimalPlaces <= decimals;
  },
} as const;

// Field-specific validation functions
export const validateField = {
  propertyPrice: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'propertyPrice', message: 'Le prix du bien est requis' };
    }
    if (!validationRules.positive(value)) {
      return { field: 'propertyPrice', message: 'Le prix du bien doit être positif' };
    }
    if (!validationRules.currency(value)) {
      return { field: 'propertyPrice', message: 'Le prix du bien doit être un montant valide' };
    }
    return null;
  },

  monthlyPayment: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'monthlyPayment', message: 'La mensualité est requise' };
    }
    if (!validationRules.positive(value)) {
      return { field: 'monthlyPayment', message: 'La mensualité doit être positive' };
    }
    if (!validationRules.currency(value)) {
      return { field: 'monthlyPayment', message: 'La mensualité doit être un montant valide' };
    }
    return null;
  },

  requiredSalary: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'requiredSalary', message: 'Le salaire est requis' };
    }
    if (!validationRules.positive(value)) {
      return { field: 'requiredSalary', message: 'Le salaire doit être positif' };
    }
    if (!validationRules.currency(value)) {
      return { field: 'requiredSalary', message: 'Le salaire doit être un montant valide' };
    }
    return null;
  },

  downPayment: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'downPayment', message: "L'apport est requis" };
    }
    if (!validationRules.nonNegative(value)) {
      return { field: 'downPayment', message: "L'apport ne peut pas être négatif" };
    }
    if (!validationRules.currency(value)) {
      return { field: 'downPayment', message: "L'apport doit être un montant valide" };
    }
    return null;
  },

  loanDuration: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'loanDuration', message: 'La durée du prêt est requise' };
    }
    if (!validationRules.positive(value)) {
      return { field: 'loanDuration', message: 'La durée du prêt doit être positive' };
    }
    if (!validationRules.integer(value)) {
      return { field: 'loanDuration', message: 'La durée du prêt doit être un nombre entier' };
    }
    if (!validationRules.min(value, VALIDATION_LIMITS.minLoanDuration)) {
      return { 
        field: 'loanDuration', 
        message: `La durée du prêt doit être d'au moins ${VALIDATION_LIMITS.minLoanDuration} an${VALIDATION_LIMITS.minLoanDuration > 1 ? 's' : ''}` 
      };
    }
    if (!validationRules.max(value, VALIDATION_LIMITS.maxLoanDuration)) {
      return { 
        field: 'loanDuration', 
        message: `La durée du prêt ne peut pas dépasser ${VALIDATION_LIMITS.maxLoanDuration} ans` 
      };
    }
    return null;
  },

  interestRate: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'interestRate', message: 'Le taux d\'intérêt est requis' };
    }
    if (!validationRules.nonNegative(value)) {
      return { field: 'interestRate', message: 'Le taux d\'intérêt ne peut pas être négatif' };
    }
    if (!validationRules.percentage(value)) {
      return { field: 'interestRate', message: 'Le taux d\'intérêt doit être entre 0% et 100%' };
    }
    return null;
  },

  debtRate: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'debtRate', message: 'Le taux d\'endettement est requis' };
    }
    if (!validationRules.percentage(value)) {
      return { field: 'debtRate', message: 'Le taux d\'endettement doit être entre 0% et 100%' };
    }
    if (!validationRules.min(value, VALIDATION_LIMITS.minDebtRate)) {
      return { 
        field: 'debtRate', 
        message: `Le taux d'endettement doit être d'au moins ${VALIDATION_LIMITS.minDebtRate}%` 
      };
    }
    if (!validationRules.max(value, VALIDATION_LIMITS.maxDebtRate)) {
      return { 
        field: 'debtRate', 
        message: `Le taux d'endettement ne peut pas dépasser ${VALIDATION_LIMITS.maxDebtRate}%` 
      };
    }
    return null;
  },

  existingLoans: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'existingLoans', message: 'Les prêts existants sont requis' };
    }
    if (!validationRules.nonNegative(value)) {
      return { field: 'existingLoans', message: 'Les prêts existants ne peuvent pas être négatifs' };
    }
    if (!validationRules.currency(value)) {
      return { field: 'existingLoans', message: 'Les prêts existants doivent être un montant valide' };
    }
    return null;
  },

  rentalIncome: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'rentalIncome', message: 'Les revenus locatifs sont requis' };
    }
    if (!validationRules.nonNegative(value)) {
      return { field: 'rentalIncome', message: 'Les revenus locatifs ne peuvent pas être négatifs' };
    }
    if (!validationRules.currency(value)) {
      return { field: 'rentalIncome', message: 'Les revenus locatifs doivent être un montant valide' };
    }
    return null;
  },

  rentalIncomePercentage: (value: number): ValidationError | null => {
    if (!validationRules.required(value)) {
      return { field: 'rentalIncomePercentage', message: 'Le pourcentage des revenus locatifs est requis' };
    }
    if (!validationRules.percentage(value)) {
      return { field: 'rentalIncomePercentage', message: 'Le pourcentage des revenus locatifs doit être entre 0% et 100%' };
    }
    return null;
  },
} as const;

// Cross-field validation functions
export const validateCrossFields = (inputs: CalculationInputs): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Down payment should not exceed property price (for property mode)
  if (inputs.downPayment > inputs.propertyPrice) {
    errors.push({
      field: 'downPayment',
      message: "L'apport ne peut pas dépasser le prix du bien"
    });
  }

  // Loan duration should be reasonable for the property price
  const maxReasonableLoanDuration = 50;
  if (inputs.loanDuration > maxReasonableLoanDuration) {
    errors.push({
      field: 'loanDuration',
      message: `Une durée de prêt supérieure à ${maxReasonableLoanDuration} ans est peu réaliste`
    });
  }

  // Interest rate should be reasonable
  const maxReasonableInterestRate = 20;
  if (inputs.interestRate > maxReasonableInterestRate) {
    errors.push({
      field: 'interestRate',
      message: `Un taux d'intérêt supérieur à ${maxReasonableInterestRate}% est peu réaliste`
    });
  }

  return errors;
};

// Main validation function for active tab
export const validateActiveTabInputs = (
  inputs: CalculationInputs,
  activeTab: CalculationMode
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate the primary input for the active tab
  switch (activeTab) {
    case 'property': {
      const error = validateField.propertyPrice(inputs.propertyPrice);
      if (error) errors.push(error);
      break;
    }
    case 'monthly': {
      const error = validateField.monthlyPayment(inputs.monthlyPayment);
      if (error) errors.push(error);
      break;
    }
    case 'salary': {
      const error = validateField.requiredSalary(inputs.requiredSalary);
      if (error) errors.push(error);
      break;
    }
  }

  // Always validate common inputs
  const commonErrors = [
    validateField.downPayment(inputs.downPayment),
    validateField.loanDuration(inputs.loanDuration),
    validateField.interestRate(inputs.interestRate),
  ].filter((error): error is ValidationError => error !== null);

  errors.push(...commonErrors);

  return errors;
};

// Full validation for all inputs (used when advanced mode is enabled)
export const validateAllInputs = (inputs: CalculationInputs): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate all basic fields
  const basicErrors = [
    validateField.propertyPrice(inputs.propertyPrice),
    validateField.monthlyPayment(inputs.monthlyPayment),
    validateField.requiredSalary(inputs.requiredSalary),
    validateField.downPayment(inputs.downPayment),
    validateField.loanDuration(inputs.loanDuration),
    validateField.interestRate(inputs.interestRate),
  ].filter((error): error is ValidationError => error !== null);

  errors.push(...basicErrors);

  // Validate advanced fields if they have non-zero values
  if (inputs.debtRate !== CALCULATOR_CONSTANTS.DEFAULT_DEBT_RATE) {
    const error = validateField.debtRate(inputs.debtRate);
    if (error) errors.push(error);
  }

  if (inputs.existingLoans > 0) {
    const error = validateField.existingLoans(inputs.existingLoans);
    if (error) errors.push(error);
  }

  if (inputs.rentalIncome > 0) {
    const rentalIncomeError = validateField.rentalIncome(inputs.rentalIncome);
    if (rentalIncomeError) errors.push(rentalIncomeError);

    const rentalPercentageError = validateField.rentalIncomePercentage(inputs.rentalIncomePercentage);
    if (rentalPercentageError) errors.push(rentalPercentageError);
  }

  // Cross-field validations
  errors.push(...validateCrossFields(inputs));

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to get error for a specific field
export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  return errors.find(error => error.field === fieldName)?.message;
};