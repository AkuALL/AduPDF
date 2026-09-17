import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type AuthUser = { name?: string; nama?: string };

const navigation = [
    ['Antrian Verifikasi', '/admin/verifications'],
    ['Tambah Petugas', '/admin/users/petugas/create'],
    ['Tambah Pengguna', '/admin/users/pengguna/create'],
    ['Kelola Fasilitas', '/admin/facilities'],
    ['Ganti Password', '/admin/change-password'],
] as const;

export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth, flash } = usePage<{
        auth: { user: AuthUser };
        flash?: { success?: string; error?: string };
    }>().props;

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 antialiased">
            <header className="bg-[#2D4C79] text-white shadow">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/verifications" className="flex items-center gap-2">
                            <span className="text-2xl font-bold tracking-wider">AduPDF</span>
                            <span className="rounded border border-amber-400/40 bg-amber-500/30 px-2 py-0.5 text-xs font-semibold text-amber-200">ADMIN</span>
                        </Link>
                        <nav className="hidden gap-2 md:flex">
                            {navigation.map(([label, href]) => (
                                <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white">
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block"><div className="text-sm font-semibold">{auth.user.nama ?? auth.user.name}</div><div className="text-xs text-slate-300">Administrator Tunggal</div></div>
                        <Link href="/logout" method="post" as="button" className="rounded bg-red-600/80 px-3 py-1.5 text-xs text-white transition hover:bg-red-700">Keluar</Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                {flash?.success && <div role="status" className="mb-4 rounded border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm text-emerald-800">{flash.success}</div>}
                {flash?.error && <div role="alert" className="mb-4 rounded border-l-4 border-rose-600 bg-rose-50 p-4 text-sm text-rose-800">{flash.error}</div>}
                {children}
            </main>
            <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.</footer>
        </div>
    );
}
