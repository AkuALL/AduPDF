import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AuthUser = {
    id: number;
    name?: string;
    nama?: string;
    email: string;
    role: string;
};

export function UserNavbar({ current }: { current?: 'facilities' | 'reservations' | 'reports' }) {
    const { auth } = usePage<{ auth?: { user?: AuthUser | null } }>().props;
    const user = auth?.user;

    const navLinkClass = (isActive: boolean) =>
        `relative py-4 ${
            isActive
                ? 'font-semibold text-[#2D4C79] after:scale-x-100'
                : 'font-medium text-[#667085] hover:text-[#2D4C79] after:scale-x-0 hover:after:scale-x-100'
        } transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2D4C79] after:origin-center after:transition-transform after:duration-500`;

    return (
        <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
            <div className="relative flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-[#2D4C79]">
                            AduPDF
                        </span>
                        <span className="rounded bg-[#E9EEF5] px-1.5 py-0.5 text-base font-semibold text-[#2D4C79]">
                            Universitas Diponegoro
                        </span>
                    </Link>
                </div>

                <nav className="hidden sm:flex sm:items-center sm:gap-6 text-base absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/facilities"
                        className={navLinkClass(current === 'facilities')}
                    >
                        Fasilitas
                    </Link>
                    {user?.role === 'pengguna' && (
                        <>
                            <Link
                                href="/reservations"
                                className={navLinkClass(current === 'reservations')}
                            >
                                Reservasi
                            </Link>
                            <Link
                                href="/reports"
                                className={navLinkClass(current === 'reports')}
                            >
                                Laporan
                            </Link>
                        </>
                    )}
                    {user?.role === 'petugas' && (
                        <Link
                            href="/petugas/reservations"
                            className="relative py-4 font-medium text-[#667085] hover:text-[#2D4C79] transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2D4C79] after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                        >
                            Panel Petugas
                        </Link>
                    )}
                    {user?.role === 'admin' && (
                        <a
                            href="/admin/facilities"
                            className="relative py-4 font-medium text-[#667085] hover:text-[#2D4C79] transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2D4C79] after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
                        >
                            Kelola Fasilitas
                        </a>
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white py-1.5 pl-2 pr-3.5 text-left transition hover:bg-[#F7F8FA] focus:outline-none focus:ring-2 focus:ring-[#2D4C79]/20 cursor-pointer shadow-xs"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E9EEF5] text-sm font-bold text-[#2D4C79]">
                                        {(user.nama || user.name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden text-left sm:block">
                                        <span className="block text-sm font-semibold text-[#111827] leading-tight">
                                            {user.nama || user.name}
                                        </span>
                                        <span className="block text-xs text-[#667085] capitalize leading-none">
                                            {user.role}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-[#667085]" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl border border-[#E5E7EB] bg-white p-1.5 text-[#111827] shadow-lg">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="font-semibold text-sm text-[#111827]">{user.nama || user.name}</div>
                                    {user.email && (
                                        <div className="truncate text-xs text-[#667085] font-normal">{user.email}</div>
                                    )}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1 bg-[#F3F4F6]" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/profile"
                                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#374151] transition hover:bg-[#F3F4F6]"
                                    >
                                        <UserIcon className="h-4 w-4 text-[#667085]" />
                                        <span>Pengaturan Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1 bg-[#F3F4F6]" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                                    >
                                        <LogOut className="h-4 w-4 text-rose-500" />
                                        <span>Keluar</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <>
                            <a
                                href="/login"
                                className="inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium text-[#111827] hover:bg-[#F3F5F7] transition"
                            >
                                Masuk
                            </a>
                            <a
                                href="/register"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                            >
                                Daftar
                            </a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
