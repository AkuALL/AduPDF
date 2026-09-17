import { useState } from 'react';

export default function PasswordField({ label, name, placeholder, value, onChange, autoFocus = false }: { label: string; name: string; placeholder: string; value: string; onChange: (value: string) => void; autoFocus?: boolean }) {
    const [visible, setVisible] = useState(false);
    return <div><label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">{label}</label><div className="relative"><input id={name} name={name} type={visible ? 'text' : 'password'} required autoFocus={autoFocus} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-md border border-slate-300 px-3 py-2 pr-12 text-sm focus:border-[#2D4C79] focus:outline-none focus:ring-2 focus:ring-[#2D4C79]" /><button type="button" onClick={() => setVisible(!visible)} className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 hover:text-slate-700" aria-label="Lihat atau sembunyikan kata sandi">{visible ? 'Sembunyi' : 'Lihat'}</button></div></div>;
}
