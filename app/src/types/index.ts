// Global application types
export interface AppError {
  id: string;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: AppError;
}

// Form types
export interface FormField {
  value: string | number;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// Animation types
export interface AnimatedValue {
  current: number;
  target: number;
  isAnimating: boolean;
}

// UI Component types
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

export interface ClickableProps {
  onClick?: () => void;
  disabled?: boolean;
}

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: {
      light: string;
      medium: string;
      dark: string;
    };
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
