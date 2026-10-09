import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Building2, ChevronDown, KeyRound, LayoutDashboard, LogOut, Menu, UserCheck, UserPlus, Users } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { FlashAlert } from '@/components/flash-alert';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AuthUser = { name?: string; nama?: string; email?: string };

const navigation = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        isActive: (currentPath: string) => currentPath === '/admin/dashboard' || currentPath === '/admin',
    },
    {
        label: 'Rekap & Analitik',
        href: '/admin/recap',
        icon: BarChart3,
        isActive: (currentPath: string) => currentPath.startsWith('/admin/recap'),
    },
    {
        label: 'Kelola Fasilitas',
        href: '/admin/facilities',
        icon: Building2,
        isActive: (currentPath: string) => currentPath.startsWith('/admin/facilities'),
    },
    {
        label: 'Kelola Akun',
        href: '/admin/users',
        icon: Users,
        isActive: (currentPath: string) =>
            currentPath === '/admin/users' ||
            currentPath.startsWith('/admin/verifications') ||
            (currentPath.startsWith('/admin/users') &&
                !currentPath.startsWith('/admin/users/petugas') &&
                !currentPath.startsWith('/admin/users/pengguna')),
    },
    {
        label: 'Tambah Petugas',
        href: '/admin/users/petugas/create',
        icon: UserCheck,
        isActive: (currentPath: string) => currentPath.startsWith('/admin/users/petugas'),
    },
    {
        label: 'Tambah Pengguna',
        href: '/admin/users/pengguna/create',
        icon: UserPlus,
        isActive: (currentPath: string) => currentPath.startsWith('/admin/users/pengguna'),
    },
];

export default function AdminLayout({ children }: PropsWithChildren) {
    const page = usePage<{
        auth: { user: AuthUser };
        flash?: { success?: string; error?: string };
    }>();
    const { auth, flash } = page.props;
    const currentPath = page.url.split('?')[0];

    const displayName = auth.user.nama ?? auth.user.name ?? 'Admin';
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 antialiased">
            <header className="sticky top-0 z-40 bg-[#2D4C79] text-white shadow-md border-b border-[#243E63]">
                <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
                            <span className="text-2xl font-bold tracking-wider group-hover:text-amber-200 transition">AduPDF</span>
                            <span className="rounded-md border border-amber-400/40 bg-amber-500/30 px-2 py-0.5 text-xs font-semibold text-amber-200 shadow-xs">
                                ADMIN
                            </span>
                        </Link>
                        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Navigasi Menu Admin">
                            {navigation.map((item) => {
                                const active = item.isActive(currentPath);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`group flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                                            active
                                                ? 'bg-white text-[#2D4C79] font-bold shadow-md shadow-black/10 ring-1 ring-white/20'
                                                : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Icon className={`h-4 w-4 transition-colors ${active ? 'text-[#2D4C79]' : 'text-slate-300 group-hover:text-white'}`} />
                                        <span>{item.label}</span>
                                        {active && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#2D4C79]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Admin Profile Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-2.5 rounded-lg p-1.5 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 font-bold text-sm">
                                        {initial}
                                    </div>
                                    <div className="hidden text-left sm:block">
                                        <div className="flex items-center gap-1 text-sm font-semibold leading-tight text-white">
                                            <span>{displayName}</span>
                                            <ChevronDown className="h-3.5 w-3.5 text-slate-300 opacity-80" />
                                        </div>
                                        <div className="text-[11px] text-slate-300">Administrator</div>
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
                                        href="/admin/change-password"
                                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                                    >
                                        <KeyRound className="h-4 w-4 text-slate-500" />
                                        <span>Ganti Password</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/logout"
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
                            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-white/20">
                                <Menu className="h-5 w-5 text-white" />
                            </summary>
                            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/15 bg-[#243E63] p-2 shadow-xl">
                                <nav className="grid gap-1">
                                    {navigation.map((item) => {
                                        const active = item.isActive(currentPath);
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                aria-current={active ? 'page' : undefined}
                                                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                                    active
                                                        ? 'bg-white text-[#2D4C79] font-bold shadow-sm'
                                                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <Icon className={`h-4 w-4 ${active ? 'text-[#2D4C79]' : 'text-slate-300'}`} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </details>
                    </div>
                </div>
            </header>

            <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
                {flash?.success && (
                    <FlashAlert key={`success-${flash.success}`} type="success" message={flash.success} autoCloseDelay={5000} />
                )}
                {flash?.error && (
                    <FlashAlert key={`error-${flash.error}`} type="error" message={flash.error} autoCloseDelay={5000} />
                )}
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.
            </footer>
        </div>
    );
}
