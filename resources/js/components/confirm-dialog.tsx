import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    isLoading?: boolean;
    disabled?: boolean;
    onConfirm: () => void;
    children?: ReactNode;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    variant = 'default',
    isLoading = false,
    disabled = false,
    onConfirm,
    children,
}: ConfirmDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-slate-200 bg-white p-6 shadow-xl sm:rounded-2xl">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-lg font-bold text-slate-900">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {children}

                <DialogFooter className="mt-4 gap-2 sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant}
                        onClick={onConfirm}
                        disabled={isLoading || disabled}
                        className={
                            variant === 'destructive'
                                ? 'rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                                : 'rounded-lg bg-[#2D4C79] hover:bg-[#1e3454] text-white shadow-xs'
                        }
                    >
                        {isLoading ? 'Memproses...' : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
