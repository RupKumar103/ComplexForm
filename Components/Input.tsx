import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
  register?: any; // pass {...register('name')} from react-hook-form
}

export default function Input({ label, error, register, ...rest }: InputProps) {
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <input {...(register || {})} {...rest} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
