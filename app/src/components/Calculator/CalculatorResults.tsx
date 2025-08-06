import React from 'react';
import { formatCurrency, formatCurrencyPerMonth } from '../../helpers/formatters';
import type { CalculationMode, CalculationResult } from '../../helpers/Calculator';

interface AnimatedValue {
  current: number;
  target: number;
  isAnimating: boolean;
}

interface CalculatorResultsProps {
  animatedValues: Record<keyof CalculationResult, AnimatedValue>;
  activeTab: CalculationMode;
  setActiveTab: (mode: CalculationMode) => void;
  isAnnualSalary: boolean;
  setPropertyPrice: (value: number) => void;
  setMonthlyPayment: (value: number) => void;
  setRequiredSalary: (value: number) => void;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({
  animatedValues,
  activeTab,
  setActiveTab,
  isAnnualSalary,
  setPropertyPrice,
  setMonthlyPayment,
  setRequiredSalary,
}) => {
  const resultItems = [
    {
      label: 'Mensualité estimée',
      value: animatedValues.monthlyPayment.current,
      formatter: formatCurrencyPerMonth,
      isHighlight: true,
      isAnimating: animatedValues.monthlyPayment.isAnimating,
      clickable: true,
      targetMode: 'monthly' as CalculationMode,
    },
    {
      label: 'Prix du bien',
      value: animatedValues.propertyPrice.current,
      formatter: formatCurrency,
      isHighlight: false,
      isAnimating: animatedValues.propertyPrice.isAnimating,
      clickable: true,
      targetMode: 'property' as CalculationMode,
    },
    {
      label: 'Salaire brut',
      value: isAnnualSalary ? animatedValues.grossSalary.current * 12 : animatedValues.grossSalary.current,
      formatter: (value: number) => {
        const formattedValue = value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        return isAnnualSalary ? `${formattedValue} € / an` : `${formattedValue} € / mois`;
      },
      isHighlight: false,
      isAnimating: animatedValues.grossSalary.isAnimating,
      clickable: true,
      targetMode: 'salary' as CalculationMode,
    },
    {
      label: 'Salaire net requis',
      value: isAnnualSalary ? animatedValues.requiredSalary.current * 12 : animatedValues.requiredSalary.current,
      formatter: (value: number) => {
        const formattedValue = value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        return isAnnualSalary ? `${formattedValue} € / an` : `${formattedValue} € / mois`;
      },
      isHighlight: false,
      isAnimating: animatedValues.requiredSalary.isAnimating,
      clickable: true,
      targetMode: 'salary' as CalculationMode,
    },
    {
      label: 'Frais de notaire',
      value: animatedValues.notaryFees.current,
      formatter: formatCurrency,
      isHighlight: false,
      isAnimating: animatedValues.notaryFees.isAnimating,
      clickable: false,
      targetMode: null,
    },
    {
      label: 'Coût total d\'acquisition',
      value: animatedValues.totalPurchaseCost.current,
      formatter: formatCurrency,
      isHighlight: false,
      isAnimating: animatedValues.totalPurchaseCost.isAnimating,
      clickable: false,
      targetMode: null,
    },
    {
      label: 'Montant du prêt',
      value: animatedValues.loanAmount.current,
      formatter: formatCurrency,
      isHighlight: false,
      isAnimating: animatedValues.loanAmount.isAnimating,
      clickable: false,
      targetMode: null,
    },
    {
      label: 'Coût total du crédit',
      value: animatedValues.totalCost.current,
      formatter: formatCurrency,
      isHighlight: false,
      isAnimating: animatedValues.totalCost.isAnimating,
      clickable: false,
      targetMode: null,
    },
    {
      label: 'Coût total de l\'opération',
      value: animatedValues.totalOperationCost.current,
      formatter: formatCurrency,
      isHighlight: false,
      isAnimating: animatedValues.totalOperationCost.isAnimating,
      clickable: false,
      targetMode: null,
    },
  ];

  const handleResultClick = (item: typeof resultItems[0]) => {
    if (item.clickable && item.targetMode && item.targetMode !== activeTab) {
      setActiveTab(item.targetMode);

      // Update the corresponding input field with the clicked value
      switch (item.targetMode) {
        case 'property':
          setPropertyPrice(Math.round(item.value));
          break;
        case 'monthly':
          setMonthlyPayment(Math.round(item.value));
          break;
        case 'salary': {
          const salaryValue = isAnnualSalary ? item.value / 12 : item.value;
          setRequiredSalary(Math.round(salaryValue));
          break;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: typeof resultItems[0]) => {
    if (item.clickable && item.targetMode && item.targetMode !== activeTab && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleResultClick(item);
    }
  };

  return (
    <div className="calculator-results">
      <h3 className="results-title">Votre simulation</h3>
      <div className="results-grid">
        {resultItems.map((item, index) => (
          <div
            key={index}
            className={`result-item ${item.clickable ? 'clickable' : ''}`}
            onClick={() => handleResultClick(item)}
            role={item.clickable ? 'button' : undefined}
            tabIndex={item.clickable ? 0 : undefined}
            onKeyDown={(e) => handleKeyDown(e, item)}
          >
            <span className="result-label">{item.label}</span>
            <span className={`result-value ${item.isHighlight ? 'result-highlight' : ''} ${item.isAnimating ? 'animating' : ''}`}>
              {item.formatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorResults;
