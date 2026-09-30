import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface FlashAlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message?: string | null;
    autoCloseDelay?: number;
    className?: string;
    onClose?: () => void;
}

export function FlashAlert({
    type = 'success',
    message,
    autoCloseDelay = 5000,
    className = '',
    onClose,
}: FlashAlertProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!message) return;
        setVisible(true);

        if (autoCloseDelay > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [message, autoCloseDelay, onClose]);

    if (!visible || !message) {
        return null;
    }

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    const variantStyles = {
        success: {
            container: 'border-emerald-200 bg-emerald-50 text-emerald-800 border-l-4 border-l-emerald-600',
            icon: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />,
            button: 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 focus:ring-emerald-500',
        },
        error: {
            container: 'border-rose-200 bg-rose-50 text-rose-800 border-l-4 border-l-rose-600',
            icon: <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />,
            button: 'text-rose-700 hover:bg-rose-100 hover:text-rose-900 focus:ring-rose-500',
        },
        warning: {
            container: 'border-amber-200 bg-amber-50 text-amber-800 border-l-4 border-l-amber-600',
            icon: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />,
            button: 'text-amber-700 hover:bg-amber-100 hover:text-amber-900 focus:ring-amber-500',
        },
        info: {
            container: 'border-sky-200 bg-sky-50 text-sky-800 border-l-4 border-l-sky-600',
            icon: <Info className="h-5 w-5 shrink-0 text-sky-600" />,
            button: 'text-sky-700 hover:bg-sky-100 hover:text-sky-900 focus:ring-sky-500',
        },
    };

    const currentVariant = variantStyles[type] || variantStyles.success;

    return (
        <div
            role={type === 'error' ? 'alert' : 'status'}
            className={`mb-4 flex items-center justify-between gap-3 rounded-lg border p-4 text-sm shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${currentVariant.container} ${className}`}
        >
            <div className="flex items-center gap-3">
                {currentVariant.icon}
                <div className="font-medium leading-relaxed">{message}</div>
            </div>
            <button
                type="button"
                onClick={handleClose}
                aria-label="Tutup notifikasi"
                className={`shrink-0 rounded-md p-1.5 transition-colors focus:outline-none focus:ring-2 cursor-pointer ${currentVariant.button}`}
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

export default FlashAlert;
