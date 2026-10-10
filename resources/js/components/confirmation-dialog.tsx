import { CircleHelp, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export type ConfirmationRequest = {
    title: string;
    description: string;
    confirmLabel: string;
    destructive?: boolean;
    onConfirm: () => void;
};

type Props = {
    confirmation: ConfirmationRequest | null;
    onOpenChange: (open: boolean) => void;
    confirmDisabled?: boolean;
    children?: React.ReactNode;
};

export default function ConfirmationDialog({
    confirmation,
    onOpenChange,
    confirmDisabled = false,
    children,
}: Props) {
    const destructive = confirmation?.destructive ?? false;

    return (
        <Dialog open={confirmation !== null} onOpenChange={onOpenChange}>
            {confirmation && (
                <DialogContent className="max-w-md border-slate-200 bg-white p-6 shadow-xl sm:rounded-2xl">
                    <DialogHeader className="flex flex-col items-center sm:items-start">
                        <div
                            className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${destructive ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-700'}`}
                        >
                            {destructive ? (
                                <TriangleAlert className="h-6 w-6" />
                            ) : (
                                <CircleHelp className="h-6 w-6" />
                            )}
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            {confirmation.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-600">
                            {confirmation.description}
                        </DialogDescription>
                    </DialogHeader>

                    {children}

                    <DialogFooter className="mt-4 gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-lg border-slate-300 bg-white font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant={destructive ? 'destructive' : 'default'}
                            onClick={() => {
                                confirmation.onConfirm();
                                onOpenChange(false);
                            }}
                            disabled={confirmDisabled}
                            className={
                                destructive
                                    ? 'rounded-lg bg-rose-600 font-medium text-white shadow-sm transition hover:bg-rose-700'
                                    : 'rounded-lg bg-[#2D4C79] font-medium text-white shadow-sm transition hover:bg-[#1e3454]'
                            }
                        >
                            {confirmation.confirmLabel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
