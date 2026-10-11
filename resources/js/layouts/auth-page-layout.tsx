import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { AppLogo } from '@/components/app-logo';
import campusPhoto from '../../images/Widya_puraya_undip.jpg';

export default function AuthPageLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 antialiased">
            <header className="bg-[#2D4C79] text-white shadow-md">
                <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
                        <AppLogo size="md" withBackground className="group-hover:scale-105" />
                        <span className="text-2xl font-bold tracking-wider">AduPDF</span>
                        <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium">Kampus</span>
                    </Link>
                    <span className="text-xs text-slate-200">Sistem Reservasi & Pelaporan Fasilitas</span>
                </div>
            </header>
            <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-slate-900 p-4 lg:justify-end lg:pr-36">
                <img src={campusPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                {children}
            </main>
            <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
                <div className="flex items-center justify-center gap-2">
                    <AppLogo size="xs" className="h-4 w-4" />
                    <span>© {new Date().getFullYear()} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.</span>
                </div>
            </footer>
        </div>
    );
}
