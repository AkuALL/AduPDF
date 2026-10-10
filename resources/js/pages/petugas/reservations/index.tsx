import { Form, Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    CalendarCheck,
    CalendarClock,
    Check,
    Clock,
    Search,
    ShieldAlert,
    User,
    X,
} from 'lucide-react';
import ConfirmationDialog, {
    type ConfirmationRequest,
} from '@/components/confirm-dialog';
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

export default function PetugasReservationIndex({
    reservations,
    approved_reservations,
    success,
}: Props) {
    const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);

    // Modal state for Rejection
    const [rejectingItem, setRejectingItem] = useState<Reservation | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // Modal state for Emergency Cancellation
    const [cancellingItem, setCancellingItem] = useState<ApprovedReservation | null>(null);
    const [cancelReason, setCancelReason] = useState('');

    // Filter pending
    const filteredPending = useMemo(() => {
        if (!searchQuery.trim()) return reservations;
        const q = searchQuery.toLowerCase();
        return reservations.filter(
            (r) =>
                r.facility.toLowerCase().includes(q) ||
                r.user.toLowerCase().includes(q) ||
                r.location.toLowerCase().includes(q) ||
                r.tujuan.toLowerCase().includes(q)
        );
    }, [reservations, searchQuery]);

    // Filter approved
    const filteredApproved = useMemo(() => {
        if (!searchQuery.trim()) return approved_reservations;
        const q = searchQuery.toLowerCase();
        return approved_reservations.filter(
            (r) =>
                r.facility.toLowerCase().includes(q) ||
                r.user.toLowerCase().includes(q) ||
                r.location.toLowerCase().includes(q)
        );
    }, [approved_reservations, searchQuery]);

    function handleRejectSubmit() {
        if (!rejectingItem || !rejectReason.trim()) return;
        router.patch(
            `/petugas/reservations/${rejectingItem.id}/reject`,
            { alasan_penolakan: rejectReason.trim() },
            {
                onSuccess: () => {
                    setRejectingItem(null);
                    setRejectReason('');
                },
            }
        );
    }

    function handleCancelSubmit() {
        if (!cancellingItem || !cancelReason.trim()) return;
        router.patch(
            `/petugas/reservations/${cancellingItem.id}/cancel`,
            { alasan_pembatalan: cancelReason.trim() },
            {
                onSuccess: () => {
                    setCancellingItem(null);
                    setCancelReason('');
                },
            }
        );
    }

    return (
        <PetugasLayout activePage="reservations">
            <Head title="Kelola Antrean Reservasi — Petugas" />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Antrean Reservasi Fasilitas
                        </h1>
                    </div>
                </div>

                {/* Flash Success Notification */}
                {success && (
                    <div
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 shadow-sm"
                    >
                        {success}
                    </div>
                )}

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('pending')}
                        className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md cursor-pointer ${
                            activeTab === 'pending'
                                ? 'border-[#2D4C79] ring-2 ring-[#2D4C79]/20'
                                : 'border-slate-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Menunggu Persetujuan
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-700">
                                <CalendarClock className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-slate-900">
                            {reservations.length}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">pengajuan perlu diproses</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('approved')}
                        className={`rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md cursor-pointer ${
                            activeTab === 'approved'
                                ? 'border-[#2D4C79] ring-2 ring-[#2D4C79]/20'
                                : 'border-slate-200'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Reservasi Disetujui
                            </span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700">
                                <CalendarCheck className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-2 text-3xl font-bold text-slate-900">
                            {approved_reservations.length}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">kegiatan terverifikasi aktif</div>
                    </button>
                </div>

                {/* Search & Active Info Bar (Tanpa Sub-Tab Redundan) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Kategori Terpilih:{' '}
                        <span className="text-slate-900 font-bold">
                            {activeTab === 'pending' ? 'Menunggu Keputusan' : 'Reservasi Disetujui'}
                        </span>{' '}
                        ({activeTab === 'pending' ? filteredPending.length : filteredApproved.length} pengajuan)
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari fasilitas, pemesan, atau lokasi..."
                            className="w-full rounded-md border border-slate-300 bg-white pl-8 pr-7 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#2D4C79] focus:outline-none focus:ring-1 focus:ring-[#2D4C79] shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 cursor-pointer"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Content based on Active Tab */}
                {activeTab === 'pending' ? (
                    filteredPending.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <CalendarClock className="h-6 w-6" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                {searchQuery ? 'Tidak Ada Hasil Pencarian' : 'Tidak Ada Pengajuan Menunggu'}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                {searchQuery
                                    ? 'Coba gunakan kata kunci pencarian yang lain.'
                                    : 'Seluruh antrean pengajuan reservasi telah selesai diproses.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700">
                                    <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                        <tr>
                                            <th className="px-5 py-3">Fasilitas & Lokasi</th>
                                            <th className="px-5 py-3">Jadwal Penggunaan</th>
                                            <th className="px-5 py-3">Pemesan & Tujuan</th>
                                            <th className="px-5 py-3 text-right">Aksi Keputusan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredPending.map((res) => (
                                            <tr key={res.id} className="transition hover:bg-slate-50/80">
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900">{res.facility}</div>
                                                    <div className="mt-0.5 text-xs text-slate-500">{res.location}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-xs">
                                                    <div className="font-medium text-slate-900">{res.start_time}</div>
                                                    <div className="text-slate-500">s/d {res.end_time} WIB</div>
                                                </td>
                                                <td className="max-w-xs px-5 py-4">
                                                    <div className="text-xs font-semibold text-slate-900">{res.user}</div>
                                                    <div className="mt-0.5 text-xs text-slate-600 line-clamp-2" title={res.tujuan}>
                                                        {res.tujuan}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <div className="inline-flex items-center gap-2">
                                                        <Form
                                                            action={`/petugas/reservations/${res.id}/approve`}
                                                            method="patch"
                                                        >
                                                            {({ processing, submit }) => (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setConfirmation({
                                                                            title: 'Setujui Reservasi',
                                                                            description: `Setujui reservasi untuk ${res.facility}? Pengajuan lain yang berbenturan akan otomatis ditolak.`,
                                                                            confirmLabel: 'Ya, Setujui Reservasi',
                                                                            onConfirm: submit,
                                                                        })
                                                                    }
                                                                    disabled={processing}
                                                                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 cursor-pointer"
                                                                >
                                                                    <Check className="h-3.5 w-3.5" />
                                                                    Setujui
                                                                </button>
                                                            )}
                                                        </Form>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRejectingItem(res);
                                                                setRejectReason('');
                                                            }}
                                                            className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300 active:bg-rose-200 cursor-pointer"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            Tolak
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                ) : filteredApproved.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                            {searchQuery ? 'Tidak Ada Hasil Pencarian' : 'Tidak Ada Reservasi yang Disetujui'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            {searchQuery
                                ? 'Coba ubah kata kunci pencarian Anda.'
                                : 'Belum ada reservasi aktif yang disetujui saat ini.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-700">
                                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3">Fasilitas & Lokasi</th>
                                        <th className="px-5 py-3">Jadwal Penggunaan</th>
                                        <th className="px-5 py-3">Pengaju Reservasi</th>
                                        <th className="px-5 py-3 text-right">Tindakan Khusus</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredApproved.map((res) => (
                                        <tr key={res.id} className="transition hover:bg-slate-50/80">
                                            <td className="px-5 py-4">
                                                <div className="font-semibold text-slate-900">{res.facility}</div>
                                                <div className="mt-0.5 text-xs text-slate-500">{res.location}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-xs">
                                                <div className="font-medium text-slate-900">{res.start_time}</div>
                                                <div className="text-slate-500">s/d {res.end_time} WIB</div>
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-900">
                                                {res.user}
                                            </td>
                                            <td className="whitespace-nowrap px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCancellingItem(res);
                                                        setCancelReason('');
                                                    }}
                                                    className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300 active:bg-rose-200 cursor-pointer"
                                                >
                                                    <ShieldAlert className="h-3.5 w-3.5" />
                                                    Batalkan Darurat
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Standard Confirmation Dialog */}
            <ConfirmationDialog
                confirmation={confirmation}
                onOpenChange={(open) => {
                    if (!open) setConfirmation(null);
                }}
            />

            {/* Rejection Modal Dialog */}
            <ConfirmationDialog
                confirmation={
                    rejectingItem
                        ? {
                              title: 'Tolak Pengajuan Reservasi',
                              description: `Tolak pengajuan reservasi untuk ${rejectingItem.facility} oleh ${rejectingItem.user}? Status akan berubah menjadi Ditolak permanen.`,
                              confirmLabel: 'Tolak Reservasi',
                              destructive: true,
                              onConfirm: handleRejectSubmit,
                          }
                        : null
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setRejectingItem(null);
                        setRejectReason('');
                    }
                }}
                confirmDisabled={!rejectReason.trim()}
            >
                {rejectingItem && (
                    <div className="mt-3 space-y-1.5 text-left">
                        <label
                            htmlFor="rejection-reason-modal"
                            className="block text-xs font-semibold text-slate-700"
                        >
                            Alasan Penolakan <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            id="rejection-reason-modal"
                            rows={3}
                            required
                            maxLength={5000}
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Tuliskan alasan penolakan secara jelas agar diketahui oleh pemohon..."
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            autoFocus
                        />
                    </div>
                )}
            </ConfirmationDialog>

            {/* Emergency Cancellation Modal Dialog */}
            <ConfirmationDialog
                confirmation={
                    cancellingItem
                        ? {
                              title: 'Batalkan Reservasi Darurat',
                              description: `Batalkan darurat reservasi ${cancellingItem.facility} yang telah disetujui sebelumnya? Status akan diubah menjadi Dibatalkan.`,
                              confirmLabel: 'Ya, Batalkan Darurat',
                              destructive: true,
                              onConfirm: handleCancelSubmit,
                          }
                        : null
                }
                onOpenChange={(open) => {
                    if (!open) {
                        setCancellingItem(null);
                        setCancelReason('');
                    }
                }}
                confirmDisabled={!cancelReason.trim()}
            >
                {cancellingItem && (
                    <div className="mt-3 space-y-1.5 text-left">
                        <label
                            htmlFor="cancellation-reason-modal"
                            className="block text-xs font-semibold text-slate-700"
                        >
                            Alasan Pembatalan Darurat <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            id="cancellation-reason-modal"
                            rows={3}
                            required
                            maxLength={5000}
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Contoh: Terjadi gangguan teknis atau renovasi darurat pada fasilitas..."
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                            autoFocus
                        />
                    </div>
                )}
            </ConfirmationDialog>
        </PetugasLayout>
    );
}
