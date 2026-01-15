import React from 'react'

export interface SelectOption { value: string | number; label: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  register?: any; // pass {...register('name')}
}

export default function Select({ label, options = [], error, register, children, ...rest }: SelectProps) {
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <select {...(register || {})} {...rest} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
        {children}
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}