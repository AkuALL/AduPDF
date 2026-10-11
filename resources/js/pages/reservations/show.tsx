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
    status: string;
    alasan_penolakan: string | null;
    ditolak_pada: string | null;
    alasan_pembatalan: string | null;
    facility: { id: number; name: string; location: string };
};

type Props = { reservation: Reservation; can_cancel: boolean; success: string | null };

export default function ReservationShow({ reservation, can_cancel, success }: Props) {
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelError, setCancelError] = useState<string | null>(null);

    function handleCancel() {
        setCancelError(null);
        router.patch(
            `/reservations/${reservation.id}/cancel`,
            {},
            {
                preserveScroll: true,
                onStart: () => setIsCancelling(true),
                onSuccess: () => {
                    setIsCancelling(false);
                    setIsCancelOpen(false);
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
            <Head title="Detail Reservasi" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reservations" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    <div className="w-full">
                        <div className="mb-6">
                            <Link
                                href="/reservations"
                                className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 transition cursor-pointer"
                            >
                                <span aria-hidden="true">←</span> Kembali ke riwayat
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
                        {reservation.status === 'menunggu' && (
                            <div className="mt-6">
                                {can_cancel ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCancelError(null);
                                                setIsCancelOpen(true);
                                            }}
                                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 active:bg-red-700 transition cursor-pointer"
                                        >
                                            Batalkan reservasi
                                        </button>

                                        <ConfirmDialog
                                            open={isCancelOpen}
                                            onOpenChange={(open) => {
                                                if (!isCancelling) setIsCancelOpen(open);
                                            }}
                                            title="Batalkan Reservasi"
                                            description="Apakah Anda yakin ingin membatalkan pengajuan reservasi ini? Status reservasi akan berubah menjadi Dibatalkan secara permanen."
                                            confirmText="Ya, Batalkan Reservasi"
                                            variant="destructive"
                                            isLoading={isCancelling}
                                            onConfirm={handleCancel}
                                        >
                                            <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs">
                                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                                    <span className="text-[#667085]">Fasilitas:</span>
                                                    <span className="font-semibold text-slate-800">{reservation.facility.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[#667085]">Jadwal:</span>
                                                    <span className="font-medium text-slate-800">{reservation.start_time}–{reservation.end_time} WIB</span>
                                                </div>
                                            </div>

                                            {cancelError && (
                                                <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                                    {cancelError}
                                                </div>
                                            )}
                                        </ConfirmDialog>
                                    </>
                                ) : (
                                    <div>
                                        <button
                                            type="button"
                                            disabled
                                            title="Pembatalan hanya dapat dilakukan paling lambat 48 jam sebelum jadwal dimulai"
                                            className="rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400 cursor-not-allowed opacity-60"
                                        >
                                            Batalkan reservasi
                                        </button>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Pembatalan mandiri tidak dapat dilakukan karena sudah melewati batas H-48 jam sebelum jadwal dimulai.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </article>
                </div>
            </main>
        </div>
    </>
    );
}
