import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface FlashAlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    message?: string | null;
    autoCloseDelay?: number;
    floating?: boolean;
    className?: string;
    onClose?: () => void;
}

export function FlashAlert({
    type = 'success',
    message,
    autoCloseDelay = 5000,
    floating = true,
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
            title: 'Berhasil',
            badgeBg: 'bg-emerald-100 text-emerald-600',
            border: 'border-emerald-200',
            progressBar: 'bg-emerald-500',
            progressBg: 'bg-emerald-100',
            container: 'border-emerald-200 bg-emerald-50 text-emerald-800 border-l-4 border-l-emerald-600',
            icon: <CheckCircle2 className="h-5 w-5 shrink-0" />,
            button: 'text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 focus:ring-emerald-500',
        },
        error: {
            title: 'Gagal',
            badgeBg: 'bg-rose-100 text-rose-600',
            border: 'border-rose-200',
            progressBar: 'bg-rose-500',
            progressBg: 'bg-rose-100',
            container: 'border-rose-200 bg-rose-50 text-rose-800 border-l-4 border-l-rose-600',
            icon: <AlertCircle className="h-5 w-5 shrink-0" />,
            button: 'text-rose-700 hover:bg-rose-100 hover:text-rose-900 focus:ring-rose-500',
        },
        warning: {
            title: 'Perhatian',
            badgeBg: 'bg-amber-100 text-amber-600',
            border: 'border-amber-200',
            progressBar: 'bg-amber-500',
            progressBg: 'bg-amber-100',
            container: 'border-amber-200 bg-amber-50 text-amber-800 border-l-4 border-l-amber-600',
            icon: <AlertTriangle className="h-5 w-5 shrink-0" />,
            button: 'text-amber-700 hover:bg-amber-100 hover:text-amber-900 focus:ring-amber-500',
        },
        info: {
            title: 'Informasi',
            badgeBg: 'bg-sky-100 text-sky-600',
            border: 'border-sky-200',
            progressBar: 'bg-sky-500',
            progressBg: 'bg-sky-100',
            container: 'border-sky-200 bg-sky-50 text-sky-800 border-l-4 border-l-sky-600',
            icon: <Info className="h-5 w-5 shrink-0" />,
            button: 'text-sky-700 hover:bg-sky-100 hover:text-sky-900 focus:ring-sky-500',
        },
    };

    const currentVariant = variantStyles[type] || variantStyles.success;

    if (floating) {
        return (
            <>
                <style>{`
                    @keyframes flashToastCooldown {
                        from { width: 100%; }
                        to { width: 0%; }
                    }
                `}</style>
                <div
                    role={type === 'error' ? 'alert' : 'status'}
                    className={`fixed top-5 right-5 z-[9999] max-w-md w-[calc(100vw-2.5rem)] sm:w-auto min-w-[320px] rounded-xl border ${currentVariant.border} bg-white shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${className}`}
                >
                    <div className="flex items-start justify-between gap-3 p-4">
                        <div className="flex items-start gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${currentVariant.badgeBg}`}>
                                {currentVariant.icon}
                            </div>
                            <div className="pt-0.5">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {currentVariant.title}
                                </div>
                                <div className="mt-0.5 text-sm font-medium text-slate-800 leading-snug">
                                    {message}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Tutup notifikasi"
                            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {autoCloseDelay > 0 && (
                        <div className={`h-1 w-full overflow-hidden ${currentVariant.progressBg}`}>
                            <div
                                className={`h-full ${currentVariant.progressBar}`}
                                style={{
                                    animation: `flashToastCooldown ${autoCloseDelay}ms linear forwards`,
                                }}
                            />
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <div
            role={type === 'error' ? 'alert' : 'status'}
            className={`mb-4 flex items-center justify-between gap-3 rounded-lg border p-4 text-sm shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${currentVariant.container} ${className}`}
        >
            <div className="flex items-center gap-3">
                <div className="shrink-0">{currentVariant.icon}</div>
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
