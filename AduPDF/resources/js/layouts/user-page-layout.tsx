import { Link, usePage } from '@inertiajs/react';
import { Building2, CalendarDays, ClipboardList, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react';
import { type PropsWithChildren, useState } from 'react';

type ActivePage = 'facilities' | 'reservations' | 'reports';

type AuthUser = {
    id: number;
    name?: string;
    nama?: string;
    email: string;
    role: string;
};

type Props = PropsWithChildren<{
    active?: ActivePage;
}>;

export default function UserPageLayout({ active, children }: Props) {
    const { auth } = usePage<{ auth?: { user?: AuthUser | null } }>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { key: 'facilities', label: 'Fasilitas', href: '/facilities', icon: Building2, visible: true },
        { key: 'reservations', label: 'Reservasi Saya', href: '/reservations', icon: CalendarDays, visible: user?.role === 'pengguna' },
        { key: 'reports', label: 'Laporan Saya', href: '/reports', icon: ClipboardList, visible: user?.role === 'pengguna' },
    ].filter((item) => item.visible);

    const workspaceHref = user?.role === 'admin'
        ? '/admin/facilities'
        : user?.role === 'petugas'
            ? '/petugas/dashboard'
            : null;

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#F4F7FB] text-slate-900">
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.12),transparent_32%)]" />

            <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/facilities" className="group flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#17324D] to-[#1B7F79] text-white shadow-lg shadow-slate-900/15 transition group-hover:-rotate-3 group-hover:scale-105">
                                <Building2 className="size-5" />
                            </span>
                            <span>
                                <span className="block text-lg font-extrabold leading-none tracking-[-0.03em] text-[#17324D]">AduPDF</span>
                                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">Campus Space</span>
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-1 md:flex">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = active === item.key;

                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${isActive ? 'bg-[#17324D] text-white shadow-md shadow-slate-900/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
                                    >
                                        <Icon className="size-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        {workspaceHref && (
                            <Link href={workspaceHref} className="ui-button-secondary py-2 text-xs">
                                <LayoutDashboard className="size-4" />
                                Workspace
                            </Link>
                        )}
                        {user ? (
                            <>
                                <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition hover:bg-slate-100">
                                    <span className="grid size-8 place-items-center rounded-full bg-teal-100 text-teal-700"><UserRound className="size-4" /></span>
                                    <span className="text-left">
                                        <span className="block max-w-32 truncate text-xs font-bold text-slate-800">{user.nama || user.name}</span>
                                        <span className="block text-[10px] font-medium capitalize text-slate-500">{user.role}</span>
                                    </span>
                                </Link>
                                <Link href="/logout" method="post" as="button" aria-label="Keluar" className="grid size-9 place-items-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-600">
                                    <LogOut className="size-4" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-[#17324D]">Masuk</Link>
                                <Link href="/register" className="ui-button-primary py-2">Daftar</Link>
                            </>
                        )}
                    </div>

                    <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="Buka navigasi" className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden">
                        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-xl md:hidden">
                        <nav className="mx-auto grid max-w-[1440px] gap-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return <Link key={item.key} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"><Icon className="size-4" />{item.label}</Link>;
                            })}
                            {workspaceHref && <Link href={workspaceHref} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"><LayoutDashboard className="size-4" />Workspace</Link>}
                            {user ? <Link href="/logout" method="post" as="button" className="mt-2 flex items-center gap-3 rounded-xl bg-rose-50 px-3 py-3 text-sm font-bold text-rose-700"><LogOut className="size-4" />Keluar</Link> : <Link href="/login" className="ui-button-primary mt-2">Masuk</Link>}
                        </nav>
                    </div>
                )}
            </header>

            <div className="relative z-10 flex-1">{children}</div>

            <footer className="relative z-10 mt-auto border-t border-white/80 bg-white/60 py-6 backdrop-blur-xl">
                <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <span className="font-semibold text-slate-600">AduPDF · Ruang kampus, lebih mudah diakses.</span>
                    <span>© {new Date().getFullYear()} Universitas Diponegoro</span>
                </div>
            </footer>
        </div>
    );
}
