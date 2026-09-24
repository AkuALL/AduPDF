import { Form, Head } from '@inertiajs/react';
import PetugasLayout from '@/layouts/petugas-layout';

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
        <PetugasLayout activePage="reservations">
            <Head title="Antrian Reservasi" />
            <main className="mx-auto w-full max-w-[1360px] px-4 py-8 text-[#111827] sm:px-6 lg:px-8">
                <div className="w-full">
                    <h1 className="text-2xl font-bold">Antrian reservasi</h1>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    {reservations.length === 0 ? (
                        <p className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6 text-sm text-[#667085]">Tidak ada pengajuan yang menunggu.</p>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {reservations.map((reservation) => (
                                <article key={reservation.id} className="rounded-lg border border-[#E5E7EB] bg-white p-5">
                                    <h2 className="font-semibold">{reservation.facility}</h2>
                                    <p className="mt-1 text-sm text-[#667085]">{reservation.start_time}–{reservation.end_time} WIB · {reservation.location}</p>
                                    <p className="mt-3 text-sm"><span className="font-medium">Pengaju:</span> {reservation.user}</p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm text-[#667085]">{reservation.tujuan}</p>
                                    <div className="mt-5 flex gap-3">
                                        <Form action={`/petugas/reservations/${reservation.id}/approve`} method="patch">
                                            {({ processing }) => <button type="submit" disabled={processing} className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Setujui</button>}
                                        </Form>
                                        <Form action={`/petugas/reservations/${reservation.id}/reject`} method="patch">
                                            {({ processing }) => <button type="submit" disabled={processing} className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Tolak</button>}
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
                                    <article key={reservation.id} className="rounded-lg border border-[#E5E7EB] bg-white p-5">
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
