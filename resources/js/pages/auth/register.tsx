import { Head, Link, useForm } from '@inertiajs/react';
import PasswordField from '@/components/password-field';
import AuthPageLayout from '@/layouts/auth-page-layout';
import { AppLogo } from '@/components/app-logo';

export default function Register() {
    const form = useForm({
        nama: '',
        email: '',
        identity_type: 'nim',
        institutional_id: '',
        password: '',
        password_confirmation: '',
    });
    const errors = Object.values(form.errors);
    return (
        <AuthPageLayout>
            <Head title="Daftar Akun Pengguna — AduPDF" />
            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="bg-[#2D4C79] p-6 text-center text-white">
                    <div className="mb-3 flex justify-center">
                        <AppLogo size="xl" withBackground className="shadow-md" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Pendaftaran Pengguna</h1>
                    <p className="mt-1 text-xs text-slate-200">
                        Khusus Mahasiswa, Dosen, dan Tenaga Kependidikan
                    </p>
                </div>
                <div className="p-6">
                    <div className="mb-5 rounded-md border-l-4 border-[#2D4C79] bg-[#E9EEF5] p-3 text-xs leading-relaxed text-slate-700">
                        <b className="font-semibold text-[#2D4C79]">Informasi Akun:</b>{' '}
                        Akun dapat digunakan setelah disetujui oleh Admin.
                    </div>
                    {errors.length > 0 && (
                        <div
                            role="alert"
                            className="mb-4 rounded border-l-4 border-rose-500 bg-rose-50 p-3 text-sm text-rose-800"
                        >
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/register');
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="nama"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="nama"
                                required
                                autoFocus
                                value={form.data.nama}
                                onChange={(event) =>
                                    form.setData('nama', event.target.value)
                                }
                                placeholder="Contoh: Budi Santoso"
                                className="w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#98A2B3] outline-none transition hover:border-[#2D4C79] focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Alamat Email Kampus <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData('email', event.target.value)
                                }
                                placeholder="budi@kampus.ac.id"
                                className="w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#98A2B3] outline-none transition hover:border-[#2D4C79] focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="identity_type"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Jenis Identitas Kampus <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="identity_type"
                                required
                                value={form.data.identity_type}
                                onChange={(event) =>
                                    form.setData('identity_type', event.target.value)
                                }
                                className="w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827] outline-none transition hover:border-[#2D4C79] focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            >
                                <option value="nim">NIM (Mahasiswa)</option>
                                <option value="nip">NIP (Dosen / Tenaga Pendidik)</option>
                                <option value="no_pegawai">No. Pegawai (Tenaga Kependidikan atau Staf)</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="institutional_id"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Nomor Identitas Kampus <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="institutional_id"
                                required
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={form.data.institutional_id}
                                onKeyDown={(e) => {
                                    if (
                                        !/[0-9]/.test(e.key) &&
                                        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter'].includes(e.key) &&
                                        !e.ctrlKey &&
                                        !e.metaKey
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(event) =>
                                    form.setData('institutional_id', event.target.value.replace(/\D/g, ''))
                                }
                                placeholder="Contoh: 24060121140001 (NIM) atau 198501012010121001 (NIP)"
                                className="w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827] placeholder-[#98A2B3] outline-none transition hover:border-[#2D4C79] focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            />
                        </div>
                        <PasswordField
                            label={<>Kata Sandi <span className="text-red-500">*</span></>}
                            name="password"
                            placeholder="Minimal 8 karakter"
                            value={form.data.password}
                            onChange={(value) =>
                                form.setData('password', value)
                            }
                        />
                        <PasswordField
                            label={<>Konfirmasi Kata Sandi <span className="text-red-500">*</span></>}
                            name="password_confirmation"
                            placeholder="Ulangi kata sandi"
                            value={form.data.password_confirmation}
                            onChange={(value) =>
                                form.setData('password_confirmation', value)
                            }
                        />
                        <button
                            disabled={form.processing}
                            className="h-10 w-full rounded-md bg-[#2D4C79] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition disabled:opacity-60 cursor-pointer"
                        >
                            Daftar Sekarang
                        </button>
                    </form>
                    <div className="mt-6 border-t border-slate-200 pt-6 text-center text-xs text-slate-600">
                        Sudah memiliki akun?{' '}
                        <Link
                            href="/login"
                            className="ml-1 font-semibold text-[#2D4C79] hover:underline cursor-pointer"
                        >
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </AuthPageLayout>
    );
}
