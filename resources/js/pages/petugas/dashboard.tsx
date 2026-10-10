import { Form, Head, Link, usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AlertTriangle, CalendarCheck, CalendarClock, Wrench } from 'lucide-react';
import ConfirmationDialog, {
    type ConfirmationRequest,
} from '@/components/confirmation-dialog';
import { FlashAlert } from '@/components/flash-alert';
import PetugasLayout from '@/layouts/petugas-layout';

type ReservationItem = {
    id: number;
    user_name: string;
    facility_name: string;
    facility_location: string;
    tujuan: string;
    status: string;
    created_at: string;
    created_at_human: string;
};

type ReservationSegment = {
    slot_key: string;
    slot_label: string;
    start_time: string;
    end_time: string;
    count: number;
    reservations: ReservationItem[];
};

type ReportItem = {
    id: number;
    kategori: string;
    deskripsi: string;
    reporter_name: string;
    facility_name: string;
    facility_location: string;
    facility_condition: string;
    status: string;
    created_at: string;
    created_at_human: string;
};

type TodayReservationItem = {
    id: number;
    user_name: string;
    facility_name: string;
    facility_location: string;
    tujuan: string;
    status: string;
    time_range: string;
    start_time: string;
    end_time: string;
};

type UnderRepairFacilityItem = {
    id: number;
    name: string;
    type: string;
    location: string;
    condition: string;
    child_tools_count: number;
};

type Props = {
    pending_reservations_count: number;
    new_reports_count: number;
    today_reservations_count?: number;
    under_repair_facilities_count?: number;
    reservation_segments: ReservationSegment[];
    reports: ReportItem[];
    today_reservations?: TodayReservationItem[];
    under_repair_facilities?: UnderRepairFacilityItem[];
};

