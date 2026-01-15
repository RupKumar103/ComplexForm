import React from 'react'

export interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  register?: any; // pass {...register('name')}
}

export default function CheckBox({ label, error, register, ...rest }: CheckBoxProps) {
  return (
    <div className="flex items-start gap-3">
      <input type="checkbox" {...(register || {})} {...rest} className="mt-1" />
      {label && <span>{label}</span>}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}