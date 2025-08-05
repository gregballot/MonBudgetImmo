import { useState, useEffect, useRef, useCallback } from 'react';
import type { CalculationResult } from '../helpers/Calculator';

interface AnimatedValue {
  current: number;
  target: number;
  isAnimating: boolean;
}

export const useCalculatorAnimation = (results: CalculationResult) => {
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

  return animatedValues;
}; 
