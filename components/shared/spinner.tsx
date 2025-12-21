import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Reusable spinner component
 */
export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <AiOutlineLoading3Quarters 
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
}

