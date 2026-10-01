import UserPageLayout from '@/layouts/user-page-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Ban, CalendarDays, CheckCircle2, Clock3, MapPin, Target, TimerOff, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ReservationStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan' | 'kedaluwarsa';

type Reservation = {
    id: number;
    tujuan: string;
    start_time: string;
    end_time: string;
    status: ReservationStatus;
    alasan_pembatalan: string | null;
    facility: { id: number; name: string; location: string };
};

type Props = { reservation: Reservation; can_cancel: boolean; success: string | null };

const statusConfig: Record<ReservationStatus, { label: string; description: string; classes: string; icon: LucideIcon }> = {
    menunggu: { label: 'Menunggu persetujuan', description: 'Pengajuan sedang ditinjau oleh petugas.', classes: 'border-amber-200 bg-amber-50 text-amber-700', icon: Clock3 },
    disetujui: { label: 'Reservasi disetujui', description: 'Jadwal fasilitas sudah diamankan untuk Anda.', classes: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
    ditolak: { label: 'Reservasi ditolak', description: 'Pengajuan tidak dapat disetujui oleh petugas.', classes: 'border-rose-200 bg-rose-50 text-rose-700', icon: XCircle },
    dibatalkan: { label: 'Reservasi dibatalkan', description: 'Reservasi ini sudah tidak aktif.', classes: 'border-slate-200 bg-slate-100 text-slate-600', icon: Ban },
    kedaluwarsa: { label: 'Pengajuan kedaluwarsa', description: 'Waktu penggunaan telah terlewati.', classes: 'border-slate-200 bg-slate-100 text-slate-600', icon: TimerOff },
};

export default function ReservationShow({ reservation, can_cancel, success }: Props) {
    const status = statusConfig[reservation.status];
    const StatusIcon = status.icon;

    return (
        <UserPageLayout active="reservations">
            <Head title={`${reservation.facility.name} — Detail Reservasi`} />
            <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link href="/reservations" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#17324D]"><ArrowLeft className="size-4" />Kembali ke riwayat</Link>
                {success && <div role="status" className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{success}</div>}

                <article className="ui-card mt-5 overflow-hidden">
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#17324D] via-[#214B68] to-[#167C77] px-6 py-8 text-white sm:px-8 sm:py-10">
                        <div aria-hidden="true" className="absolute -right-12 -top-20 size-56 rounded-full border-[28px] border-white/5" />
                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="flex items-center gap-2 text-sm font-semibold text-teal-100"><MapPin className="size-4" />{reservation.facility.location}</p>
                                <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">{reservation.facility.name}</h1>
                                <p className="mt-2 text-sm text-slate-200">ID Reservasi #{reservation.id}</p>
                            </div>
                            <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold ${status.classes}`}><StatusIcon className="size-4" />{status.label}</span>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <div className={`flex items-start gap-3 rounded-2xl border p-4 ${status.classes}`}><StatusIcon className="mt-0.5 size-5 shrink-0" /><div><p className="font-bold">{status.label}</p><p className="mt-1 text-sm opacity-80">{status.description}</p></div></div>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><CalendarDays className="size-4 text-teal-600" />Jadwal penggunaan</dt><dd className="mt-3 text-sm font-bold leading-6 text-slate-800">{reservation.start_time}<br /><span className="text-slate-400">sampai</span> {reservation.end_time} WIB</dd></div>
                            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><Target className="size-4 text-teal-600" />Tujuan penggunaan</dt><dd className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{reservation.tujuan}</dd></div>
                            {reservation.alasan_pembatalan && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wider text-rose-600">Alasan pembatalan</dt><dd className="mt-2 text-sm leading-6 text-rose-800">{reservation.alasan_pembatalan}</dd></div>}
                        </dl>

                        {can_cancel && (
                            <Form action={`/reservations/${reservation.id}/cancel`} method="patch" className="mt-7 border-t border-slate-100 pt-6">
                                {({ processing, errors }) => <>{errors.reservation && <p role="alert" className="mb-3 text-sm font-medium text-rose-700">{errors.reservation}</p>}<button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"><Ban className="size-4" />{processing ? 'Membatalkan...' : 'Batalkan reservasi'}</button></>}
                            </Form>
                        )}
                    </div>
                </article>
            </main>
        </UserPageLayout>
    );
}
