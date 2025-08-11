import React from 'react';
import { usePersistentCalculatorState } from '../../hooks/usePersistentCalculatorState';
import { useCalculatorAnimation } from '../../hooks/useCalculatorAnimation';
import CalculatorForm from './CalculatorForm';
import CalculatorResults from './CalculatorResults';
import './Calculator.scss';

const Calculator: React.FC = () => {
  // Use the centralized state management hook
  const { state, actions } = usePersistentCalculatorState();
  
  // Animation hook
  const animatedValues = useCalculatorAnimation(state.results);







  return (
    <div className="calculator-container">
      <CalculatorForm state={state} actions={actions} />
      
      <CalculatorResults
        animatedValues={animatedValues}
        activeTab={state.activeTab}
        setActiveTab={actions.setActiveTab}
        isAnnualSalary={state.isAnnualSalary}
        setPropertyPrice={actions.setPropertyPrice}
        setMonthlyPayment={actions.setMonthlyPayment}
        setRequiredSalary={actions.setRequiredSalary}
      />
    </div>
  );
};

export default Calculator;
