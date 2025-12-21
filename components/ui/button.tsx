import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
  secondary: 'bg-slate-600 text-white hover:bg-slate-700 border-transparent',
  outline: 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
