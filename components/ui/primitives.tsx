import React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-2 text-base placeholder:text-gray-400 focus:border-warm-coral focus:outline-none focus:ring-2 focus:ring-warm-coral focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium text-warm-deep', className)}
    {...props}
  />
));
Label.displayName = 'Label';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-3xl bg-white p-6 shadow-soft',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-2 text-base placeholder:text-gray-400 focus:border-warm-coral focus:outline-none focus:ring-2 focus:ring-warm-coral focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Select.displayName = 'Select';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-24 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-2 text-base placeholder:text-gray-400 focus:border-warm-coral focus:outline-none focus:ring-2 focus:ring-warm-coral focus:ring-opacity-20 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-warm-coral bg-opacity-10 text-warm-coral',
      success: 'bg-warm-sage bg-opacity-10 text-warm-sage',
      warning: 'bg-warm-dawn bg-opacity-10 text-warm-dawn',
      danger: 'bg-warm-coral bg-opacity-10 text-warm-coral',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
