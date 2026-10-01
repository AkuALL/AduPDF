import { Form, Head, Link } from '@inertiajs/react';

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

type Props = {
    reservation: Reservation;
    can_cancel: boolean;
    success: string | null;
};

export default function ReservationShow({
    reservation,
    can_cancel,
    success,
}: Props) {
    return (
        <>
            <Head title="Detail Reservasi" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="w-full">
                    <Link
                        href="/reservations"
                        className="text-sm font-medium text-[#2D4C79] hover:underline"
                    >
                        Kembali ke riwayat
                    </Link>
                    {success && (
                        <p
                            role="status"
                            className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                        >
                            {success}
                        </p>
                    )}
                    <article className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#667085]">
                                    {reservation.facility.location}
                                </p>
                                <h1 className="mt-1 text-2xl font-bold">
                                    {reservation.facility.name}
                                </h1>
                            </div>
                            <span className="rounded-full bg-[#E9EEF5] px-3 py-1 text-xs font-semibold text-[#2D4C79] capitalize">
                                {reservation.status}
                            </span>
                        </div>
                        <dl className="mt-6 space-y-4 border-y border-[#E5E7EB] py-5 text-sm">
                            <div>
                                <dt className="text-[#667085]">Waktu</dt>
                                <dd className="mt-1 font-medium">
                                    {reservation.start_time}–
                                    {reservation.end_time} WIB
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[#667085]">Tujuan</dt>
                                <dd className="mt-1 whitespace-pre-wrap">
                                    {reservation.tujuan}
                                </dd>
                            </div>
                            {reservation.status === 'ditolak' && (
                                <div className="rounded-md border border-[#F2B8B5] bg-[#FDECEC] p-3 text-[#7A271A]">
                                    <dt className="font-semibold">
                                        Alasan penolakan
                                    </dt>
                                    <dd className="mt-1 whitespace-pre-wrap">
                                        {reservation.alasan_penolakan ??
                                            'Alasan penolakan tidak tersedia.'}
                                    </dd>
                                    {reservation.ditolak_pada && (
                                        <dd className="mt-2 text-xs text-[#B42318]">
                                            Ditolak pada{' '}
                                            {reservation.ditolak_pada} WIB
                                        </dd>
                                    )}
                                </div>
                            )}
                            {reservation.alasan_pembatalan && (
                                <div>
                                    <dt className="text-[#667085]">
                                        Alasan pembatalan
                                    </dt>
                                    <dd className="mt-1">
                                        {reservation.alasan_pembatalan}
                                    </dd>
                                </div>
                            )}
                        </dl>
                        {can_cancel && (
                            <Form
                                action={`/reservations/${reservation.id}/cancel`}
                                method="patch"
                                className="mt-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {errors.reservation && (
                                            <p
                                                role="alert"
                                                className="mb-3 text-sm text-red-700"
                                            >
                                                {errors.reservation}
                                            </p>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Membatalkan...'
                                                : 'Batalkan reservasi'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        )}
                    </article>
                </div>
            </main>
        </>
    );
}
