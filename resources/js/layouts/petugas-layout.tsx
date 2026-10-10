import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CalendarClock } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { logout } from '@/routes';
import petugas from '@/routes/petugas';
import reports from '@/routes/petugas/reports';
import reservations from '@/routes/petugas/reservations';
import type { Auth } from '@/types';

type ActivePage = 'dashboard' | 'reservations' | 'reports';

type Props = PropsWithChildren<{ activePage: ActivePage }>;

export default function PetugasLayout({ activePage, children }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const navigation = [
        {
            label: 'Antrean Reservasi',
            href: reservations.index(),
            icon: CalendarClock,
            active: activePage === 'reservations',
        },
        {
            label: 'Antrean Laporan',
            href: reports.index(),
            icon: AlertTriangle,
            active: activePage === 'reports',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F7F8FA] text-[#111827]">
            <header className="sticky top-0 z-40 bg-[#2D4C79] text-white shadow-md border-b border-[#243E63]">
                <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link
                                href={petugas.dashboard()}
                                className="flex items-center gap-2 group cursor-pointer"
                            >
                                <span className="text-2xl font-bold tracking-wider group-hover:text-sky-200 transition">
                                    AduPDF
                                </span>
                                <span className="rounded-md border border-sky-400/40 bg-sky-500/30 px-2 py-0.5 text-xs font-semibold text-sky-200 shadow-xs">
                                    PETUGAS
                                </span>
                            </Link>

                            <nav className="hidden items-center gap-1.5 md:flex" aria-label="Navigasi Petugas">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            aria-current={item.active ? 'page' : undefined}
                                            className={`group flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                                                item.active
                                                    ? 'bg-white text-[#2D4C79] font-bold shadow-md shadow-black/10 ring-1 ring-white/20'
                                                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 transition-colors ${
                                                    item.active ? 'text-[#2D4C79]' : 'text-slate-300 group-hover:text-white'
                                                }`}
                                            />
                                            <span>{item.label}</span>
                                            {item.active && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#2D4C79]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="ml-auto hidden shrink-0 items-center gap-4 md:flex">
                            <div className="text-right">
                                <div className="text-sm font-semibold leading-tight">{auth.user.nama ?? auth.user.name}</div>
                                <div className="mt-0.5 flex items-center justify-end gap-1.5">
                                    <span className="rounded border border-sky-400/30 bg-sky-400/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-200">PETUGAS</span>
                                    <span className="max-w-[150px] truncate text-xs text-slate-300" title={auth.user.email}>{auth.user.email}</span>
                                </div>
                            </div>
                            <Link href={logout()} method="post" as="button" className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                                Keluar
                            </Link>
                        </div>

                        <details className="relative md:hidden">
                            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-white/20 bg-white/10 hover:bg-white/20" aria-label="Buka navigasi Petugas">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </summary>
                            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-md border border-white/15 bg-[#243E63] p-3 shadow-lg">
                                <div className="mb-3 border-b border-white/15 px-3 pb-3">
                                    <div className="text-sm font-semibold">{auth.user.nama ?? auth.user.name}</div>
                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className="rounded border border-sky-400/30 bg-sky-400/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-200">PETUGAS</span>
                                        <span className="truncate text-xs text-slate-300">{auth.user.email}</span>
                                    </div>
                                </div>
                                <nav className="grid gap-1" aria-label="Navigasi Petugas">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                aria-current={item.active ? 'page' : undefined}
                                                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${
                                                    item.active
                                                        ? 'bg-white text-[#2D4C79] font-bold shadow-xs'
                                                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                                <Link href={logout()} method="post" as="button" className="mt-2 flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white cursor-pointer">
                                    Keluar
                                </Link>
                            </div>
                        </details>
                    </div>
            </header>
            {children}
        </div>
    );
}

