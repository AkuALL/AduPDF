import { Head, useForm } from '@inertiajs/react';
import AdminBackLink from '@/components/admin-back-link';
import ConfirmationDialog, {
    type ConfirmationRequest,
} from '@/components/confirmation-dialog';
import PasswordField from '@/components/password-field';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';

export default function AccountForm({
    role,
}: {
    role: 'Petugas' | 'Pengguna';
}) {
    const form = useForm({
        nama: '',
        email: '',
        identity_type: '',
        institutional_id: '',
        password: '',
        password_confirmation: '',
    });
    const endpoint =
        role === 'Petugas' ? '/admin/users/petugas' : '/admin/users/pengguna';
    const errors = Object.values(form.errors);
    const [confirmation, setConfirmation] =
        useState<ConfirmationRequest | null>(null);
    return (
        <AdminLayout>
            <Head title={`Buat Akun ${role}`} />
            <div className="mb-6">
                <AdminBackLink href="/admin/users">
                    Kembali ke Daftar Akun
                </AdminBackLink>
            </div>
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50 p-6">
                    <h1 className="text-xl font-bold">Buat Akun {role}</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        {role === 'Petugas'
                            ? 'Akun Petugas disetujui Admin saat dibuat dan dapat langsung masuk.'
                            : 'Akun Pengguna disetujui Admin saat dibuat dan dapat langsung digunakan.'}
                    </p>
                </div>
                <div className="p-6">
                    {errors.length > 0 && (
                        <div
                            role="alert"
                            className="mb-5 rounded border-l-4 border-rose-500 bg-rose-50 p-4 text-sm text-rose-800"
                        >
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setConfirmation({
                                title: 'Buat Akun',
                                description: `Buat akun ${role} untuk ${form.data.nama}? Akun akan disetujui Admin saat dibuat dan dapat langsung digunakan.`,
                                confirmLabel: 'Ya, Buat Akun',
                                onConfirm: () => form.post(endpoint),
                            });
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="nama"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Nama Lengkap {role}
                            </label>
                            <input
                                id="nama"
                                required
                                autoFocus
                                value={form.data.nama}
                                onChange={(event) =>
                                    form.setData('nama', event.target.value)
                                }
                                placeholder={
                                    role === 'Petugas'
                                        ? 'Contoh: Ahmad Fadilah'
                                        : 'Contoh: Siti Rahmawati'
                                }
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Alamat Email{' '}
                                {role === 'Petugas' ? 'Resmi' : 'Kampus'}
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                placeholder="nama@kampus.ac.id"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        {role === 'Pengguna' && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="identity_type"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Jenis Identitas Kampus
                                    </label>
                                    <select
                                        id="identity_type"
                                        required
                                        value={form.data.identity_type}
                                        onChange={(event) =>
                                            form.setData(
                                                'identity_type',
                                                event.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="">
                                            -- Pilih Jenis Identitas --
                                        </option>
                                        <option value="nim">NIM (Mahasiswa)</option>
                                        <option value="nip">
                                            NIP (Dosen / Tenaga Pendidik)
                                        </option>
                                        <option value="no_pegawai">
                                            No. Pegawai (Tenaga Kependidikan atau Staf)
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor="institutional_id"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Nomor Identitas Kampus
                                    </label>
                                    <input
                                        id="institutional_id"
                                        required
                                        value={form.data.institutional_id}
                                        onChange={(event) =>
                                            form.setData(
                                                'institutional_id',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Masukkan nomor identitas kampus"
                                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="grid gap-4 md:grid-cols-2">
                            <PasswordField
                                label="Kata Sandi"
                                name="password"
                                placeholder="Minimal 8 karakter"
                                value={form.data.password}
                                onChange={(value) =>
                                    form.setData('password', value)
                                }
                            />
                            <PasswordField
                                label="Konfirmasi Kata Sandi"
                                name="password_confirmation"
                                placeholder="Ulangi kata sandi"
                                value={form.data.password_confirmation}
                                onChange={(value) =>
                                    form.setData('password_confirmation', value)
                                }
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button
                                disabled={form.processing}
                                className="rounded-md bg-[#2D4C79] px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1e3454] disabled:opacity-60"
                            >
                                Simpan Akun {role}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ConfirmationDialog
                confirmation={confirmation}
                onOpenChange={(open) => {
                    if (!open) setConfirmation(null);
                }}
                confirmDisabled={form.processing}
            />
        </AdminLayout>
    );
}
