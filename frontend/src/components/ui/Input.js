import React from 'react';

const Input = ({ 
  label, 
  id, 
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
      <input
        id={id}
        className={`
          block w-full rounded-lg border-gray-300 shadow-sm 
          focus:border-primary focus:ring-primary sm:text-sm 
          disabled:bg-gray-50 disabled:text-gray-500
          ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;
