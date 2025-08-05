import React from 'react';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import { calculateMaxDownPayment } from '../../utils/validation';
import type { CalculationMode } from '../../helpers/Calculator';
import type { ValidationError } from '../../types';

interface CalculatorInputsProps {
  activeTab: CalculationMode;
  propertyPrice: number;
  setPropertyPrice: (value: number) => void;
  monthlyPayment: number;
  setMonthlyPayment: (value: number) => void;
  requiredSalary: number;
  setRequiredSalary: (value: number) => void;
  downPayment: number;
  setDownPayment: (value: number) => void;
  isAnnualSalary: boolean;
  setIsAnnualSalary: (value: boolean) => void;
  validationErrors: ValidationError[];
  loanDuration: number;
  interestRate: number;
  debtRate: number;
  existingLoans: number;
  rentalIncome: number;
  rentalIncomePercentage: number;
}

const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  activeTab,
  propertyPrice,
  setPropertyPrice,
  monthlyPayment,
  setMonthlyPayment,
  requiredSalary,
  setRequiredSalary,
  downPayment,
  setDownPayment,
  isAnnualSalary,
  setIsAnnualSalary,
  validationErrors,
  loanDuration,
  interestRate,
  debtRate,
  existingLoans,
  rentalIncome,
  rentalIncomePercentage,
}) => {
  const getFieldError = (fieldName: string) => {
    return validationErrors.find(error => error.field === fieldName)?.message;
  };

  // Calculate max down payment based on current mode and inputs
  const inputs = {
    propertyPrice,
    monthlyPayment,
    requiredSalary,
    downPayment,
    loanDuration,
    interestRate,
    debtRate,
    existingLoans,
    rentalIncome,
    rentalIncomePercentage,
  };
  const maxDownPayment = calculateMaxDownPayment(inputs, activeTab);

  const renderTabInputs = () => {
    switch (activeTab) {
      case 'property':
        return (
          <>
            <Input
              label="Prix du bien immobilier"
              value={propertyPrice}
              onChange={(value) => setPropertyPrice(parseInt(value.replace(/\s/g, '')) || 0)}
              type="currency"
              currency="€"
              error={getFieldError('propertyPrice')}
            />
            <Input
              label="Apport"
              value={downPayment}
              onChange={(value) => setDownPayment(parseInt(value.replace(/\s/g, '')) || 0)}
              type="currency"
              currency="€"
              error={getFieldError('downPayment')}
              max={maxDownPayment}
            />
          </>
        );

      case 'monthly':
        return (
          <>
            <Input
              label="Mensualité souhaitée"
              value={monthlyPayment}
              onChange={(value) => setMonthlyPayment(parseInt(value.replace(/\s/g, '')) || 0)}
              type="currency"
              currency="€"
              error={getFieldError('monthlyPayment')}
            />
            <Input
              label="Apport"
              value={downPayment}
              onChange={(value) => setDownPayment(parseInt(value.replace(/\s/g, '')) || 0)}
              type="currency"
              currency="€"
              error={getFieldError('downPayment')}
              max={maxDownPayment}
            />
          </>
        );

      case 'salary':
        return (
          <>
            <Input
              label={isAnnualSalary ? "Salaire net annuel" : "Salaire net mensuel"}
              value={isAnnualSalary ? requiredSalary * 12 : requiredSalary}
              onChange={(value) => {
                const numValue = parseInt(value.replace(/\s/g, '')) || 0;
                setRequiredSalary(isAnnualSalary ? numValue / 12 : numValue);
              }}
              type="currency"
              currency="€"
              error={getFieldError('requiredSalary')}
            />

            <Input
              label="Apport"
              value={downPayment}
              onChange={(value) => setDownPayment(parseInt(value.replace(/\s/g, '')) || 0)}
              type="currency"
              currency="€"
              error={getFieldError('downPayment')}
              max={maxDownPayment}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="input-section">
      {/* Salary Mode Toggle - Available in all modes */}
      <div className="salary-mode-section">
        <div className="salary-mode-toggle">
          <Button
            variant="secondary"
            active={!isAnnualSalary}
            onClick={() => setIsAnnualSalary(false)}
            aria-label="Salaire mensuel"
            aria-pressed={!isAnnualSalary}
          >
            Mensuel
          </Button>
          <Button
            variant="secondary"
            active={isAnnualSalary}
            onClick={() => setIsAnnualSalary(true)}
            aria-label="Salaire annuel"
            aria-pressed={isAnnualSalary}
          >
            Annuel
          </Button>
        </div>
      </div>

      {renderTabInputs()}
    </div>
  );
};

export default CalculatorInputs; 
