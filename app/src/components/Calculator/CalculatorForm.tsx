import React, { memo } from 'react';
import Tabs from '../UI/Tabs/Tabs';
import Slider from '../UI/Slider/Slider';
import CalculatorInputs from './CalculatorInputs';
import CalculatorControls from './CalculatorControls';
import { CALCULATOR_TABS, CALCULATOR_CONSTANTS } from '../../helpers/constants';
import type { CalculatorState } from '../../hooks/useCalculatorState';

interface CalculatorFormProps {
  state: CalculatorState;
  actions: {
    setActiveTab: (tab: 'property' | 'monthly' | 'salary') => void;
    setPropertyPrice: (price: number) => void;
    setMonthlyPayment: (payment: number) => void;
    setRequiredSalary: (salary: number) => void;
    setDownPayment: (payment: number) => void;
    setLoanDuration: (duration: number) => void;
    setInterestRate: (rate: number) => void;
    setAdvancedMode: (isAdvanced: boolean) => void;
    setDebtRate: (rate: number) => void;
    setExistingLoans: (loans: number) => void;
    setRentalIncome: (income: number) => void;
    setRentalIncomePercentage: (percentage: number) => void;
    setIsAnnualSalary: (isAnnual: boolean) => void;
    setIsNetSalary: (isNet: boolean) => void;
    resetAdvancedSettings: () => void;
  };
}

const CalculatorForm: React.FC<CalculatorFormProps> = memo(({ state, actions }) => {
  return (
    <>
      <Tabs
        tabs={CALCULATOR_TABS}
        activeTab={state.activeTab}
        onTabChange={(tabId) => actions.setActiveTab(tabId as 'property' | 'monthly' | 'salary')}
      />

      <div className="calculator-inputs">
        <CalculatorInputs
          activeTab={state.activeTab}
          propertyPrice={state.propertyPrice}
          setPropertyPrice={actions.setPropertyPrice}
          monthlyPayment={state.monthlyPayment}
          setMonthlyPayment={actions.setMonthlyPayment}
          requiredSalary={state.requiredSalary}
          setRequiredSalary={actions.setRequiredSalary}
          downPayment={state.downPayment}
          setDownPayment={actions.setDownPayment}
          isAnnualSalary={state.isAnnualSalary}
          setIsAnnualSalary={actions.setIsAnnualSalary}
          isNetSalary={state.isNetSalary}
          setIsNetSalary={actions.setIsNetSalary}
          validationErrors={state.validationErrors}
          loanDuration={state.loanDuration}
          interestRate={state.interestRate}
          debtRate={state.debtRate}
          existingLoans={state.existingLoans}
          rentalIncome={state.rentalIncome}
          rentalIncomePercentage={state.rentalIncomePercentage}
        />

        <div className="basic-controls">
          <Slider
            label="Durée du prêt"
            min={CALCULATOR_CONSTANTS.MIN_LOAN_DURATION}
            max={CALCULATOR_CONSTANTS.MAX_LOAN_DURATION}
            step={1}
            value={state.loanDuration}
            onChange={actions.setLoanDuration}
            formatValue={(value) => `${value} ans`}
          />

          <Slider
            label="Taux d'intérêt"
            min={CALCULATOR_CONSTANTS.MIN_INTEREST_RATE}
            max={CALCULATOR_CONSTANTS.MAX_INTEREST_RATE}
            step={0.1}
            value={state.interestRate}
            onChange={actions.setInterestRate}
            formatValue={(value) => `${value.toFixed(CALCULATOR_CONSTANTS.DECIMAL_PRECISION)} %`}
          />
        </div>
      </div>

      {/* Advanced panel - spans full width */}
      <div className="calculator-advanced-wrapper">
        <div className={`calculator-advanced ${state.isAdvancedMode ? 'expanded' : 'collapsed'}`}>
          <CalculatorControls
            isAdvancedMode={state.isAdvancedMode}
            setIsAdvancedMode={actions.setAdvancedMode}
            loanDuration={state.loanDuration}
            setLoanDuration={actions.setLoanDuration}
            interestRate={state.interestRate}
            setInterestRate={actions.setInterestRate}
            debtRate={state.debtRate}
            setDebtRate={actions.setDebtRate}
            existingLoans={state.existingLoans}
            setExistingLoans={actions.setExistingLoans}
            rentalIncome={state.rentalIncome}
            setRentalIncome={actions.setRentalIncome}
            rentalIncomePercentage={state.rentalIncomePercentage}
            setRentalIncomePercentage={actions.setRentalIncomePercentage}
            validationErrors={state.validationErrors}
          />
        </div>
      </div>
    </>
  );
});

CalculatorForm.displayName = 'CalculatorForm';

export default CalculatorForm;