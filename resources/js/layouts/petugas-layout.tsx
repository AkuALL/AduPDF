import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, CalendarClock, ChevronDown, KeyRound, LogOut, Menu } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { FlashAlert } from '@/components/flash-alert';
import { AppLogo } from '@/components/app-logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/routes';
import petugas from '@/routes/petugas';
import reports from '@/routes/petugas/reports';
import reservations from '@/routes/petugas/reservations';
import type { Auth } from '@/types';

type ActivePage = 'dashboard' | 'reservations' | 'reports' | 'change-password';

type Props = PropsWithChildren<{ activePage?: ActivePage }>;

export default function PetugasLayout({ activePage, children }: Props) {
    const { auth, flash } = usePage<{
        auth: Auth;
        flash?: { success?: string; error?: string };
    }>().props;
    const displayName = auth.user.nama ?? auth.user.name ?? 'Petugas';
    const initial = displayName.charAt(0).toUpperCase();

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
        <div className="flex min-h-screen flex-col bg-[#F7F8FA] text-[#111827]">
            <header className="sticky top-0 z-40 bg-[#2D4C79] text-white shadow-md border-b border-[#243E63]">
                <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link
                            href={petugas.dashboard()}
                            className="flex items-center gap-2.5 group cursor-pointer"
                        >
                            <AppLogo size="md" withBackground className="group-hover:scale-105" />
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

                    <div className="flex items-center gap-3">
                        {/* Petugas Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="group flex items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/20 border border-sky-300/40 text-sky-200 font-bold text-sm">
                                        {initial}
                                    </div>
                                    <div className="hidden text-left sm:block">
                                        <div className="flex items-center gap-1 text-sm font-semibold leading-tight text-white">
                                            <span>{displayName}</span>
                                            <ChevronDown className="h-3.5 w-3.5 text-slate-300 opacity-80 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                        </div>
                                        <div className="text-[11px] text-slate-300">Petugas</div>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-lg">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="font-semibold text-slate-900">{displayName}</div>
                                    {auth.user.email && (
                                        <div className="truncate text-xs text-slate-500 font-normal">{auth.user.email}</div>
                                    )}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/petugas/change-password"
                                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <KeyRound className="h-4 w-4 text-slate-500" />
                                        <span>Ganti Password</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        <LogOut className="h-4 w-4 text-rose-500" />
                                        <span>Keluar</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile Nav Toggle */}
                        <details className="relative md:hidden">
                            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-white/20" aria-label="Buka navigasi Petugas">
                                <Menu className="h-5 w-5 text-white" />
                            </summary>
                            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/15 bg-[#243E63] p-2 shadow-xl">
                                <nav className="grid gap-1" aria-label="Navigasi Petugas">
                                    {navigation.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                aria-current={item.active ? 'page' : undefined}
                                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition cursor-pointer ${
                                                    item.active
                                                        ? 'bg-white text-[#2D4C79] font-bold shadow-sm'
                                                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <Icon className={`h-4 w-4 ${item.active ? 'text-[#2D4C79]' : 'text-slate-300'}`} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                    <Link
                                        href="/petugas/change-password"
                                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white cursor-pointer"
                                    >
                                        <KeyRound className="h-4 w-4 text-slate-300" />
                                        <span>Ganti Password</span>
                                    </Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200 cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4 text-rose-400" />
                                        <span>Keluar</span>
                                    </Link>
                                </nav>
                            </div>
                        </details>
                    </div>
                </div>
            </header>
            {flash?.success && (
                <FlashAlert
                    key={`success-${flash.success}`}
                    type="success"
                    message={flash.success}
                    autoCloseDelay={5000}
                />
            )}
            {flash?.error && (
                <FlashAlert
                    key={`error-${flash.error}`}
                    type="error"
                    message={flash.error}
                    autoCloseDelay={5000}
                />
            )}
            <main className="flex-1">
                {children}
            </main>
            <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
                <div className="flex items-center justify-center gap-2">
                    <AppLogo size="xs" className="h-4 w-4" />
                    <span>© {new Date().getFullYear()} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.</span>
                </div>
            </footer>
        </div>
    );
}

