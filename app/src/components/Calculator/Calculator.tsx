import React, { useState, useEffect, useRef, useCallback } from 'react';
import Tabs from '../UI/Tabs/Tabs';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Slider from '../UI/Slider/Slider';
import { useCalculator } from '../../helpers/useCalculator';
import { usePersistentState } from '../../hooks/usePersistentState';
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
      debtRate,
      existingLoans,
      rentalIncome,
      rentalIncomePercentage,
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

  const renderResults = () => {
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
        label: 'Prix du bien',
        value: animatedValues.propertyPrice.current,
        formatter: formatCurrency,
        isHighlight: false,
        isAnimating: animatedValues.propertyPrice.isAnimating,
        clickable: true,
        targetMode: 'property' as CalculationMode,
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
    ];

    return resultItems.map((item, index) => (
      <div
        key={index}
        className={`result-item ${item.clickable ? 'clickable' : ''}`}
        onClick={() => {
          if (item.clickable && item.targetMode && item.targetMode !== activeTab) {
            setActiveTab(item.targetMode);

            // Update the first input field with the card value
            switch (item.targetMode) {
              case 'property':
                setPropertyPrice(Math.round(item.value));
                break;
              case 'monthly':
                setMonthlyPayment(Math.round(item.value));
                break;
              case 'salary':
                const salaryValue = isAnnualSalary ? item.value / 12 : item.value;
                setRequiredSalary(Math.round(salaryValue));
                break;
            }
          }
        }}
        role={item.clickable ? 'button' : undefined}
        tabIndex={item.clickable ? 0 : undefined}
        onKeyDown={(e) => {
          if (item.clickable && item.targetMode && item.targetMode !== activeTab && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setActiveTab(item.targetMode);

            // Update the first input field with the card value
            switch (item.targetMode) {
              case 'property':
                setPropertyPrice(Math.round(item.value));
                break;
              case 'monthly':
                setMonthlyPayment(Math.round(item.value));
                break;
              case 'salary':
                const salaryValue = isAnnualSalary ? item.value / 12 : item.value;
                setRequiredSalary(Math.round(salaryValue));
                break;
            }
          }
        }}
      >
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

          {renderInputs()}
        </div>

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
