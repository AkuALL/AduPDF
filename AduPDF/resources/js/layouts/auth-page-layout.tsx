import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type AuthPageLayoutProps = PropsWithChildren<{
    variant?: 'default' | 'register';
}>;

export default function AuthPageLayout({ children, variant = 'default' }: AuthPageLayoutProps) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;

    if (variant === 'register') {
        return (
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-100 text-slate-800 antialiased">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <img
                        src="/registrasiLapanganBasket.webp"
                        alt=""
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <header className="relative z-10 bg-[#2D4C79] text-white shadow-md">
                    <div className="flex h-[88px] w-full items-start justify-between px-8 pt-3">
                        <Link href="/" className="flex items-center gap-3">
                            <span className="text-2xl font-bold tracking-wider">AduPDF</span>
                            <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium">Kampus</span>
                        </Link>
                        <span className="pt-4 text-[17px] leading-4 text-slate-200">Sistem Reservasi & Pelaporan Fasilitas</span>
                    </div>
                </header>
                <main className="relative z-10 flex flex-1 justify-end px-[4.5rem] pb-[5.3rem] pt-[2.95rem]">
                    {flash?.status && (
                        <div role="status" className="absolute left-1/2 top-6 max-w-md -translate-x-1/2 rounded border-l-4 border-emerald-500 bg-emerald-50 p-3 text-sm text-emerald-800">
                            {flash.status}
                        </div>
                    )}
                    {children}
                </main>
                <footer className="relative z-10 border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.
                </footer>
            </div>
        );
    }

    return <div className="flex min-h-screen flex-col bg-slate-100 text-slate-800 antialiased">
        <header className="bg-[#2D4C79] text-white shadow-md"><div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8"><Link href="/" className="flex items-center gap-3"><span className="text-2xl font-bold tracking-wider">AduPDF</span><span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium">Kampus</span></Link><span className="text-xs text-slate-200">Sistem Reservasi & Pelaporan Fasilitas</span></div></header>
        <main className="flex flex-1 items-center justify-center p-4">{flash?.status && <div role="status" className="absolute top-20 mx-auto max-w-md rounded border-l-4 border-emerald-500 bg-emerald-50 p-3 text-sm text-emerald-800">{flash.status}</div>}{children}</main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} AduPDF. Sistem Reservasi & Pelaporan Fasilitas Kampus.</footer>
    </div>;
}
