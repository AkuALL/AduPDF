import { Head, Link } from '@inertiajs/react';
import { UserNavbar } from '@/components/user-navbar';

type Reservation = {
    id: number;
    tujuan: string;
    start_time: string;
    end_time: string;
    status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan' | 'kedaluwarsa';
    alasan_penolakan: string | null;
    ditolak_pada: string | null;
    facility: { id: number; name: string; location: string };
};

type Props = { reservations: Reservation[]; success: string | null };

const statusConfig: Record<
    Reservation['status'],
    { label: string; classes: string; icon?: string }
> = {
    menunggu: {
        label: 'Menunggu',
        classes: 'bg-[#FFF0E8] text-[#B54708] border-[#F5C6A7]',
        icon: '○',
    },
    disetujui: {
        label: 'Disetujui',
        classes: 'bg-[#EAF7F0] text-[#16794A] border-[#B7E2CB]',
        icon: '✓',
    },
    ditolak: {
        label: 'Ditolak',
        classes: 'bg-[#FDECEC] text-[#B42318] border-[#F2B8B5]',
        icon: '×',
    },
    dibatalkan: {
        label: 'Dibatalkan',
        classes: 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
        icon: '—',
    },
    kedaluwarsa: {
        label: 'Kedaluwarsa',
        classes: 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
        icon: '—',
    },
};

export default function ReservationIndex({ reservations, success }: Props) {
    return (
        <>
            <Head title="Riwayat Reservasi — AduPDF" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reservations" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                            Riwayat Reservasi
                        </h1>
                        <p className="mt-1 text-lg text-[#667085] max-w-2xl">
                            Pantau status pengajuan dan jadwal peminjaman fasilitas Anda.
                        </p>
                        <div className="mt-4">
                            <Link
                                href="/facilities"
                                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#2D4C79] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#243E63] active:bg-[#1C3150] transition"
                            >
                                <span>+</span>
                                <span>Ajukan Reservasi</span>
                            </Link>
                        </div>
                    </div>

                    {success && (
                        <div
                            role="status"
                            className="mb-6 rounded-lg border border-green-200 bg-[#EAF7F0] p-4 text-sm font-medium text-[#16794A]"
                        >
                            {success}
                        </div>
                    )}

                    {reservations.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-white p-12 text-center">
                            <p className="text-base font-semibold text-[#111827]">
                                Belum ada riwayat reservasi
                            </p>
                            <p className="mt-1 text-sm text-[#667085]">
                                Anda belum pernah mengajukan reservasi fasilitas.
                            </p>
                            <Link
                                href="/facilities"
                                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-[#D0D5DD] bg-white px-4 text-xs font-semibold text-[#2D4C79] hover:bg-[#E9EEF5] transition"
                            >
                                Lihat Fasilitas
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {reservations.map((reservation) => {
                                const status = statusConfig[reservation.status];

                                return (
                                    <Link
                                        key={reservation.id}
                                        href={`/reservations/${reservation.id}`}
                                        className="group flex flex-col justify-between rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] hover:border-[#2D4C79] hover:shadow-md transition"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-[#2D4C79] truncate">
                                                    {reservation.facility.location}
                                                </span>
                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.classes}`}
                                                >
                                                    {status.icon && <span>{status.icon}</span>}
                                                    <span>{status.label}</span>
                                                </span>
                                            </div>

                                            <h2 className="mt-3 text-lg font-semibold text-[#111827] group-hover:text-[#2D4C79] transition-colors">
                                                {reservation.facility.name}
                                            </h2>

                                            <dl className="mt-3 space-y-1.5 text-sm text-[#667085]">
                                                <div className="flex justify-between">
                                                    <dt>Waktu:</dt>
                                                    <dd className="font-medium text-[#111827] text-right">
                                                        {reservation.start_time}–{reservation.end_time} WIB
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt>Tujuan:</dt>
                                                    <dd className="font-medium text-[#111827] text-right truncate max-w-[200px]">
                                                        {reservation.tujuan}
                                                    </dd>
                                                </div>
                                            </dl>

                                            {reservation.status === 'ditolak' && reservation.alasan_penolakan && (
                                                <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
                                                    <p>
                                                        <span className="font-semibold">Alasan penolakan:</span>{' '}
                                                        {reservation.alasan_penolakan}
                                                    </p>
                                                    {reservation.ditolak_pada && (
                                                        <p className="mt-1 text-[11px] text-red-700">
                                                            Ditolak pada {reservation.ditolak_pada} WIB
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                                            <div className="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#D0D5DD] bg-white text-sm font-semibold text-[#2D4C79] group-hover:bg-[#E9EEF5] group-hover:border-[#2D4C79] transition">
                                                Lihat Detail Reservasi →
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
