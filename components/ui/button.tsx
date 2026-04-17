import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'deep' | 'secondary';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      default:
        'bg-warm-coral text-white hover:bg-[#FF5555] shadow-soft hover:shadow-soft-lg active:scale-95',
      outline:
        'border-2 border-warm-deep text-warm-deep hover:bg-warm-deep hover:text-white shadow-soft hover:shadow-soft-lg active:scale-95',
      ghost: 'text-warm-deep hover:bg-warm-cream active:scale-95',
      deep: 'bg-warm-deep text-white hover:bg-[#152540] shadow-soft hover:shadow-soft-lg active:scale-95',
      secondary: 'bg-warm-sage text-warm-deep hover:bg-[#93C7D4] shadow-soft hover:shadow-soft-lg active:scale-95',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      default: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
      icon: 'h-10 w-10',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
