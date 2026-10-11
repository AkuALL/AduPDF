import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FlashAlert } from '@/components/flash-alert';
import { UserNavbar } from '@/components/user-navbar';

type Reservation = {
    id: number;
    tujuan: string;
    start_time: string;
    end_time: string;
    status: 'menunggu' | 'disetujui' | 'ditolak' | 'dibatalkan';
    alasan_penolakan: string | null;
    ditolak_pada: string | null;
    can_cancel?: boolean;
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
};

export default function ReservationIndex({ reservations, success }: Props) {
    const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    function handleCancel() {
        if (!reservationToCancel) return;
        setCancelError(null);
        router.patch(
            `/reservations/${reservationToCancel.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onStart: () => setIsCancelling(true),
                onSuccess: () => {
                    setIsCancelling(false);
                    setReservationToCancel(null);
                },
                onError: (errors) => {
                    setIsCancelling(false);
                    if (errors.reservation) {
                        setCancelError(errors.reservation);
                    }
                },
            }
        );
    }
    return (
        <>
            <Head title="Riwayat Reservasi — AduPDF" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reservations" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                                Riwayat Reservasi
                            </h1>
                            <p className="mt-1 text-lg text-[#667085]">
                                Pantau status pengajuan dan jadwal peminjaman fasilitas Anda.
                            </p>
                        </div>
                        <Link
                            href="/facilities"
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#2D4C79] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#243E63] active:bg-[#1C3150] transition shrink-0 cursor-pointer"
                        >
                            <span>+</span>
                            <span>Ajukan Reservasi</span>
                        </Link>
                    </div>

                    {success && (
                        <FlashAlert
                            type="success"
                            message={success}
                            autoCloseDelay={5000}
                        />
                    )}
                    {cancelError && (
                        <FlashAlert
                            type="error"
                            message={cancelError}
                            autoCloseDelay={5000}
                        />
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
                                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-[#D0D5DD] bg-white px-4 text-xs font-semibold text-[#2D4C79] hover:bg-[#E9EEF5] transition cursor-pointer"
                            >
                                Lihat Fasilitas
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {reservations.map((reservation) => {
                                const status = statusConfig[reservation.status];

                                return (
                                    <div
                                        key={reservation.id}
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

                                            <Link
                                                href={`/reservations/${reservation.id}`}
                                                className="mt-3 block text-lg font-semibold text-[#111827] hover:text-[#2D4C79] transition-colors cursor-pointer"
                                            >
                                                {reservation.facility.name}
                                            </Link>

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

                                        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center gap-2">
                                            <Link
                                                href={`/reservations/${reservation.id}`}
                                                className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-[#D0D5DD] bg-white text-xs font-semibold text-[#2D4C79] hover:bg-[#E9EEF5] hover:border-[#2D4C79] transition cursor-pointer"
                                            >
                                                Lihat Detail →
                                            </Link>
                                            {reservation.status === 'menunggu' && (
                                                reservation.can_cancel ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCancelError(null);
                                                            setReservationToCancel(reservation);
                                                        }}
                                                        className="inline-flex h-9 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition shrink-0 cursor-pointer"
                                                    >
                                                        Batalkan
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        title="Pembatalan hanya dapat dilakukan paling lambat 48 jam sebelum jadwal dimulai"
                                                        className="inline-flex h-9 items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-400 cursor-not-allowed opacity-60 shrink-0"
                                                    >
                                                        Batalkan
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <ConfirmDialog
                        open={reservationToCancel !== null}
                        onOpenChange={(open) => {
                            if (!isCancelling && !open) {
                                setReservationToCancel(null);
                                setCancelError(null);
                            }
                        }}
                        title="Batalkan Reservasi"
                        description="Apakah Anda yakin ingin membatalkan pengajuan reservasi ini? Status reservasi akan berubah menjadi Dibatalkan secara permanen."
                        confirmText="Ya, Batalkan Reservasi"
                        variant="destructive"
                        isLoading={isCancelling}
                        onConfirm={handleCancel}
                    >
                        {reservationToCancel && (
                            <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs">
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-[#667085]">Fasilitas:</span>
                                    <span className="font-semibold text-slate-800">{reservationToCancel.facility.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#667085]">Jadwal:</span>
                                    <span className="font-medium text-slate-800">{reservationToCancel.start_time}–{reservationToCancel.end_time} WIB</span>
                                </div>
                            </div>
                        )}

                        {cancelError && (
                            <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                {cancelError}
                            </div>
                        )}
                    </ConfirmDialog>
                </main>
            </div>
        </>
    );
}
