import React from 'react';
import './Input.scss';

interface InputProps {
  value: string | number;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'currency';
  currency?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  max?: number;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  currency = '€',
  disabled = false,
  error,
  className = '',
  max,
  id,
}) => {
  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (!numericValue) return '';
    
    const number = parseInt(numericValue, 10);
    return number.toLocaleString('fr-FR');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (type === 'currency') {
      newValue = formatCurrency(newValue);
    }
    
    // Apply max constraint if specified
    if (max !== undefined && type === 'currency') {
      const numericValue = parseInt(newValue.replace(/[^\d]/g, ''), 10);
      if (!isNaN(numericValue) && numericValue > max) {
        newValue = max.toLocaleString('fr-FR');
      }
    }
    
    onChange(newValue);
  };

  const inputValue = type === 'currency' && typeof value === 'number' 
    ? value.toLocaleString('fr-FR') 
    : value;

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`input-container ${className}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input
          id={inputId}
          type={type === 'currency' ? 'text' : type}
          value={type === 'currency' ? `${currency} ${inputValue}` : inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field ${error ? 'input-error' : ''} ${type === 'currency' ? 'input-currency' : ''}`}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input; 
