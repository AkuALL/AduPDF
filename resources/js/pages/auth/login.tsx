import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PasswordField from '@/components/password-field';
import AuthPageLayout from '@/layouts/auth-page-layout';

export default function Login({ status }: { status?: string }) {
    const { flash } = usePage<{ flash?: { status?: string; success?: string; error?: string } }>().props;
    const form = useForm({ email: '', password: '', remember: false });
    const errors = Object.values(form.errors);
    const successMessage = status || flash?.status || flash?.success;

    return (
        <AuthPageLayout>
            <Head title="Masuk — AduPDF" />
            <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="bg-[#2D4C79] p-6 text-center text-white">
                    <h1 className="text-2xl font-bold">Masuk ke AduPDF</h1>
                    <p className="mt-1 text-xs text-slate-200">Sistem Reservasi & Pelaporan Fasilitas Kampus</p>
                </div>
                <div className="p-6">
                    {successMessage && (
                        <div role="status" className="mb-4 rounded border-l-4 border-emerald-600 bg-emerald-50 p-3 text-sm text-emerald-800">
                            {successMessage}
                        </div>
                    )}
                    {errors.length > 0 && (
                        <div role="alert" className="mb-4 rounded border-l-4 border-rose-500 bg-rose-50 p-3 text-sm text-rose-800">
                            {errors.map((error) => (
                                <div key={error}>{error}</div>
                            ))}
                        </div>
                    )}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            form.post('/login');
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                placeholder="nama@kampus.ac.id"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <PasswordField
                            label="Kata Sandi"
                            name="password"
                            placeholder="••••••••"
                            value={form.data.password}
                            onChange={(value) => form.setData('password', value)}
                        />
                        <label className="flex items-center text-xs text-slate-600">
                            <input
                                type="checkbox"
                                checked={form.data.remember}
                                onChange={(event) => form.setData('remember', event.target.checked)}
                                className="rounded border-slate-300 text-[#2D4C79]"
                            />
                            <span className="ml-2">Ingat saya</span>
                        </label>
                        <button
                            disabled={form.processing}
                            className="w-full rounded-md bg-[#2D4C79] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#1e3454] disabled:opacity-60"
                        >
                            Masuk
                        </button>
                    </form>
                    <div className="mt-6 border-t border-slate-200 pt-6 text-center text-xs text-slate-600">
                        Belum memiliki akun Pengguna?{' '}
                        <Link href="/register" className="ml-1 font-semibold text-[#2D4C79] hover:underline">
                            Daftar sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </AuthPageLayout>
    );
}
