import type { ValidationError } from '../types';

// Validation rules
export const VALIDATION_RULES = {
  required: (value: unknown): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return !isNaN(value) && isFinite(value);
    return value !== null && value !== undefined;
  },
  
  min: (value: number, min: number): boolean => value >= min,
  
  max: (value: number, max: number): boolean => value <= max,
  
  positive: (value: number): boolean => value > 0,
  
  nonNegative: (value: number): boolean => value >= 0,
  
  percentage: (value: number): boolean => value >= 0 && value <= 100,
  
  currency: (value: number): boolean => value >= 0 && value <= 999999999,
  
  integer: (value: number): boolean => Number.isInteger(value),
  
  decimal: (value: number, decimals: number = 2): boolean => {
    const decimalPlaces = value.toString().split('.')[1]?.length || 0;
    return decimalPlaces <= decimals;
  },
} as const;

// Validation functions
export const validateRequired = (value: unknown, fieldName: string): ValidationError | null => {
  if (!VALIDATION_RULES.required(value)) {
    return {
      field: fieldName,
      message: `${fieldName} est requis`,
    };
  }
  return null;
};

export const validateMin = (value: number, min: number, fieldName: string): ValidationError | null => {
  if (!VALIDATION_RULES.min(value, min)) {
    return {
      field: fieldName,
      message: `${fieldName} doit être au moins ${min}`,
    };
  }
  return null;
};

export const validateMax = (value: number, max: number, fieldName: string): ValidationError | null => {
  if (!VALIDATION_RULES.max(value, max)) {
    return {
      field: fieldName,
      message: `${fieldName} doit être au maximum ${max}`,
    };
  }
  return null;
};

export const validatePositive = (value: number, fieldName: string): ValidationError | null => {
  if (!VALIDATION_RULES.positive(value)) {
    return {
      field: fieldName,
      message: `${fieldName} doit être positif`,
    };
  }
  return null;
};

export const validatePercentage = (value: number, fieldName: string): ValidationError | null => {
  if (!VALIDATION_RULES.percentage(value)) {
    return {
      field: fieldName,
      message: `${fieldName} doit être entre 0% et 100%`,
    };
  }
  return null;
};

export const validateCurrency = (value: number, fieldName: string): ValidationError | null => {
  if (!VALIDATION_RULES.currency(value)) {
    return {
      field: fieldName,
      message: `${fieldName} doit être un montant valide`,
    };
  }
  return null;
};

// Simple validation functions for calculator inputs
export const validateCalculatorInputs = (inputs: {
  propertyPrice: number;
  monthlyPayment: number;
  requiredSalary: number;
  downPayment: number;
  loanDuration: number;
  interestRate: number;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Property price validation
  if (!VALIDATION_RULES.required(inputs.propertyPrice)) {
    errors.push({ field: 'propertyPrice', message: 'Le prix du bien est requis' });
  } else if (!VALIDATION_RULES.positive(inputs.propertyPrice)) {
    errors.push({ field: 'propertyPrice', message: 'Le prix du bien doit être positif' });
  } else if (!VALIDATION_RULES.currency(inputs.propertyPrice)) {
    errors.push({ field: 'propertyPrice', message: 'Le prix du bien doit être un montant valide' });
  }
  
  // Monthly payment validation
  if (!VALIDATION_RULES.required(inputs.monthlyPayment)) {
    errors.push({ field: 'monthlyPayment', message: 'La mensualité est requise' });
  } else if (!VALIDATION_RULES.positive(inputs.monthlyPayment)) {
    errors.push({ field: 'monthlyPayment', message: 'La mensualité doit être positive' });
  } else if (!VALIDATION_RULES.currency(inputs.monthlyPayment)) {
    errors.push({ field: 'monthlyPayment', message: 'La mensualité doit être un montant valide' });
  }
  
  // Required salary validation
  if (!VALIDATION_RULES.required(inputs.requiredSalary)) {
    errors.push({ field: 'requiredSalary', message: 'Le salaire est requis' });
  } else if (!VALIDATION_RULES.positive(inputs.requiredSalary)) {
    errors.push({ field: 'requiredSalary', message: 'Le salaire doit être positif' });
  } else if (!VALIDATION_RULES.currency(inputs.requiredSalary)) {
    errors.push({ field: 'requiredSalary', message: 'Le salaire doit être un montant valide' });
  }
  
  // Down payment validation
  if (!VALIDATION_RULES.required(inputs.downPayment)) {
    errors.push({ field: 'downPayment', message: "L'apport est requis" });
  } else if (!VALIDATION_RULES.nonNegative(inputs.downPayment)) {
    errors.push({ field: 'downPayment', message: "L'apport ne peut pas être négatif" });
  } else if (!VALIDATION_RULES.currency(inputs.downPayment)) {
    errors.push({ field: 'downPayment', message: "L'apport doit être un montant valide" });
  }
  
  // Loan duration validation
  if (!VALIDATION_RULES.required(inputs.loanDuration)) {
    errors.push({ field: 'loanDuration', message: 'La durée du prêt est requise' });
  } else if (!VALIDATION_RULES.positive(inputs.loanDuration)) {
    errors.push({ field: 'loanDuration', message: 'La durée du prêt doit être positive' });
  } else if (!VALIDATION_RULES.integer(inputs.loanDuration)) {
    errors.push({ field: 'loanDuration', message: 'La durée du prêt doit être un nombre entier' });
  } else if (!VALIDATION_RULES.min(inputs.loanDuration, 1)) {
    errors.push({ field: 'loanDuration', message: 'La durée du prêt doit être d\'au moins 1 an' });
  } else if (!VALIDATION_RULES.max(inputs.loanDuration, 50)) {
    errors.push({ field: 'loanDuration', message: 'La durée du prêt ne peut pas dépasser 50 ans' });
  }
  
  // Interest rate validation
  if (!VALIDATION_RULES.required(inputs.interestRate)) {
    errors.push({ field: 'interestRate', message: 'Le taux d\'intérêt est requis' });
  } else if (!VALIDATION_RULES.nonNegative(inputs.interestRate)) {
    errors.push({ field: 'interestRate', message: 'Le taux d\'intérêt ne peut pas être négatif' });
  } else if (!VALIDATION_RULES.percentage(inputs.interestRate)) {
    errors.push({ field: 'interestRate', message: 'Le taux d\'intérêt doit être entre 0% et 100%' });
  }
  
  // Custom validation: down payment cannot exceed property price
  if (inputs.downPayment >= inputs.propertyPrice) {
    errors.push({
      field: 'downPayment',
      message: "L'apport ne peut pas dépasser le prix du bien",
    });
  }
  
  return errors;
};

 
