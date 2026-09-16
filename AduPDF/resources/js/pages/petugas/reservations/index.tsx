import { Form, Head, Link } from '@inertiajs/react';

type Reservation = {
    id: number;
    user: string;
    facility: string;
    location: string;
    tujuan: string;
    start_time: string;
    end_time: string;
};

type Props = { reservations: Reservation[]; success: string | null };

export default function PetugasReservationIndex({ reservations, success }: Props) {
    return (
        <>
            <Head title="Antrian Reservasi" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="mx-auto max-w-3xl">
                    <Link href="/facilities" className="text-sm font-medium text-[#2D4C79] hover:underline">Kembali ke fasilitas</Link>
                    <h1 className="mt-6 text-2xl font-bold">Antrian reservasi</h1>
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
                </div>
            </main>
        </>
    );
}
