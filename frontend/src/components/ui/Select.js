import React from 'react';

const Select = ({ 
  label, 
  id, 
  options = [], 
  error, 
  className = '', 
  containerClassName = '',
  ...props 
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm 
          focus:border-primary focus:ring-primary sm:text-sm 
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Select;
