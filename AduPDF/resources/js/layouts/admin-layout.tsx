import { Link, usePage } from '@inertiajs/react';
import { Building2, KeyRound, LogOut, ShieldCheck, UserPlus, UsersRound, Wrench } from 'lucide-react';
import type { PropsWithChildren } from 'react';

type AuthUser = { name?: string; nama?: string };

const navigation = [
    ['Kelola Akun', '/admin/users', UsersRound],
    ['Tambah Petugas', '/admin/users/petugas/create', ShieldCheck],
    ['Tambah Pengguna', '/admin/users/pengguna/create', UserPlus],
    ['Kelola Fasilitas', '/admin/facilities', Wrench],
    ['Ganti Password', '/admin/change-password', KeyRound],
] as const;

export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth, flash } = usePage<{
        auth: { user: AuthUser };
        flash?: { success?: string; error?: string };
    }>().props;

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#F4F7FB] text-slate-800 antialiased">
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_12%_0%,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.10),transparent_30%)]" />
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#112A42]/95 text-white shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/users" className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-2xl bg-teal-400/15 text-teal-300 ring-1 ring-inset ring-teal-300/20"><Building2 className="size-5" /></span>
                            <span><span className="block text-lg font-extrabold leading-none tracking-[-0.03em]">AduPDF</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">Admin Console</span></span>
                        </Link>
                        <nav className="hidden gap-2 md:flex">
                            {navigation.map(([label, href, Icon]) => (
                                <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white">
                                    <Icon className="size-4" />{label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block"><div className="text-sm font-semibold">{auth.user.nama ?? auth.user.name}</div><div className="text-[10px] font-bold uppercase tracking-wider text-teal-300">Administrator</div></div>
                        <Link href="/logout" method="post" as="button" aria-label="Keluar" className="grid size-9 place-items-center rounded-xl text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-200"><LogOut className="size-4" /></Link>
                    </div>
                </div>
            </header>
            <main className="relative z-10 mx-auto w-full max-w-[1440px] min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {flash?.success && <div role="status" className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-sm font-medium text-emerald-800 shadow-sm">{flash.success}</div>}
                {flash?.error && <div role="alert" className="mb-5 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm font-medium text-rose-800 shadow-sm">{flash.error}</div>}
                {children}
            </main>
            <footer className="relative z-10 border-t border-white/80 bg-white/50 py-5 text-center text-xs font-medium text-slate-500 backdrop-blur">© {new Date().getFullYear()} AduPDF · Admin Console</footer>
        </div>
    );
}
