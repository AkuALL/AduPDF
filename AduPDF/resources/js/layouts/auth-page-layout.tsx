import { Link, usePage } from '@inertiajs/react';
import { Building2, ShieldCheck } from 'lucide-react';
import type { PropsWithChildren } from 'react';

export default function AuthPageLayout({ children }: PropsWithChildren) {
    const { flash } = usePage<{ flash?: { status?: string } }>().props;
    return <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F3F7FA] text-slate-800 antialiased">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(20,184,166,0.16),transparent_28rem),radial-gradient(circle_at_90%_0%,rgba(59,130,246,0.14),transparent_30rem)]" />
        <header className="relative z-10 border-b border-white/70 bg-white/70 backdrop-blur-xl"><div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8"><Link href="/facilities" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#17324D] to-[#1B7F79] text-white shadow-lg shadow-slate-900/15"><Building2 className="size-5" /></span><span><span className="block text-lg font-extrabold leading-none tracking-[-0.03em] text-[#17324D]">AduPDF</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-600">Campus Space</span></span></Link><span className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex"><ShieldCheck className="size-4 text-teal-600" />Akses fasilitas kampus yang aman dan terkelola</span></div></header>
        <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">{flash?.status && <div role="status" className="absolute top-4 mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50/95 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">{flash.status}</div>}{children}</main>
        <footer className="relative z-10 border-t border-white/80 bg-white/50 py-5 text-center text-xs font-medium text-slate-500 backdrop-blur">© {new Date().getFullYear()} AduPDF · Universitas Diponegoro</footer>
    </div>;
}
