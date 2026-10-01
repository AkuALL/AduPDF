import PetugasLayout from '@/layouts/petugas-layout';
import { Form, Head } from '@inertiajs/react';
import { CalendarCheck2, Check, Clock3, MapPin, UserRound, X } from 'lucide-react';

type Reservation = {
    id: number;
    user: string;
    facility: string;
    location: string;
    tujuan: string;
    start_time: string;
    end_time: string;
};

type ApprovedReservation = Omit<Reservation, 'tujuan'>;

type Props = {
    reservations: Reservation[];
    approved_reservations: ApprovedReservation[];
    success: string | null;
};

export default function PetugasReservationIndex({ reservations, approved_reservations, success }: Props) {
    return (
        <PetugasLayout active="reservations">
            <Head title="Antrian Reservasi" />
            <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="w-full">
                    <p className="ui-eyebrow">Persetujuan jadwal</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900">Antrean reservasi</h1><p className="mt-2 text-sm text-slate-500">Tinjau pengajuan berdasarkan jadwal dan kebutuhan pengguna.</p>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    {reservations.length === 0 ? (
                        <div className="ui-card mt-6 grid place-items-center p-12 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Check className="size-7" /></span><p className="mt-4 font-bold text-slate-800">Tidak ada pengajuan yang menunggu</p><p className="mt-1 text-sm text-slate-500">Semua antrean reservasi sudah diproses.</p></div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {reservations.map((reservation) => (
                                <article key={reservation.id} className="ui-card p-5 sm:p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-extrabold text-slate-900">{reservation.facility}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="size-3.5 text-teal-600" />{reservation.location}</p></div><span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"><Clock3 className="size-3.5" />Menunggu</span></div>
                                    <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><p className="flex items-center gap-2 font-semibold text-slate-700"><CalendarCheck2 className="size-4 text-teal-600" />{reservation.start_time}–{reservation.end_time} WIB</p><p className="flex items-center gap-2 text-slate-600"><UserRound className="size-4 text-teal-600" />{reservation.user}</p></div>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-[#667085]">{reservation.tujuan}</p>
                                    <div className="mt-5 flex gap-3">
                                        <Form action={`/petugas/reservations/${reservation.id}/approve`} method="patch">
                                            {({ processing }) => <button type="submit" disabled={processing} className="ui-button-primary"><Check className="size-4" />Setujui</button>}
                                        </Form>
                                        <Form action={`/petugas/reservations/${reservation.id}/reject`} method="patch">
                                            {({ processing }) => <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"><X className="size-4" />Tolak</button>}
                                        </Form>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <section className="mt-10">
                        <h2 className="text-lg font-bold">Reservasi disetujui</h2>
                        {approved_reservations.length === 0 ? (
                            <p className="mt-4 rounded-lg border border-[#E5E7EB] bg-white p-6 text-sm text-[#667085]">Tidak ada reservasi disetujui.</p>
                        ) : (
                            <div className="mt-4 space-y-3">
                                {approved_reservations.map((reservation) => (
                                    <article key={reservation.id} className="ui-card p-5">
                                        <h3 className="font-semibold">{reservation.facility}</h3>
                                        <p className="mt-1 text-sm text-[#667085]">{reservation.start_time}–{reservation.end_time} WIB · {reservation.location}</p>
                                        <p className="mt-3 text-sm"><span className="font-medium">Pengaju:</span> {reservation.user}</p>
                                        <Form
                                            action={`/petugas/reservations/${reservation.id}/cancel`}
                                            method="patch"
                                            onSubmit={(event) => {
                                                if (! window.confirm(`Batalkan darurat reservasi ${reservation.facility}?`)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            className="mt-4"
                                        >
                                            {({ errors, processing }) => (
                                                <>
                                                    <label htmlFor={`reason-${reservation.id}`} className="block text-sm font-medium">Alasan pembatalan darurat</label>
                                                    <textarea id={`reason-${reservation.id}`} name="alasan_pembatalan" required maxLength={5000} rows={2} aria-invalid={!!errors.alasan_pembatalan} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2 text-sm" />
                                                    {(errors.alasan_pembatalan || errors.reservation) && <p role="alert" className="mt-1 text-sm text-red-700">{errors.alasan_pembatalan || errors.reservation}</p>}
                                                    <button type="submit" disabled={processing} className="mt-3 rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">{processing ? 'Membatalkan...' : 'Batalkan darurat'}</button>
                                                </>
                                            )}
                                        </Form>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </PetugasLayout>
    );
}
