import React, { forwardRef } from 'react';
import { useMobileOptimization } from '../../hooks/useMobileOptimization';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, variant = 'default', className = '', ...props }, ref) => {
    const { deviceInfo } = useMobileOptimization();
    
    const getVariantClasses = () => {
      switch (variant) {
        case 'filled':
          return 'bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-purple-500 rounded-t-lg';
        case 'outlined':
          return 'border-2 border-gray-300 focus:border-purple-500 rounded-lg';
        default:
          return 'border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg';
      }
    };

    const getInputSize = () => {
      if (deviceInfo.isMobile) {
        return 'text-base'; // Evita zoom no iOS
      }
      return 'text-sm';
    };

    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">{icon}</div>
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              block w-full px-3 py-2 ${icon ? 'pl-10' : ''} ${getInputSize()}
              ${getVariantClasses()}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
              transition-colors duration-200
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, variant = 'default', className = '', ...props }, ref) => {
    const { deviceInfo } = useMobileOptimization();
    
    const getVariantClasses = () => {
      switch (variant) {
        case 'filled':
          return 'bg-gray-50 border-0 border-b-2 border-gray-300 focus:border-purple-500 rounded-t-lg';
        case 'outlined':
          return 'border-2 border-gray-300 focus:border-purple-500 rounded-lg';
        default:
          return 'border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg';
      }
    };

    const getTextareaSize = () => {
      if (deviceInfo.isMobile) {
        return 'text-base min-h-[120px]'; // Altura mínima para mobile
      }
      return 'text-sm min-h-[100px]';
    };

    return (
      <div className="space-y-2">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <textarea
          ref={ref}
          className={`
            block w-full px-3 py-2 ${getTextareaSize()}
            ${getVariantClasses()}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            transition-colors duration-200 resize-vertical
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-600 flex items-center">
            <span className="mr-1">⚠️</span>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const FormButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const { deviceInfo } = useMobileOptimization();
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'outline':
        return 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white';
      case 'ghost':
        return 'text-purple-500 hover:bg-purple-50';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-purple-500 hover:bg-purple-600 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-sm';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-2.5 text-base';
    }
  };

  const getTouchTarget = () => {
    if (deviceInfo.isMobile) {
      return 'min-h-[44px]'; // Touch target mínimo para mobile
    }
    return '';
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getTouchTarget()}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        icon && <span>{icon}</span>
      )}
      {children}
    </button>
  );
};