export default function PetugasDashboard({
    pending_reservations_count,
    new_reports_count,
    today_reservations_count = 0,
    under_repair_facilities_count = 0,
    reservation_segments,
    reports,
    today_reservations = [],
    under_repair_facilities = [],
}: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [activeTab, setActiveTab] = useState<'all' | 'reservations' | 'reports' | 'today' | 'repair'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);
    const [reservationToReject, setReservationToReject] = useState<ReservationItem | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const rejectionConfirmation: ConfirmationRequest | null = reservationToReject
        ? {
              title: 'Tolak Reservasi',
              description: `Tolak reservasi ${reservationToReject.facility_name}? Statusnya akan menjadi Ditolak.`,
              confirmLabel: 'Ya, Tolak Reservasi',
              destructive: true,
              onConfirm: () => {
                  const reason = rejectionReason.trim();
                  if (reason) {
                      router.patch(`/petugas/reservations/${reservationToReject.id}/reject`, { alasan_penolakan: reason });
                  }
              },
          }
        : null;

    // Filter reservation segments by search query
    const filteredSegments = useMemo(() => {
        if (!searchQuery.trim()) return reservation_segments;
        const query = searchQuery.toLowerCase();

        return reservation_segments
            .map((segment) => {
                const matched = segment.reservations.filter(
                    (res) =>
                        res.facility_name.toLowerCase().includes(query) ||
                        res.user_name.toLowerCase().includes(query) ||
                        res.tujuan.toLowerCase().includes(query) ||
                        res.facility_location.toLowerCase().includes(query)
                );
                return {
                    ...segment,
                    count: matched.length,
                    reservations: matched,
                };
            })
            .filter((segment) => segment.reservations.length > 0);
    }, [reservation_segments, searchQuery]);

    // Filter reports by search query
    const filteredReports = useMemo(() => {
        if (!searchQuery.trim()) return reports;
        const query = searchQuery.toLowerCase();

        return reports.filter(
            (rep) =>
                rep.facility_name.toLowerCase().includes(query) ||
                rep.reporter_name.toLowerCase().includes(query) ||
                rep.deskripsi.toLowerCase().includes(query) ||
                rep.kategori.toLowerCase().includes(query) ||
                rep.facility_location.toLowerCase().includes(query)
        );
    }, [reports, searchQuery]);

    // Filter today reservations by search query
    const filteredToday = useMemo(() => {
        if (!searchQuery.trim()) return today_reservations;
        const query = searchQuery.toLowerCase();

        return today_reservations.filter(
            (item) =>
                item.facility_name.toLowerCase().includes(query) ||
                item.user_name.toLowerCase().includes(query) ||
                item.tujuan.toLowerCase().includes(query) ||
                item.facility_location.toLowerCase().includes(query)
        );
    }, [today_reservations, searchQuery]);

    // Filter under repair facilities by search query
    const filteredUnderRepair = useMemo(() => {
        if (!searchQuery.trim()) return under_repair_facilities;
        const query = searchQuery.toLowerCase();

        return under_repair_facilities.filter(
            (fac) =>
                fac.name.toLowerCase().includes(query) ||
                fac.location.toLowerCase().includes(query) ||
                fac.type.toLowerCase().includes(query)
        );
    }, [under_repair_facilities, searchQuery]);

    return (
        <PetugasLayout activePage="dashboard">
            <Head title="Dashboard Petugas — AduPDF" />
            <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
                {/* Flash messages */}
                {flash?.success && (
                    <FlashAlert key={`success-${flash.success}`} type="success" message={flash.success} autoCloseDelay={5000} className="mb-6" />
                )}
                {flash?.error && (
                    <FlashAlert key={`error-${flash.error}`} type="error" message={flash.error} autoCloseDelay={5000} className="mb-6" />
                )}

                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard Operasional Petugas</h1>
                    </div>
                </div>

                {/* Kartu metrik operasional */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: Antrean Reservasi */}
                    <button
                        type="button"
                        onClick={() => setActiveTab(activeTab === 'reservations' ? 'all' : 'reservations')}
                        className={`flex items-center justify-between rounded-xl border p-5 text-left transition shadow-sm cursor-pointer ${
                            activeTab === 'reservations' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                    >
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Antrean Reservasi</span>
                            <div className="mt-2 text-3xl font-bold text-slate-900">{pending_reservations_count}</div>
                            <span className="text-xs text-slate-500">pengajuan menunggu</span>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                            <CalendarClock className="h-4.5 w-4.5" />
                        </span>
                    </button>

                    {/* Metric 2: Agenda Pemakaian Hari Ini */}
                    <button
                        type="button"
                        onClick={() => setActiveTab(activeTab === 'today' ? 'all' : 'today')}
                        className={`flex items-center justify-between rounded-xl border p-5 text-left transition shadow-sm cursor-pointer ${
                            activeTab === 'today' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                    >
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Agenda Hari Ini</span>
                            <div className="mt-2 text-3xl font-bold text-slate-900">{today_reservations_count}</div>
                            <span className="text-xs text-slate-500">kegiatan disetujui</span>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CalendarCheck className="h-4.5 w-4.5" />
                        </span>
                    </button>

                    {/* Metric 3: Laporan Kerusakan Baru */}
                    <button
                        type="button"
                        onClick={() => setActiveTab(activeTab === 'reports' ? 'all' : 'reports')}
                        className={`flex items-center justify-between rounded-xl border p-5 text-left transition shadow-sm cursor-pointer ${
                            activeTab === 'reports' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                    >
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Antrean Kerusakan</span>
                            <div className="mt-2 text-3xl font-bold text-slate-900">{new_reports_count}</div>
                            <span className="text-xs text-slate-500">laporan baru</span>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-4.5 w-4.5" />
                        </span>
                    </button>

                    {/* Metric 4: Fasilitas Dalam Perbaikan */}
                    <button
                        type="button"
                        onClick={() => setActiveTab(activeTab === 'repair' ? 'all' : 'repair')}
                        className={`flex items-center justify-between rounded-xl border p-5 text-left transition shadow-sm cursor-pointer ${
                            activeTab === 'repair' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                        }`}
                    >
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dalam Perbaikan</span>
                            <div className="mt-2 text-3xl font-bold text-slate-900">{under_repair_facilities_count}</div>
                            <span className="text-xs text-slate-500">fasilitas diperbaiki</span>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                            <Wrench className="h-4.5 w-4.5" />
                        </span>
                    </button>
                </div>

                {/* Filter Bar */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        {activeTab !== 'all' && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">Filter aktif:</span>
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#2D4C79]/10 px-2.5 py-1 text-xs font-medium text-[#2D4C79]">
                                    {activeTab === 'reservations' && 'Antrean Reservasi'}
                                    {activeTab === 'today' && 'Agenda Hari Ini'}
                                    {activeTab === 'reports' && 'Antrean Kerusakan'}
                                    {activeTab === 'repair' && 'Dalam Perbaikan'}
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('all')}
                                        className="ml-1 text-[#2D4C79] hover:text-slate-900 cursor-pointer"
                                        title="Reset filter"
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari fasilitas, peminjam, atau tujuan..."
                            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#2D4C79] focus:outline-none focus:ring-1 focus:ring-[#2D4C79] shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-900 cursor-pointer"
                                title="Hapus pencarian"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                {/* Section 1: Antrean Reservasi Menunggu */}
                {(activeTab === 'all' || activeTab === 'reservations') && (
                    <section className="mb-10 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <span>Antrean Reservasi Menunggu</span>
                                    <span className="rounded-full bg-[#2D4C79]/10 px-2 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                        {pending_reservations_count}
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {filteredSegments.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F0] text-[#16794A]">
                                    ✓
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Tidak Ada Antrean Reservasi</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {searchQuery
                                        ? 'Tidak ditemukan reservasi yang sesuai dengan kata kunci pencarian.'
                                        : 'Seluruh pengajuan reservasi telah diproses. Tidak ada reservasi yang sedang menunggu keputusan saat ini.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredSegments.map((segment) => (
                                    <div key={segment.slot_key} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-[#F8FAFC] px-4 py-3">
                                            <div>
                                                <div className="text-sm font-bold text-slate-900">{segment.slot_label}</div>
                                                <div className="text-xs text-slate-500">
                                                    Rentang Slot: {segment.start_time} – {segment.end_time}
                                                </div>
                                            </div>
                                            <span className="rounded-full border border-[#BFD6ED] bg-[#E9EEF5] px-2.5 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                                {segment.count} Pengajuan di Slot Ini
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                                    <tr>
                                                        <th className="px-4 py-3">Fasilitas</th>
                                                        <th className="px-4 py-3">Pemesan</th>
                                                        <th className="px-4 py-3">Tujuan</th>
                                                        <th className="px-4 py-3">Diajukan</th>
                                                        <th className="px-4 py-3 text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#E5E7EB]">
                                                    {segment.reservations.map((res) => (
                                                        <tr key={res.id} className="hover:bg-[#F8FAFC]">
                                                            <td className="px-4 py-3">
                                                                <div className="font-semibold text-slate-900">{res.facility_name}</div>
                                                                <div className="text-xs text-slate-500">{res.facility_location}</div>
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-slate-900">{res.user_name}</td>
                                                            <td className="max-w-xs px-4 py-3 text-xs text-slate-500">{res.tujuan}</td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                                <div className="font-medium text-slate-900">{res.created_at}</div>
                                                                <div className="text-slate-500">{res.created_at_human}</div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                                <div className="inline-flex items-start gap-2">
                                                                    <Form
                                                                        action={`/petugas/reservations/${res.id}/approve`}
                                                                        method="patch"
                                                                    >
                                                                        {({ processing, submit }) => (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setConfirmation({
                                                                                    title: 'Setujui Reservasi',
                                                                                    description: 'Setujui reservasi ini? Pengajuan menunggu lain yang berbenturan dapat otomatis ditolak.',
                                                                                    confirmLabel: 'Ya, Setujui Reservasi',
                                                                                    onConfirm: submit,
                                                                                })}
                                                                                disabled={processing}
                                                                                className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 cursor-pointer transition-colors"
                                                                            >
                                                                                Setujui
                                                                            </button>
                                                                        )}
                                                                    </Form>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setConfirmation(null);
                                                                            setRejectionReason('');
                                                                            setReservationToReject(res);
                                                                        }}
                                                                        className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:border-rose-300 active:bg-rose-200 cursor-pointer transition-colors"
                                                                    >
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
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Section 2: Agenda Pemakaian Hari Ini */}
                {(activeTab === 'all' || activeTab === 'today') && (
                    <section className="mb-10 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <span>Agenda Pemakaian Fasilitas Hari Ini</span>
                                    <span className="rounded-full bg-[#16794A]/10 px-2 py-0.5 text-xs font-semibold text-[#16794A]">
                                        {today_reservations_count}
                                    </span>
                                </h2>
                            </div>
                        </div>

                        {filteredToday.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F7] text-slate-500">
                                    ℹ
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Tidak Ada Agenda Penggunaan Hari Ini</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {searchQuery
                                        ? 'Tidak ada agenda hari ini yang sesuai dengan pencarian.'
                                        : 'Belum ada reservasi fasilitas yang terjadwal aktif untuk hari ini.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Waktu Pemakaian</th>
                                                <th className="px-4 py-3">Fasilitas & Lokasi</th>
                                                <th className="px-4 py-3">Pemesan</th>
                                                <th className="px-4 py-3">Tujuan Kegiatan</th>
                                                <th className="px-4 py-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E5E7EB]">
                                            {filteredToday.map((item) => (
                                                <tr key={item.id} className="hover:bg-[#F8FAFC]">
                                                    <td className="whitespace-nowrap px-4 py-3">
                                                        <div className="font-semibold text-slate-900">{item.time_range}</div>
                                                        <div className="text-xs text-slate-500">Hari ini</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-slate-900">{item.facility_name}</div>
                                                        <div className="text-xs text-slate-500">{item.facility_location}</div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-900">{item.user_name}</td>
                                                    <td className="max-w-xs px-4 py-3 text-xs text-slate-500 line-clamp-2" title={item.tujuan}>
                                                        {item.tujuan}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                                        <span className="rounded-full border border-[#B7E2CB] bg-[#EAF7F0] px-2.5 py-0.5 text-xs font-semibold text-[#16794A]">
                                                            ✓ Disetujui
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Section 3: Antrean Laporan Kerusakan Baru */}
                {(activeTab === 'all' || activeTab === 'reports') && (
                    <section className="mb-10 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <span>Antrean Laporan Kerusakan Baru</span>
                                    <span className="rounded-full bg-[#2D4C79]/10 px-2 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                        {new_reports_count}
                                    </span>
                                </h2>
                                
                            </div>
                        </div>

                        {filteredReports.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F0] text-[#16794A]">
                                    ✓
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Tidak Ada Laporan Baru</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {searchQuery
                                        ? 'Tidak ditemukan laporan yang cocok dengan kata kunci pencarian.'
                                        : 'Belum ada laporan kerusakan baru yang perlu diproses.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Fasilitas</th>
                                                <th className="px-4 py-3">Pelapor</th>
                                                <th className="px-4 py-3">Kategori & Deskripsi</th>
                                                <th className="px-4 py-3">Waktu Lapor</th>
                                                <th className="px-4 py-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E5E7EB]">
                                            {filteredReports.map((rep) => (
                                                <tr key={rep.id} className="hover:bg-[#F8FAFC]">
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-slate-900">{rep.facility_name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {rep.facility_location} · <span className="font-medium text-[#B54708]">Kondisi: {rep.facility_condition}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-slate-900">{rep.reporter_name}</td>
                                                    <td className="max-w-sm px-4 py-3">
                                                        <div className="inline-block rounded bg-[#F0F2F4] px-1.5 py-0.5 text-[11px] font-semibold text-[#5D6673]">
                                                            {rep.kategori}
                                                        </div>
                                                        <div className="text-xs text-slate-500 line-clamp-2">{rep.deskripsi}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                        <div className="font-medium text-slate-900">{rep.created_at}</div>
                                                        <div className="text-slate-500">{rep.created_at_human}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                                        <Link
                                                            href={`/petugas/reports/${rep.id}`}
                                                            className="rounded bg-[#2D4C79] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] cursor-pointer"
                                                        >
                                                            Detail & Proses →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Section 4: Monitoring Fasilitas Dalam Perbaikan */}
                {(activeTab === 'all' || activeTab === 'repair') && (
                    <section className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <span>Monitoring Fasilitas Dalam Perbaikan</span>
                                    <span className="rounded-full bg-[#B54708]/10 px-2 py-0.5 text-xs font-semibold text-[#B54708]">
                                        {under_repair_facilities_count}
                                    </span>
                                </h2>
                                
                            </div>
                        </div>

                        {filteredUnderRepair.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F0] text-[#16794A]">
                                    ✓
                                </div>
                                <h3 className="text-base font-semibold text-slate-900">Semua Fasilitas Berfungsi Normal</h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {searchQuery
                                        ? 'Tidak ditemukan fasilitas perbaikan yang sesuai kata kunci.'
                                        : 'Saat ini tidak ada fasilitas kampus yang sedang dalam status perbaikan.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Nama Fasilitas</th>
                                                <th className="px-4 py-3">Tipe & Lokasi</th>
                                                <th className="px-4 py-3">Peralatan Terkait</th>
                                                <th className="px-4 py-3 text-right">Kondisi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E5E7EB]">
                                            {filteredUnderRepair.map((fac) => (
                                                <tr key={fac.id} className="hover:bg-[#F8FAFC]">
                                                    <td className="px-4 py-3 font-semibold text-slate-900">
                                                        {fac.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-500">
                                                        <span className="capitalize">{fac.type.replace('_', ' ')}</span> · {fac.location}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-500">
                                                        {fac.child_tools_count > 0 ? `${fac.child_tools_count} alat terpasang` : '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                                        <span className="rounded-full border border-[#F5C6A7] bg-[#FFF0E8] px-2.5 py-0.5 text-xs font-semibold text-[#B54708]">
                                                            ! Dalam perbaikan
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>
            <ConfirmationDialog
                confirmation={rejectionConfirmation ?? confirmation}
                onOpenChange={(open) => {
                    if (!open) {
                        setConfirmation(null);
                        setReservationToReject(null);
                        setRejectionReason('');
                    }
                }}
                confirmDisabled={Boolean(reservationToReject && !rejectionReason.trim())}
            >
                {reservationToReject && (
                    <div className="mt-2 space-y-1">
                        <label htmlFor="reservation-rejection-reason" className="text-sm font-medium text-slate-700">
                            Alasan penolakan
                        </label>
                        <textarea
                            id="reservation-rejection-reason"
                            required
                            maxLength={5000}
                            rows={3}
                            value={rejectionReason}
                            onChange={(event) => setRejectionReason(event.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>
                )}
            </ConfirmationDialog>
        </PetugasLayout>
    );
}
