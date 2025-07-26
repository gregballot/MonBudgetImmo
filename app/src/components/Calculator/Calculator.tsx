import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tabs from '../UI/Tabs/Tabs';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Slider from '../UI/Slider/Slider';
import { useCalculator } from '../../helpers/useCalculator';
import { formatCurrency, formatCurrencyPerMonth } from '../../helpers/formatters';
import { LOAN_DURATION_OPTIONS, CALCULATOR_TABS, CALCULATOR_DEFAULTS } from '../../helpers/constants';
import { validateCalculatorInputs, calculateMaxDownPayment } from '../../utils/validation';
import type { CalculationMode, CalculationResult } from '../../helpers/Calculator';
import type { ValidationError } from '../../types';
import './Calculator.scss';

interface AnimatedValue {
  current: number;
  target: number;
  isAnimating: boolean;
}

const Calculator: React.FC = () => {
  // Local state for inputs
  const [activeTab, setActiveTab] = useState<CalculationMode>('property');
  const [propertyPrice, setPropertyPrice] = useState(CALCULATOR_DEFAULTS.propertyPrice);
  const [monthlyPayment, setMonthlyPayment] = useState(CALCULATOR_DEFAULTS.monthlyPayment);
  const [requiredSalary, setRequiredSalary] = useState(CALCULATOR_DEFAULTS.requiredSalary);
  const [downPayment, setDownPayment] = useState(CALCULATOR_DEFAULTS.downPayment);
  const [loanDuration, setLoanDuration] = useState(CALCULATOR_DEFAULTS.loanDuration);
  const [interestRate, setInterestRate] = useState(CALCULATOR_DEFAULTS.interestRate);

  // Hook for calculation results
  const { results, updateCalculation } = useCalculator();

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Animation state
  const [animatedValues, setAnimatedValues] = useState<Record<keyof CalculationResult, AnimatedValue>>({
    monthlyPayment: { current: 0, target: 0, isAnimating: false },
    requiredSalary: { current: 0, target: 0, isAnimating: false },
    totalCost: { current: 0, target: 0, isAnimating: false },
    propertyPrice: { current: 0, target: 0, isAnimating: false },
    loanAmount: { current: 0, target: 0, isAnimating: false },
    notaryFees: { current: 0, target: 0, isAnimating: false },
    totalPurchaseCost: { current: 0, target: 0, isAnimating: false },
  });

  const animationRef = useRef<number | undefined>(undefined);
  const animatedValuesRef = useRef(animatedValues);
  const previousResultsRef = useRef<CalculationResult | null>(null);

  // Update ref when animatedValues changes
  useEffect(() => {
    animatedValuesRef.current = animatedValues;
  }, [animatedValues]);

  // Animation function
  const animateValue = useCallback((key: keyof CalculationResult, target: number) => {
    const currentValue = animatedValuesRef.current[key].current;
    const startTime = performance.now();
    const duration = 500; // 0.5 seconds
    const startValue = currentValue;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeOut = 1 - Math.pow(1 - progress, 2);
      const currentValue = startValue + (target - startValue) * easeOut;
      
      setAnimatedValues(prev => ({
        ...prev,
        [key]: {
          current: currentValue,
          target: target,
          isAnimating: progress < 1
        }
      }));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Ensure final value is exact
        setAnimatedValues(prev => ({
          ...prev,
          [key]: {
            current: target,
            target: target,
            isAnimating: false
          }
        }));
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Update calculations when inputs change
  useEffect(() => {
    const inputs = {
      propertyPrice,
      monthlyPayment,
      requiredSalary,
      downPayment,
      loanDuration,
      interestRate,
    };

    // Validate inputs
    const errors = validateCalculatorInputs(inputs, activeTab);
    setValidationErrors(errors);

    // Only update calculation if there are no validation errors
    if (errors.length === 0) {
      updateCalculation(inputs, activeTab);
    }
  }, [propertyPrice, monthlyPayment, requiredSalary, downPayment, loanDuration, interestRate, activeTab, updateCalculation]);

  // Animate results when they change
  useEffect(() => {
    // Only animate if we have previous results and they're different
    if (previousResultsRef.current) {
      Object.keys(results).forEach((key) => {
        const resultKey = key as keyof CalculationResult;
        const targetValue = results[resultKey];
        const previousValue = previousResultsRef.current![resultKey];
        
        // Only animate if the value actually changed
        if (Math.abs(targetValue - previousValue) > 0.01) {
          animateValue(resultKey, targetValue);
        }
      });
    } else {
      // First time - animate all values
      Object.keys(results).forEach((key) => {
        const resultKey = key as keyof CalculationResult;
        animateValue(resultKey, results[resultKey]);
      });
    }
    
    // Update previous results
    previousResultsRef.current = { ...results };
  }, [results, animateValue]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const renderInputs = () => {
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
    };
    const maxDownPayment = calculateMaxDownPayment(inputs, activeTab);

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
              label="Salaire net mensuel"
              value={requiredSalary}
              onChange={(value) => setRequiredSalary(parseInt(value.replace(/\s/g, '')) || 0)}
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

  const renderResults = () => {
    const resultItems = [
      {
        label: 'Mensualité estimée',
        value: animatedValues.monthlyPayment.current,
        formatter: formatCurrencyPerMonth,
        isHighlight: true,
        isAnimating: animatedValues.monthlyPayment.isAnimating,
      },
      {
        label: 'Salaire net requis',
        value: animatedValues.requiredSalary.current,
        formatter: formatCurrencyPerMonth,
        isHighlight: false,
        isAnimating: animatedValues.requiredSalary.isAnimating,
      },
      {
        label: 'Prix du bien',
        value: animatedValues.propertyPrice.current,
        formatter: formatCurrency,
        isHighlight: false,
        isAnimating: animatedValues.propertyPrice.isAnimating,
      },
      {
        label: 'Frais de notaire',
        value: animatedValues.notaryFees.current,
        formatter: formatCurrency,
        isHighlight: false,
        isAnimating: animatedValues.notaryFees.isAnimating,
      },
      {
        label: 'Coût total d\'acquisition',
        value: animatedValues.totalPurchaseCost.current,
        formatter: formatCurrency,
        isHighlight: false,
        isAnimating: animatedValues.totalPurchaseCost.isAnimating,
      },
      {
        label: 'Montant du prêt',
        value: animatedValues.loanAmount.current,
        formatter: formatCurrency,
        isHighlight: false,
        isAnimating: animatedValues.loanAmount.isAnimating,
      },
      {
        label: 'Coût total du crédit',
        value: animatedValues.totalCost.current,
        formatter: formatCurrency,
        isHighlight: false,
        isAnimating: animatedValues.totalCost.isAnimating,
      },
    ];

    return resultItems.map((item, index) => (
      <div key={index} className="result-item">
        <span className="result-label">{item.label}</span>
        <span className={`result-value ${item.isHighlight ? 'result-highlight' : ''} ${item.isAnimating ? 'animating' : ''}`}>
          {item.formatter(item.value)}
        </span>
      </div>
    ));
  };

  return (
    <div className="calculator-container">
      <Tabs 
        tabs={CALCULATOR_TABS} 
        activeTab={activeTab} 
        onTabChange={(tabId) => setActiveTab(tabId as CalculationMode)} 
      />

      <div className="calculator-inputs">
        <div className="input-section">
          {renderInputs()}
        </div>

        <div className="controls-section">
          <div className="duration-section">
            <label className="duration-label">Durée du prêt</label>
            <div className="duration-buttons">
              {LOAN_DURATION_OPTIONS.map((duration) => (
                <Button
                  key={duration}
                  variant="secondary"
                  active={loanDuration === duration}
                  onClick={() => setLoanDuration(duration)}
                >
                  {duration} ans
                </Button>
              ))}
            </div>
          </div>

          <Slider
            label="Taux d'intérêt"
            min={0.5}
            max={8}
            step={0.1}
            value={interestRate}
            onChange={setInterestRate}
            formatValue={(value) => `${value.toFixed(2)} %`}
          />
        </div>
      </div>

      <div className="calculator-results">
        <h3 className="results-title">Votre simulation</h3>
        <div className="results-grid">
          {renderResults()}
        </div>
      </div>
    </div>
  );
};

export default Calculator; 
