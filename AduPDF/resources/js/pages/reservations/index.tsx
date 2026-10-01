import UserPageLayout from '@/layouts/user-page-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Ban, CalendarDays, CheckCircle2, Clock3, MapPin, Plus, TimerOff, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ReservationStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan' | 'kedaluwarsa';

type Reservation = {
    id: number;
    tujuan: string;
    start_time: string;
    end_time: string;
    status: ReservationStatus;
    facility: { id: number; name: string; location: string };
};

type Props = { reservations: Reservation[]; success: string | null };

const statusConfig: Record<ReservationStatus, { label: string; classes: string; icon: LucideIcon }> = {
    menunggu: { label: 'Menunggu', classes: 'border-amber-200 bg-amber-50 text-amber-700', icon: Clock3 },
    disetujui: { label: 'Disetujui', classes: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', classes: 'border-rose-200 bg-rose-50 text-rose-700', icon: XCircle },
    dibatalkan: { label: 'Dibatalkan', classes: 'border-slate-200 bg-slate-100 text-slate-600', icon: Ban },
    kedaluwarsa: { label: 'Kedaluwarsa', classes: 'border-slate-200 bg-slate-100 text-slate-600', icon: TimerOff },
};

export default function ReservationIndex({ reservations, success }: Props) {
    const approvedCount = reservations.filter((reservation) => reservation.status === 'disetujui').length;
    const pendingCount = reservations.filter((reservation) => reservation.status === 'menunggu').length;

    return (
        <UserPageLayout active="reservations">
            <Head title="Riwayat Reservasi — AduPDF" />
            <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17324D] via-[#214B68] to-[#167C77] px-6 py-8 text-white shadow-[0_28px_70px_-34px_rgba(15,23,42,0.8)] sm:px-8 sm:py-10">
                    <div aria-hidden="true" className="absolute -right-16 -top-20 size-64 rounded-full border-[32px] border-white/5" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Aktivitas Anda</p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Riwayat reservasi</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">Pantau seluruh pengajuan, jadwal yang disetujui, dan perubahan status dalam satu tempat.</p>
                        </div>
                        <Link href="/facilities" className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#17324D] shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-50">
                            <Plus className="size-4" /> Ajukan reservasi
                        </Link>
                    </div>
                    <div className="relative mt-8 grid max-w-xl grid-cols-3 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"><p className="text-2xl font-extrabold">{reservations.length}</p><p className="mt-1 text-[11px] font-semibold text-slate-200">Total pengajuan</p></div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"><p className="text-2xl font-extrabold">{pendingCount}</p><p className="mt-1 text-[11px] font-semibold text-slate-200">Menunggu</p></div>
                        <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"><p className="text-2xl font-extrabold">{approvedCount}</p><p className="mt-1 text-[11px] font-semibold text-slate-200">Disetujui</p></div>
                    </div>
                </section>

                {success && <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm">{success}</div>}

                {reservations.length === 0 ? (
                    <section className="ui-card mt-6 grid place-items-center px-6 py-16 text-center">
                        <span className="grid size-16 place-items-center rounded-2xl bg-teal-50 text-teal-600"><CalendarDays className="size-8" /></span>
                        <h2 className="mt-5 text-xl font-extrabold text-slate-900">Belum ada reservasi</h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Pilih fasilitas dan jadwal yang tersedia untuk membuat reservasi pertama Anda.</p>
                        <Link href="/facilities" className="ui-button-primary mt-6">Jelajahi fasilitas <ArrowRight className="size-4" /></Link>
                    </section>
                ) : (
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {reservations.map((reservation) => {
                            const status = statusConfig[reservation.status];
                            const StatusIcon = status.icon;
                            return (
                                <Link key={reservation.id} href={`/reservations/${reservation.id}`} className="group ui-card relative overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_55px_-30px_rgba(15,118,110,0.45)] sm:p-6">
                                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-teal-400 to-blue-500 opacity-0 transition group-hover:opacity-100" />
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500"><MapPin className="size-3.5 text-teal-600" />{reservation.facility.location}</p>
                                            <h2 className="mt-2 truncate text-lg font-extrabold tracking-[-0.02em] text-slate-900 group-hover:text-[#17324D]">{reservation.facility.name}</h2>
                                        </div>
                                        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${status.classes}`}><StatusIcon className="size-3.5" />{status.label}</span>
                                    </div>
                                    <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
                                        <p className="flex items-start gap-2 text-sm font-semibold text-slate-700"><CalendarDays className="mt-0.5 size-4 shrink-0 text-teal-600" /><span>{reservation.start_time}<span className="mx-1 text-slate-400">—</span>{reservation.end_time} WIB</span></p>
                                    </div>
                                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">{reservation.tujuan}</p>
                                    <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#245578]">Lihat detail <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </UserPageLayout>
    );
}
