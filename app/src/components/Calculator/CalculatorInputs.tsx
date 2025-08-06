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
  isNetSalary: boolean;
  setIsNetSalary: (value: boolean) => void;
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
  isNetSalary,
  setIsNetSalary,
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
            <div className="salary-input-group">
              <div className="salary-input-header">
                <label className="form-label">Salaire</label>
                <div className="salary-toggles">
                  <div className="salary-period-toggle">
                    <Button
                      variant="secondary"
                      size="sm"
                      active={!isAnnualSalary}
                      onClick={() => setIsAnnualSalary(false)}
                      aria-label="Salaire mensuel"
                      aria-pressed={!isAnnualSalary}
                    >
                      Mensuel
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      active={isAnnualSalary}
                      onClick={() => setIsAnnualSalary(true)}
                      aria-label="Salaire annuel"
                      aria-pressed={isAnnualSalary}
                    >
                      Annuel
                    </Button>
                  </div>
                  <div className="salary-type-toggle">
                    <Button
                      variant="secondary"
                      size="sm"
                      active={isNetSalary}
                      onClick={() => setIsNetSalary(true)}
                      aria-label="Salaire net"
                      aria-pressed={isNetSalary}
                    >
                      Net
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      active={!isNetSalary}
                      onClick={() => setIsNetSalary(false)}
                      aria-label="Salaire brut"
                      aria-pressed={!isNetSalary}
                    >
                      Brut
                    </Button>
                  </div>
                </div>
              </div>
              <Input
                label=""
                value={(() => {
                  let displayValue = isAnnualSalary ? requiredSalary * 12 : requiredSalary;
                  // Convert net to brut if needed (net * 1.3 ≈ brut)
                  if (!isNetSalary) {
                    displayValue = displayValue * 1.3;
                  }
                  return displayValue;
                })()}
                onChange={(value) => {
                  let numValue = parseInt(value.replace(/\s/g, '')) || 0;
                  // Convert brut to net if needed (brut / 1.3 ≈ net)
                  if (!isNetSalary) {
                    numValue = numValue / 1.3;
                  }
                  setRequiredSalary(isAnnualSalary ? numValue / 12 : numValue);
                }}
                type="currency"
                currency="€"
                error={getFieldError('requiredSalary')}
              />
            </div>

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


      {renderTabInputs()}
    </div>
  );
};

export default CalculatorInputs;
