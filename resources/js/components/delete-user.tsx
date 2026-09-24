import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title="Hapus Akun"
                description="Nonaktifkan akun tanpa menghapus riwayat reservasi dan laporan."
            />
            <div className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="relative space-y-0.5 text-red-700">
                    <p className="font-medium">Perhatian</p>
                    <p className="text-sm">
                        Akun yang dinonaktifkan tidak dapat digunakan untuk masuk kembali.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Hapus Akun
                        </Button>
                    </DialogTrigger>
                    <DialogContent
                        className="border-[#E5E7EB] bg-white text-[#111827] [color-scheme:light] [--accent:#F3F5F7] [--accent-foreground:#111827] [--background:#FFFFFF] [--border:#E5E7EB] [--destructive:#B42318] [--foreground:#111827] [--input:#D0D5DD] [--muted-foreground:#667085] [--primary:#2D4C79] [--primary-foreground:#FFFFFF] [--ring:#2D4C79] [--secondary:#F3F5F7] [--secondary-foreground:#111827]"
                    >
                        <DialogTitle className="text-[#111827]">
                            Hapus akun Anda?
                        </DialogTitle>
                        <DialogDescription className="text-[#667085]">
                            Akun akan dinonaktifkan, sementara riwayat reservasi
                            dan laporan tetap tersimpan. Masukkan kata sandi
                            untuk mengonfirmasi.
                        </DialogDescription>

                        <Form
                            action="/profile"
                            method="delete"
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Kata sandi
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Kata sandi"
                                            autoComplete="current-password"
                                        />

                                        <InputError
                                            className="!text-[#B42318] dark:!text-[#B42318]"
                                            message={errors.password}
                                        />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                className="bg-[#F3F5F7] text-[#111827] hover:bg-[#E5E7EB]"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Batal
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Hapus Akun
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
