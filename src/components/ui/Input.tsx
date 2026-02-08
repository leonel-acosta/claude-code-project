import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 border border-slate-300 rounded-lg transition-all duration-200
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:border-transparent
          hover:border-slate-400 dark:hover:border-slate-600
          disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'dark:border-slate-600'}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
