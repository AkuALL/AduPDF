import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function PasswordInput({
    className,
    ref,
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & { ref?: Ref<HTMLInputElement> }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? 'text' : 'password'}
                className={cn('pr-10', className)}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 focus-visible:ring-[3px] focus-visible:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
            >
                {showPassword ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </button>
        </div>
    );
}

export default function PasswordField({
    label,
    name,
    placeholder,
    value,
    onChange,
    autoFocus = false,
}: {
    label: ReactNode;
    name: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    autoFocus?: boolean;
}) {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={visible ? 'text' : 'password'}
                    required
                    autoFocus={autoFocus}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 pr-12 text-sm text-[#111827] placeholder-[#98A2B3] outline-none transition hover:border-[#2D4C79] focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                />
                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 hover:text-[#2D4C79]"
                    aria-label="Lihat atau sembunyikan kata sandi"
                >
                    {visible ? 'Sembunyi' : 'Lihat'}
                </button>
            </div>
        </div>
    );
}
