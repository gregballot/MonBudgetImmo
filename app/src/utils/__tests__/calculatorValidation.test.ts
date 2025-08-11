import { 
  validateField, 
  validateActiveTabInputs, 
  validateAllInputs,
  getFieldError
} from '../calculatorValidation';
import { CALCULATOR_CONSTANTS } from '../../constants/calculator';
import type { CalculationInputs } from '../../types/calculator';

describe('Calculator Validation', () => {
  const validInputs: CalculationInputs = {
    propertyPrice: 250000,
    monthlyPayment: 1200,
    requiredSalary: 3500,
    downPayment: 50000,
    loanDuration: 25,
    interestRate: 3.5,
    debtRate: 33,
    existingLoans: 0,
    rentalIncome: 0,
    rentalIncomePercentage: 70,
  };

  describe('validateField', () => {
    describe('propertyPrice', () => {
      it('should validate positive property price', () => {
        expect(validateField.propertyPrice(250000)).toBeNull();
      });

      it('should reject zero property price', () => {
        const error = validateField.propertyPrice(0);
        expect(error).toEqual({
          field: 'propertyPrice',
          message: 'Le prix du bien doit être positif'
        });
      });

      it('should reject negative property price', () => {
        const error = validateField.propertyPrice(-1000);
        expect(error).toEqual({
          field: 'propertyPrice',
          message: 'Le prix du bien doit être positif'
        });
      });

      it('should reject extremely large property price', () => {
        const error = validateField.propertyPrice(CALCULATOR_CONSTANTS.MAX_CURRENCY_VALUE + 1);
        expect(error).toEqual({
          field: 'propertyPrice',
          message: 'Le prix du bien doit être un montant valide'
        });
      });
    });

    describe('monthlyPayment', () => {
      it('should validate positive monthly payment', () => {
        expect(validateField.monthlyPayment(1200)).toBeNull();
      });

      it('should reject zero monthly payment', () => {
        const error = validateField.monthlyPayment(0);
        expect(error).toEqual({
          field: 'monthlyPayment',
          message: 'La mensualité doit être positive'
        });
      });
    });

    describe('loanDuration', () => {
      it('should validate valid loan duration', () => {
        expect(validateField.loanDuration(25)).toBeNull();
      });

      it('should reject non-integer loan duration', () => {
        const error = validateField.loanDuration(25.5);
        expect(error).toEqual({
          field: 'loanDuration',
          message: 'La durée du prêt doit être un nombre entier'
        });
      });

      it('should reject loan duration too short', () => {
        const error = validateField.loanDuration(0);
        expect(error).toEqual({
          field: 'loanDuration',
          message: 'La durée du prêt doit être positive'
        });
      });

      it('should reject loan duration too long', () => {
        const error = validateField.loanDuration(100);
        expect(error?.field).toBe('loanDuration');
        expect(error?.message).toContain('ne peut pas dépasser');
      });
    });

    describe('downPayment', () => {
      it('should validate zero down payment', () => {
        expect(validateField.downPayment(0)).toBeNull();
      });

      it('should validate positive down payment', () => {
        expect(validateField.downPayment(50000)).toBeNull();
      });

      it('should reject negative down payment', () => {
        const error = validateField.downPayment(-1000);
        expect(error).toEqual({
          field: 'downPayment',
          message: "L'apport ne peut pas être négatif"
        });
      });
    });

    describe('interestRate', () => {
      it('should validate positive interest rate', () => {
        expect(validateField.interestRate(3.5)).toBeNull();
      });

      it('should validate zero interest rate', () => {
        expect(validateField.interestRate(0)).toBeNull();
      });

      it('should reject negative interest rate', () => {
        const error = validateField.interestRate(-1);
        expect(error).toEqual({
          field: 'interestRate',
          message: 'Le taux d\'intérêt ne peut pas être négatif'
        });
      });

      it('should reject interest rate over 100%', () => {
        const error = validateField.interestRate(101);
        expect(error).toEqual({
          field: 'interestRate',
          message: 'Le taux d\'intérêt doit être entre 0% et 100%'
        });
      });
    });
  });

  describe('validateActiveTabInputs', () => {
    it('should validate property mode correctly', () => {
      const errors = validateActiveTabInputs(validInputs, 'property');
      expect(errors).toHaveLength(0);
    });

    it('should validate monthly mode correctly', () => {
      const errors = validateActiveTabInputs(validInputs, 'monthly');
      expect(errors).toHaveLength(0);
    });

    it('should validate salary mode correctly', () => {
      const errors = validateActiveTabInputs(validInputs, 'salary');
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid property price in property mode', () => {
      const invalidInputs = { ...validInputs, propertyPrice: -1000 };
      const errors = validateActiveTabInputs(invalidInputs, 'property');
      
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('propertyPrice');
    });

    it('should return errors for invalid monthly payment in monthly mode', () => {
      const invalidInputs = { ...validInputs, monthlyPayment: 0 };
      const errors = validateActiveTabInputs(invalidInputs, 'monthly');
      
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('monthlyPayment');
    });

    it('should always validate common fields regardless of mode', () => {
      const invalidInputs = { 
        ...validInputs, 
        downPayment: -1000,
        loanDuration: 0 
      };
      const errors = validateActiveTabInputs(invalidInputs, 'property');
      
      expect(errors.length).toBeGreaterThan(1);
      expect(errors.some(e => e.field === 'downPayment')).toBe(true);
      expect(errors.some(e => e.field === 'loanDuration')).toBe(true);
    });
  });

  describe('validateAllInputs', () => {
    it('should return valid result for valid inputs', () => {
      const result = validateAllInputs(validInputs);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result for invalid inputs', () => {
      const invalidInputs = { 
        ...validInputs, 
        propertyPrice: -1000,
        monthlyPayment: 0 
      };
      const result = validateAllInputs(invalidInputs);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate cross-field constraints', () => {
      const invalidInputs = { 
        ...validInputs, 
        downPayment: validInputs.propertyPrice + 10000 // Down payment exceeds property price
      };
      const result = validateAllInputs(invalidInputs);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.field === 'downPayment' && 
        e.message.includes('ne peut pas dépasser'))).toBe(true);
    });
  });

  describe('getFieldError', () => {
    it('should return error message for existing field', () => {
      const errors = [
        { field: 'propertyPrice', message: 'Test error' },
        { field: 'monthlyPayment', message: 'Another error' }
      ];
      
      expect(getFieldError(errors, 'propertyPrice')).toBe('Test error');
    });

    it('should return undefined for non-existing field', () => {
      const errors = [
        { field: 'propertyPrice', message: 'Test error' }
      ];
      
      expect(getFieldError(errors, 'monthlyPayment')).toBeUndefined();
    });

    it('should return undefined for empty errors array', () => {
      expect(getFieldError([], 'propertyPrice')).toBeUndefined();
    });
  });
});