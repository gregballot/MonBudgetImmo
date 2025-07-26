import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Slider.scss';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 0.1,
  value,
  onChange,
  label,
  showValue = true,
  formatValue = (val) => `${val.toFixed(2)} %`,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTooltipFading, setIsTooltipFading] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent default to avoid text selection
    setIsDragging(true);
    setIsDirectInput(false);
    setShowTooltip(true);
    handlePointerMove(e);
  };

  const handlePointerMove = useCallback((e: PointerEvent | React.PointerEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const newValue = min + (max - min) * percentage;
    
    // Only apply step constraint when dragging, not when setting from direct input
    if (isDirectInput) {
      const roundedValue = Math.round(newValue * 100) / 100;
      onChange(Math.max(min, Math.min(max, roundedValue)));
    } else {
      const steppedValue = Math.round(newValue / step) * step;
      const roundedValue = Math.round(steppedValue * 100) / 100;
      onChange(Math.max(min, Math.min(max, roundedValue)));
    }
  }, [isDragging, min, max, step, onChange, isDirectInput]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    // Hide tooltip after a short delay
    setTimeout(() => {
      setIsTooltipFading(true);
      // Remove tooltip from DOM after animation completes
      setTimeout(() => {
        setShowTooltip(false);
        setIsTooltipFading(false);
      }, 300);
    }, 2000);
  }, []);

  // Legacy mouse event handlers for backward compatibility - removed unused handlers

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Update edit value when slider value changes
  useEffect(() => {
    // Round to 2 decimal places to avoid floating-point precision issues
    const roundedValue = Math.round(value * 100) / 100;
    setEditValue(roundedValue.toString());
  }, [value]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleValueClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Limit to 2 decimal places
    const decimalRegex = /^\d*\.?\d{0,2}$/;
    if (decimalRegex.test(value) || value === '') {
      setEditValue(value);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      // For direct input, don't force step rounding - only round to 2 decimal places
      const roundedValue = Math.round(numValue * 100) / 100;
      setIsDirectInput(true);
      onChange(Math.max(min, Math.min(max, roundedValue)));
      // Reset the flag after a short delay to allow the slider position to update
      setTimeout(() => setIsDirectInput(false), 100);
    } else {
      setEditValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`slider-container ${className}`}>
      {label && <label className="slider-label">{label}</label>}
      <div className="slider-wrapper">
        {showValue && (
          isEditing ? (
            <input
              ref={inputRef}
              type="number"
              className="slider-input"
              value={editValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              min={min}
              max={max}
              step={step}
            />
          ) : (
            <span 
              className="slider-value clickable"
              onClick={handleValueClick}
              title="Cliquez pour modifier directement"
            >
              {formatValue(value)}
            </span>
          )
        )}
        <div
          ref={sliderRef}
          className="slider-track"
          onPointerDown={handlePointerDown}
        >
          <div 
            className="slider-fill" 
            style={{ width: `${percentage}%` }}
          />
          <div 
            className="slider-thumb"
            style={{ left: `${percentage}%` }}
          />
        </div>
        {showTooltip && (
          <div className={`slider-tooltip ${isTooltipFading ? 'fade-out' : ''}`}>
            💡 Cliquez sur la valeur pour la modifier directement
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider; 
