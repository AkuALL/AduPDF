import { Head, Link } from '@inertiajs/react';

type Reservation = {
    id: number;
    tujuan: string;
    start_time: string;
    end_time: string;
    status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';
    facility: { id: number; name: string; location: string };
};

type Props = { reservations: Reservation[]; success: string | null };

const statusLabel: Record<Reservation['status'], string> = {
    menunggu: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
    dibatalkan: 'Dibatalkan',
};

export default function ReservationIndex({ reservations, success }: Props) {
    return (
        <>
            <Head title="Riwayat Reservasi" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="mx-auto max-w-3xl">
                    <Link href="/facilities" className="text-sm font-medium text-[#2D4C79] hover:underline">Kembali ke fasilitas</Link>
                    <div className="mt-6 flex items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">Riwayat reservasi</h1>
                        <Link href="/facilities" className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white">Ajukan reservasi</Link>
                    </div>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    {reservations.length === 0 ? (
                        <p className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6 text-sm text-[#667085]">Belum ada riwayat reservasi.</p>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {reservations.map((reservation) => (
                                <Link key={reservation.id} href={`/reservations/${reservation.id}`} className="block rounded-lg border border-[#E5E7EB] bg-white p-5 hover:border-[#2D4C79]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="font-semibold">{reservation.facility.name}</h2>
                                            <p className="mt-1 text-sm text-[#667085]">{reservation.start_time}–{reservation.end_time} WIB · {reservation.facility.location}</p>
                                        </div>
                                        <span className="rounded-full bg-[#E9EEF5] px-3 py-1 text-xs font-semibold text-[#2D4C79]">{statusLabel[reservation.status]}</span>
                                    </div>
                                    <p className="mt-3 line-clamp-2 text-sm text-[#667085]">{reservation.tujuan}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
