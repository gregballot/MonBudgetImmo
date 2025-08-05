import React from 'react';
import Button from '../UI/Button/Button';
import Slider from '../UI/Slider/Slider';
import Input from '../UI/Input/Input';
import { LOAN_DURATION_OPTIONS, CALCULATOR_DEFAULTS } from '../../helpers/constants';
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

const CalculatorControls: React.FC<CalculatorControlsProps> = ({
  isAdvancedMode,
  setIsAdvancedMode,
  loanDuration,
  setLoanDuration,
  interestRate,
  setInterestRate,
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
    <div className="controls-section">
      {/* Advanced Mode Toggle */}
      <div className="advanced-mode-section">
        <div className="advanced-mode-toggle">
          <Button
            variant="secondary"
            active={!isAdvancedMode}
            onClick={() => setIsAdvancedMode(false)}
            aria-label="Mode simple"
            aria-pressed={!isAdvancedMode}
          >
            Mode simple
          </Button>
          <Button
            variant="secondary"
            active={isAdvancedMode}
            onClick={() => setIsAdvancedMode(true)}
            aria-label="Mode avancé"
            aria-pressed={isAdvancedMode}
          >
            Mode avancé
          </Button>
        </div>
      </div>

      <fieldset className="duration-section">
        <legend className="duration-label">Durée du prêt</legend>
        <div className="duration-buttons" role="radiogroup">
          {LOAN_DURATION_OPTIONS.map((duration) => (
            <Button
              key={duration}
              variant="secondary"
              active={loanDuration === duration}
              onClick={() => setLoanDuration(duration)}
              aria-label={`Durée du prêt: ${duration} ans`}
              aria-pressed={loanDuration === duration}
            >
              {duration} ans
            </Button>
          ))}
        </div>
      </fieldset>

      <Slider
        label="Taux d'intérêt"
        min={0.1}
        max={15}
        step={0.1}
        value={interestRate}
        onChange={setInterestRate}
        formatValue={(value) => `${value.toFixed(2)} %`}
      />

      {/* Advanced Mode Inputs */}
      {isAdvancedMode && (
        <div className="advanced-inputs">
          <div className="advanced-header">
            <h4>Paramètres avancés</h4>
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
            label="Prêts existants (mensuel)"
            value={existingLoans}
            onChange={(value) => setExistingLoans(parseInt(value.replace(/\s/g, '')) || 0)}
            type="currency"
            currency="€"
            error={validationErrors.find(error => error.field === 'existingLoans')?.message}
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
      )}
    </div>
  );
};

export default CalculatorControls; 
