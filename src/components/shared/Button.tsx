import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'kawaii';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
  outline: 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white',
  ghost: 'text-purple-500 hover:bg-purple-50',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  kawaii: 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
};

const sizeClasses = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && leftIcon && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Botões específicos para diferentes contextos
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="primary" {...props} />
));

export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="secondary" {...props} />
));

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="outline" {...props} />
));

export const GhostButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="ghost" {...props} />
));

export const DangerButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="danger" {...props} />
));

export const KawaiiButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="kawaii" {...props} />
));

// Botão de ação flutuante
interface FloatingActionButtonProps extends Omit<ButtonProps, 'size' | 'fullWidth'> {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(({
  position = 'bottom-right',
  className = '',
  ...props
}, ref) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <Button
      ref={ref}
      size="lg"
      className={`
        fixed z-40 rounded-full w-14 h-14 p-0 shadow-2xl hover:shadow-3xl
        ${positionClasses[position]}
        ${className}
      `}
      {...props}
    />
  );
});

FloatingActionButton.displayName = 'FloatingActionButton';

