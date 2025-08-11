// src/components/ui/InputField.tsx
import React from 'react';

interface InputFieldProps {
  id: string;
  name?: string;            // ✅ allow custom field name
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select type
  textarea?: boolean;       // For textarea type
  rows?: number;            // For textarea
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  autoComplete?: string;
  maxLength?: number;       // ✅ added to support maxLength prop
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  options,
  textarea,
  rows = 3,
  className = 'mb-4',
  labelClassName = 'block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1',
  inputClassName = 'mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-sky-700/50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm bg-white dark:bg-sky-900/20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
  errorClassName = 'mt-1 text-xs text-red-500 dark:text-red-400',
  autoComplete,
  maxLength,
}) => {
  const commonProps = {
    id,
    name: name || id,
    value,
    onChange,
    placeholder,
    required,
    autoComplete,
    maxLength, // ✅ passed through
    className: `${inputClassName} ${error ? 'border-red-500 dark:border-red-400' : ''}`,
  };

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClassName}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {textarea ? (
        <textarea {...commonProps} rows={rows} />
      ) : type === 'select' && options ? (
        <select {...commonProps} className={`${commonProps.className} appearance-none`}>
          <option value="" className="text-gray-500 dark:bg-slate-800">
            {placeholder || `Select ${label.toLowerCase()}`}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="dark:bg-slate-700 dark:text-gray-200">
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...commonProps} />
      )}

      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};

export default InputField;
