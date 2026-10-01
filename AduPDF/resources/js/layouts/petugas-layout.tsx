import { Link, usePage } from '@inertiajs/react';
import { Building2, CalendarCheck2, ClipboardCheck, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { type PropsWithChildren, useState } from 'react';

type ActivePage = 'dashboard' | 'reservations' | 'reports';

type Props = PropsWithChildren<{ active: ActivePage }>;

const navigation = [
    { key: 'dashboard', label: 'Dashboard', href: '/petugas/dashboard', icon: LayoutDashboard },
    { key: 'reservations', label: 'Reservasi', href: '/petugas/reservations', icon: CalendarCheck2 },
    { key: 'reports', label: 'Laporan', href: '/petugas/reports', icon: ClipboardCheck },
] as const;

export default function PetugasLayout({ active, children }: Props) {
    const { auth } = usePage<{ auth?: { user?: { nama?: string; name?: string } } }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#F4F7FB] text-slate-900">
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_10%_0%,rgba(20,184,166,0.13),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.12),transparent_30%)]" />
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#112A42]/95 text-white shadow-xl shadow-slate-900/10 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <Link href="/petugas/dashboard" className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-2xl bg-teal-400/15 text-teal-300 ring-1 ring-inset ring-teal-300/20"><ShieldCheck className="size-5" /></span>
                            <span><span className="block text-lg font-extrabold leading-none tracking-[-0.03em]">AduPDF</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-teal-300">Petugas Console</span></span>
                        </Link>
                        <nav className="hidden items-center gap-1 md:flex">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = active === item.key;
                                return <Link key={item.key} href={item.href} className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${isActive ? 'bg-white text-[#17324D] shadow-md' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="size-4" />{item.label}</Link>;
                            })}
                        </nav>
                    </div>
                    <div className="hidden items-center gap-3 md:flex">
                        <Link href="/facilities" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white"><Building2 className="size-4" />Katalog</Link>
                        <div className="h-6 w-px bg-white/15" />
                        <span className="max-w-36 truncate text-xs font-semibold text-slate-200">{auth?.user?.nama || auth?.user?.name || 'Petugas'}</span>
                        <Link href="/logout" method="post" as="button" aria-label="Keluar" className="grid size-9 place-items-center rounded-xl text-slate-300 hover:bg-rose-500/15 hover:text-rose-200"><LogOut className="size-4" /></Link>
                    </div>
                    <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-xl border border-white/15 text-slate-200 md:hidden" aria-label="Buka navigasi">{mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
                </div>
                {mobileMenuOpen && <nav className="grid gap-1 border-t border-white/10 px-4 py-4 md:hidden">{navigation.map((item) => { const Icon = item.icon; return <Link key={item.key} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"><Icon className="size-4" />{item.label}</Link>; })}<Link href="/facilities" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-200 hover:bg-white/10"><Building2 className="size-4" />Katalog fasilitas</Link></nav>}
            </header>
            <div className="relative z-10">{children}</div>
        </div>
    );
}
