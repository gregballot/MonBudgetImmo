import React, { memo } from 'react';
import Button from '../UI/Button/Button';
import Slider from '../UI/Slider/Slider';
import Input from '../UI/Input/Input';
import { CALCULATOR_DEFAULTS } from '../../helpers/constants';
import type { ValidationError } from '../../types';

interface CalculatorControlsProps {
  isAdvancedMode: boolean;
  setIsAdvancedMode: (value: boolean) => void;
  loanDuration: number;
  setLoanDuration: (value: number) => void;
  interestRate: number;
  setInterestRate: (value: number) => void;
  debtRate: number;
  setDebtRate: (value: number) => void;
  existingLoans: number;
  setExistingLoans: (value: number) => void;
  rentalIncome: number;
  setRentalIncome: (value: number) => void;
  rentalIncomePercentage: number;
  setRentalIncomePercentage: (value: number) => void;
  validationErrors: ValidationError[];
}

const CalculatorControls: React.FC<CalculatorControlsProps> = memo(({
  isAdvancedMode,
  setIsAdvancedMode,
  debtRate,
  setDebtRate,
  existingLoans,
  setExistingLoans,
  rentalIncome,
  setRentalIncome,
  rentalIncomePercentage,
  setRentalIncomePercentage,
  validationErrors,
}) => {
  return (
    <div className="advanced-inputs">
        <div className="advanced-header">
          <div className="advanced-header-left">
            <Button
              variant="secondary"
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              aria-label={isAdvancedMode ? "Masquer les paramètres avancés" : "Afficher les paramètres avancés"}
              className={`advanced-toggle-btn ${isAdvancedMode ? 'expanded' : 'collapsed'}`}
            >
              <span className="toggle-arrow">{isAdvancedMode ? "▼" : "▶"}</span> Paramètres avancés
            </Button>
            {!isAdvancedMode && (
              <div className="advanced-summary">
                <span className="summary-tag">Endettement: {debtRate}%</span>
                {existingLoans > 0 && (
                  <span className="summary-tag">Prêts: €{existingLoans.toLocaleString()}</span>
                )}
                {rentalIncome > 0 && (
                  <span className="summary-tag">Locatif: €{rentalIncome.toLocaleString()} ({rentalIncomePercentage}%)</span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setDebtRate(CALCULATOR_DEFAULTS.debtRate);
              setExistingLoans(CALCULATOR_DEFAULTS.existingLoans);
              setRentalIncome(CALCULATOR_DEFAULTS.rentalIncome);
              setRentalIncomePercentage(70);
            }}
            aria-label="Réinitialiser les paramètres avancés"
          >
            Réinitialiser
          </Button>
        </div>

        <div className={`advanced-content ${isAdvancedMode ? 'expanded' : 'collapsed'}`}>
          <Input
            label="Prêts existants (mensuel)"
            value={existingLoans}
            onChange={(value) => setExistingLoans(parseInt(value.replace(/\s/g, '')) || 0)}
            type="currency"
            currency="€"
            error={validationErrors.find(error => error.field === 'existingLoans')?.message}
          />

          <Slider
            label="Taux d'endettement"
            min={5}
            max={60}
            step={1}
            value={debtRate}
            onChange={setDebtRate}
            formatValue={(value) => `${value} %`}
          />

          <Input
            label="Revenus locatifs (mensuel)"
            value={rentalIncome}
            onChange={(value) => setRentalIncome(parseInt(value.replace(/\s/g, '')) || 0)}
            type="currency"
            currency="€"
            error={validationErrors.find(error => error.field === 'rentalIncome')?.message}
          />

          <Slider
            label="% des revenus locatifs pris en compte"
            min={0}
            max={100}
            step={5}
            value={rentalIncomePercentage}
            onChange={setRentalIncomePercentage}
            formatValue={(value) => `${value} %`}
          />
        </div>
      </div>
  );
});

CalculatorControls.displayName = 'CalculatorControls';

export default CalculatorControls;
