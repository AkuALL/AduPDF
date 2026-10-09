import { Form, Head, Link } from '@inertiajs/react';
import { UserNavbar } from '@/components/user-navbar';

type Reservation = {
    id: number;
    tujuan: string;
    start_time: string;
    end_time: string;
    status: string;
    alasan_penolakan: string | null;
    ditolak_pada: string | null;
    alasan_pembatalan: string | null;
    facility: { id: number; name: string; location: string };
};

type Props = { reservation: Reservation; can_cancel: boolean; success: string | null };

export default function ReservationShow({ reservation, can_cancel, success }: Props) {
    return (
        <>
            <Head title="Detail Reservasi" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reservations" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    <div className="w-full">
                        <div className="mb-6">
                            <Link
                                href="/reservations"
                                className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 transition"
                            >
                                <span aria-hidden="true">←</span> Kembali ke riwayat
                            </Link>
                        </div>
                        {success && <p role="status" className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    <article className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#667085]">{reservation.facility.location}</p>
                                <h1 className="mt-1 text-2xl font-bold">{reservation.facility.name}</h1>
                            </div>
                            <span className="rounded-full bg-[#E9EEF5] px-3 py-1 text-xs font-semibold capitalize text-[#2D4C79]">{reservation.status}</span>
                        </div>
                        <dl className="mt-6 space-y-4 border-y border-[#E5E7EB] py-5 text-sm">
                            <div><dt className="text-[#667085]">Waktu</dt><dd className="mt-1 font-medium">{reservation.start_time}–{reservation.end_time} WIB</dd></div>
                            <div><dt className="text-[#667085]">Tujuan</dt><dd className="mt-1 whitespace-pre-wrap">{reservation.tujuan}</dd></div>
                            {reservation.status === 'ditolak' && reservation.alasan_penolakan && <div><dt className="text-[#667085]">Alasan penolakan</dt><dd className="mt-1 whitespace-pre-wrap text-red-700">{reservation.alasan_penolakan}</dd>{reservation.ditolak_pada && <dd className="mt-1 text-xs text-[#667085]">Ditolak pada {reservation.ditolak_pada} WIB</dd>}</div>}
                            {reservation.alasan_pembatalan && <div><dt className="text-[#667085]">Alasan pembatalan</dt><dd className="mt-1">{reservation.alasan_pembatalan}</dd></div>}
                        </dl>
                        {can_cancel && (
                            <Form
                                action={`/reservations/${reservation.id}/cancel`}
                                method="patch"
                                onSubmit={(event) => {
                                    if (!window.confirm('Batalkan reservasi ini? Status reservasi akan berubah menjadi Dibatalkan.')) {
                                        event.preventDefault();
                                    }
                                }}
                                className="mt-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {errors.reservation && <p role="alert" className="mb-3 text-sm text-red-700">{errors.reservation}</p>}
                                        <button type="submit" disabled={processing} className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">{processing ? 'Membatalkan...' : 'Batalkan reservasi'}</button>
                                    </>
                                )}
                            </Form>
                        )}
                    </article>
                </div>
            </main>
        </div>
    </>
    );
}
