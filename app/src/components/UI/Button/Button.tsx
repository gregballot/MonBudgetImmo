import React from 'react';
import './Button.scss';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  active = false,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${active ? 'btn-active' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
};

export default Button;
