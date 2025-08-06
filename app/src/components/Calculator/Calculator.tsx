import React, { useState, useEffect } from 'react';
import Tabs from '../UI/Tabs/Tabs';
import Button from '../UI/Button/Button';
import Slider from '../UI/Slider/Slider';
import { useCalculator } from '../../helpers/useCalculator';
import { usePersistentState } from '../../hooks/usePersistentState';
import { CALCULATOR_TABS, CALCULATOR_DEFAULTS, LOAN_DURATION_OPTIONS } from '../../helpers/constants';
import { validateCalculatorInputs } from '../../utils/validation';
import { useCalculatorAnimation } from '../../hooks/useCalculatorAnimation';
import CalculatorInputs from './CalculatorInputs';
import CalculatorControls from './CalculatorControls';
import CalculatorResults from './CalculatorResults';
import type { CalculationMode } from '../../helpers/Calculator';
import type { ValidationError } from '../../types';
import './Calculator.scss';

const Calculator: React.FC = () => {
  // Persistent state for inputs
  const [activeTab, setActiveTab] = usePersistentState<CalculationMode>('calculator-activeTab', 'property');
  const [propertyPrice, setPropertyPrice] = usePersistentState('calculator-propertyPrice', CALCULATOR_DEFAULTS.propertyPrice);
  const [monthlyPayment, setMonthlyPayment] = usePersistentState('calculator-monthlyPayment', CALCULATOR_DEFAULTS.monthlyPayment);
  const [requiredSalary, setRequiredSalary] = usePersistentState('calculator-requiredSalary', CALCULATOR_DEFAULTS.requiredSalary);
  const [downPayment, setDownPayment] = usePersistentState('calculator-downPayment', CALCULATOR_DEFAULTS.downPayment);
  const [loanDuration, setLoanDuration] = usePersistentState('calculator-loanDuration', CALCULATOR_DEFAULTS.loanDuration);
  const [interestRate, setInterestRate] = usePersistentState('calculator-interestRate', CALCULATOR_DEFAULTS.interestRate);

  // Advanced mode state
  const [isAdvancedMode, setIsAdvancedMode] = usePersistentState('calculator-isAdvancedMode', false);
  const [debtRate, setDebtRate] = usePersistentState('calculator-debtRate', CALCULATOR_DEFAULTS.debtRate);
  const [existingLoans, setExistingLoans] = usePersistentState('calculator-existingLoans', CALCULATOR_DEFAULTS.existingLoans);
  const [rentalIncome, setRentalIncome] = usePersistentState('calculator-rentalIncome', CALCULATOR_DEFAULTS.rentalIncome);
  const [rentalIncomePercentage, setRentalIncomePercentage] = usePersistentState('calculator-rentalIncomePercentage', 70);

  // Salary mode state
  const [isAnnualSalary, setIsAnnualSalary] = usePersistentState('calculator-isAnnualSalary', CALCULATOR_DEFAULTS.isAnnualSalary);
  const [isNetSalary, setIsNetSalary] = usePersistentState('calculator-isNetSalary', true);

  // Hook for calculation results
  const { results, updateCalculation } = useCalculator();

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);



  // Animation hook
  const animatedValues = useCalculatorAnimation(results);



  // Update calculations when inputs change
  useEffect(() => {
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

    // Validate inputs
    const errors = validateCalculatorInputs(inputs);
    setValidationErrors(errors);

    // Only update calculation if there are no validation errors
    if (errors.length === 0) {
      updateCalculation(inputs, activeTab);
    }
  }, [propertyPrice, monthlyPayment, requiredSalary, downPayment, loanDuration, interestRate, debtRate, existingLoans, rentalIncome, rentalIncomePercentage, activeTab, updateCalculation]);



  return (
    <div className="calculator-container">
      <Tabs
        tabs={CALCULATOR_TABS}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as CalculationMode)}
      />

      <div className="calculator-inputs">
        <CalculatorInputs
          activeTab={activeTab}
          propertyPrice={propertyPrice}
          setPropertyPrice={setPropertyPrice}
          monthlyPayment={monthlyPayment}
          setMonthlyPayment={setMonthlyPayment}
          requiredSalary={requiredSalary}
          setRequiredSalary={setRequiredSalary}
          downPayment={downPayment}
          setDownPayment={setDownPayment}
          isAnnualSalary={isAnnualSalary}
          setIsAnnualSalary={setIsAnnualSalary}
          isNetSalary={isNetSalary}
          setIsNetSalary={setIsNetSalary}
          validationErrors={validationErrors}
          loanDuration={loanDuration}
          interestRate={interestRate}
          debtRate={debtRate}
          existingLoans={existingLoans}
          rentalIncome={rentalIncome}
          rentalIncomePercentage={rentalIncomePercentage}
        />

        <div className="basic-controls">
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
        </div>
      </div>

      {/* Advanced panel - spans full width */}
      <div className="calculator-advanced-wrapper">
        <div className={`calculator-advanced ${isAdvancedMode ? 'expanded' : 'collapsed'}`}>
          <CalculatorControls
            isAdvancedMode={isAdvancedMode}
            setIsAdvancedMode={setIsAdvancedMode}
            loanDuration={loanDuration}
            setLoanDuration={setLoanDuration}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            debtRate={debtRate}
            setDebtRate={setDebtRate}
            existingLoans={existingLoans}
            setExistingLoans={setExistingLoans}
            rentalIncome={rentalIncome}
            setRentalIncome={setRentalIncome}
            rentalIncomePercentage={rentalIncomePercentage}
            setRentalIncomePercentage={setRentalIncomePercentage}
            validationErrors={validationErrors}
          />
        </div>
      </div>

      <CalculatorResults
        animatedValues={animatedValues}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAnnualSalary={isAnnualSalary}
        setPropertyPrice={setPropertyPrice}
        setMonthlyPayment={setMonthlyPayment}
        setRequiredSalary={setRequiredSalary}

      />
    </div>
  );
};

export default Calculator;
