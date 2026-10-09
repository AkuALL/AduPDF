import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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

                {/* Header & Quick Action Shortcuts */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="rounded bg-[#2D4C79]/10 px-2 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                Operasional Kampus
                            </span>
                            <span className="text-xs text-[#667085]">·</span>
                            <span className="text-xs text-[#667085]">Role: Petugas</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">Dashboard Operasional Petugas</h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Pantau antrean reservasi, laporan kerusakan baru, jadwal kegiatan hari ini, serta pemeliharaan fasilitas kampus.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <Link
                            href="/petugas/reservations"
                            className="inline-flex items-center rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2 text-xs font-medium text-[#2D4C79] shadow-2xs hover:bg-[#F3F5F7]"
                        >
                            Semua Reservasi
                        </Link>
                        <Link
                            href="/petugas/reports"
                            className="inline-flex items-center rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2 text-xs font-medium text-[#2D4C79] shadow-2xs hover:bg-[#F3F5F7]"
                        >
                            Semua Laporan
                        </Link>
                    </div>
                </div>

                {/* Kartu metrik operasional */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Metric 1: Antrean Reservasi */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('reservations')}
                        className={`flex items-center justify-between rounded-lg border p-5 text-left transition shadow-2xs ${
                            activeTab === 'reservations' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-[#E5E7EB] bg-white hover:border-[#D0D5DD]'
                        }`}
                    >
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Antrean Reservasi</span>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-[#111827]">{pending_reservations_count}</div>
                            <span className="text-xs text-[#667085]">pengajuan menunggu</span>
                        </div>
                        <span className="rounded-full border border-[#F5D6A6] bg-[#FFF5E6] px-2.5 py-1 text-xs font-semibold text-[#A15C00]">
                            ○ Menunggu
                        </span>
                    </button>

                    {/* Metric 2: Agenda Pemakaian Hari Ini */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('today')}
                        className={`flex items-center justify-between rounded-lg border p-5 text-left transition shadow-2xs ${
                            activeTab === 'today' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-[#E5E7EB] bg-white hover:border-[#D0D5DD]'
                        }`}
                    >
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Agenda Hari Ini</span>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-[#111827]">{today_reservations_count}</div>
                            <span className="text-xs text-[#667085]">kegiatan disetujui</span>
                        </div>
                        <span className="rounded-full border border-[#B7E2CB] bg-[#EAF7F0] px-2.5 py-1 text-xs font-semibold text-[#16794A]">
                            ✓ Disetujui
                        </span>
                    </button>

                    {/* Metric 3: Laporan Kerusakan Baru */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('reports')}
                        className={`flex items-center justify-between rounded-lg border p-5 text-left transition shadow-2xs ${
                            activeTab === 'reports' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-[#E5E7EB] bg-white hover:border-[#D0D5DD]'
                        }`}
                    >
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Antrean Kerusakan</span>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-[#111827]">{new_reports_count}</div>
                            <span className="text-xs text-[#667085]">laporan baru</span>
                        </div>
                        <span className="rounded-full border border-[#F5D6A6] bg-[#FFF5E6] px-2.5 py-1 text-xs font-semibold text-[#A15C00]">
                            ○ Baru
                        </span>
                    </button>

                    {/* Metric 4: Fasilitas Dalam Perbaikan */}
                    <button
                        type="button"
                        onClick={() => setActiveTab('repair')}
                        className={`flex items-center justify-between rounded-lg border p-5 text-left transition shadow-2xs ${
                            activeTab === 'repair' ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20' : 'border-[#E5E7EB] bg-white hover:border-[#D0D5DD]'
                        }`}
                    >
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Dalam Perbaikan</span>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-[#111827]">{under_repair_facilities_count}</div>
                            <span className="text-xs text-[#667085]">fasilitas diperbaiki</span>
                        </div>
                        <span className="rounded-full border border-[#F5C6A7] bg-[#FFF0E8] px-2.5 py-1 text-xs font-semibold text-[#B54708]">
                            ! Perbaikan
                        </span>
                    </button>
                </div>

                {/* Filter Bar & Tabs Navigation */}
                <div className="mb-6 flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white p-3 shadow-2xs md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                activeTab === 'all' ? 'bg-[#2D4C79] text-white' : 'text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827]'
                            }`}
                        >
                            Semua Tampilan
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('reservations')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                activeTab === 'reservations' ? 'bg-[#2D4C79] text-white' : 'text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827]'
                            }`}
                        >
                            Antrean Reservasi ({pending_reservations_count})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('today')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                activeTab === 'today' ? 'bg-[#2D4C79] text-white' : 'text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827]'
                            }`}
                        >
                            Agenda Hari Ini ({today_reservations_count})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('reports')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                activeTab === 'reports' ? 'bg-[#2D4C79] text-white' : 'text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827]'
                            }`}
                        >
                            Laporan Baru ({new_reports_count})
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('repair')}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                                activeTab === 'repair' ? 'bg-[#2D4C79] text-white' : 'text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827]'
                            }`}
                        >
                            Fasilitas Perbaikan ({under_repair_facilities_count})
                        </button>
                    </div>

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari fasilitas, peminjam, atau tujuan..."
                            className="w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs text-[#111827] placeholder-[#98A2B3] focus:border-[#2D4C79] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#98A2B3] hover:text-[#111827]"
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[#111827]">
                                    <span>Antrean Reservasi Menunggu (Segmen Slot Waktu)</span>
                                    <span className="rounded-full bg-[#2D4C79]/10 px-2 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                        {pending_reservations_count}
                                    </span>
                                </h2>
                                <p className="mt-0.5 text-xs text-[#667085]">
                                    Dikelompokkan per slot waktu penggunaan (slot terdekat ditampilkan lebih dahulu), dan diurutkan secara FIFO (First In, First Out).
                                </p>
                            </div>
                        </div>

                        {filteredSegments.length === 0 ? (
                            <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F0] text-[#16794A]">
                                    ✓
                                </div>
                                <h3 className="text-base font-semibold text-[#111827]">Tidak Ada Antrean Reservasi</h3>
                                <p className="mt-1 text-sm text-[#667085]">
                                    {searchQuery
                                        ? 'Tidak ditemukan reservasi yang sesuai dengan kata kunci pencarian.'
                                        : 'Seluruh pengajuan reservasi telah diproses. Tidak ada reservasi yang sedang menunggu keputusan saat ini.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredSegments.map((segment) => (
                                    <div key={segment.slot_key} className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                                            <div>
                                                <div className="text-sm font-bold text-[#111827]">{segment.slot_label}</div>
                                                <div className="text-xs text-[#667085]">
                                                    Rentang Slot: {segment.start_time} – {segment.end_time}
                                                </div>
                                            </div>
                                            <span className="rounded-full border border-[#BFD6ED] bg-[#E9EEF5] px-2.5 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                                {segment.count} Pengajuan di Slot Ini
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold uppercase text-[#667085]">
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
                                                                <div className="font-semibold text-[#111827]">{res.facility_name}</div>
                                                                <div className="text-xs text-[#667085]">{res.facility_location}</div>
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-[#111827]">{res.user_name}</td>
                                                            <td className="max-w-xs px-4 py-3 text-xs text-[#667085]">{res.tujuan}</td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                                <div className="font-medium text-[#111827]">{res.created_at}</div>
                                                                <div className="text-[#667085]">{res.created_at_human}</div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                                <div className="inline-flex items-start gap-2">
                                                                    <Form
                                                                        action={`/petugas/reservations/${res.id}/approve`}
                                                                        method="patch"
                                                                        onSubmit={(event) => {
                                                                            if (!window.confirm('Setujui reservasi ini? Pengajuan menunggu lain yang berbenturan dapat otomatis ditolak.')) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }}
                                                                    >
                                                                        {({ processing }) => (
                                                                            <button
                                                                                type="submit"
                                                                                disabled={processing}
                                                                                className="rounded bg-[#16794A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#12633c] disabled:opacity-50"
                                                                            >
                                                                                Setujui
                                                                            </button>
                                                                        )}
                                                                    </Form>
                                                                    <Form
                                                                        action={`/petugas/reservations/${res.id}/reject`}
                                                                        method="patch"
                                                                        onSubmit={(event) => {
                                                                            if (!window.confirm('Tolak reservasi ini? Statusnya akan menjadi Ditolak dan tidak dapat disetujui lagi.')) {
                                                                                event.preventDefault();
                                                                            }
                                                                        }}
                                                                        className="w-48 text-left"
                                                                    >
                                                                        {({ errors, processing }) => (
                                                                            <>
                                                                                <label htmlFor={`dashboard-rejection-reason-${res.id}`} className="sr-only">Alasan penolakan</label>
                                                                                <textarea
                                                                                    id={`dashboard-rejection-reason-${res.id}`}
                                                                                    name="alasan_penolakan"
                                                                                    required
                                                                                    maxLength={5000}
                                                                                    rows={2}
                                                                                    placeholder="Alasan penolakan"
                                                                                    aria-invalid={!!errors.alasan_penolakan}
                                                                                    className="w-full rounded border border-[#D0D5DD] px-2 py-1.5 text-xs"
                                                                                />
                                                                                {(errors.alasan_penolakan || errors.reservation) && (
                                                                                    <p role="alert" className="mt-1 text-xs text-[#B42318]">{errors.alasan_penolakan || errors.reservation}</p>
                                                                                )}
                                                                                <button
                                                                                    type="submit"
                                                                                    disabled={processing}
                                                                                    className="mt-1.5 rounded border border-[#F2B8B5] bg-[#FDECEC] px-3 py-1.5 text-xs font-semibold text-[#B42318] hover:bg-[#FCD8D8] disabled:opacity-50"
                                                                                >
                                                                                    {processing ? 'Menolak...' : 'Tolak'}
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </Form>
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[#111827]">
                                    <span>Agenda Pemakaian Fasilitas Hari Ini</span>
                                    <span className="rounded-full bg-[#16794A]/10 px-2 py-0.5 text-xs font-semibold text-[#16794A]">
                                        {today_reservations_count}
                                    </span>
                                </h2>
                                <p className="mt-0.5 text-xs text-[#667085]">
                                    Jadwal kegiatan yang telah disetujui untuk berlangsung pada hari ini. Membantu koordinasi dan verifikasi di lapangan.
                                </p>
                            </div>
                        </div>

                        {filteredToday.length === 0 ? (
                            <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F5F7] text-[#667085]">
                                    ℹ
                                </div>
                                <h3 className="text-base font-semibold text-[#111827]">Tidak Ada Agenda Penggunaan Hari Ini</h3>
                                <p className="mt-1 text-sm text-[#667085]">
                                    {searchQuery
                                        ? 'Tidak ada agenda hari ini yang sesuai dengan pencarian.'
                                        : 'Belum ada reservasi fasilitas yang terjadwal aktif untuk hari ini.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold uppercase text-[#667085]">
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
                                                        <div className="font-semibold text-[#111827]">{item.time_range}</div>
                                                        <div className="text-xs text-[#667085]">Hari ini</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-[#111827]">{item.facility_name}</div>
                                                        <div className="text-xs text-[#667085]">{item.facility_location}</div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-[#111827]">{item.user_name}</td>
                                                    <td className="max-w-xs px-4 py-3 text-xs text-[#667085] line-clamp-2" title={item.tujuan}>
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[#111827]">
                                    <span>Antrean Laporan Kerusakan Baru</span>
                                    <span className="rounded-full bg-[#2D4C79]/10 px-2 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                        {new_reports_count}
                                    </span>
                                </h2>
                                <p className="mt-0.5 text-xs text-[#667085]">
                                    Laporan kerusakan berstatus baru yang membutuhkan verifikasi atau tindak lanjut penanganan teknis.
                                </p>
                            </div>
                        </div>

                        {filteredReports.length === 0 ? (
                            <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F0] text-[#16794A]">
                                    ✓
                                </div>
                                <h3 className="text-base font-semibold text-[#111827]">Tidak Ada Laporan Baru</h3>
                                <p className="mt-1 text-sm text-[#667085]">
                                    {searchQuery
                                        ? 'Tidak ditemukan laporan yang cocok dengan kata kunci pencarian.'
                                        : 'Belum ada laporan kerusakan baru yang perlu diproses.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold uppercase text-[#667085]">
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
                                                        <div className="font-semibold text-[#111827]">{rep.facility_name}</div>
                                                        <div className="text-xs text-[#667085]">
                                                            {rep.facility_location} · <span className="font-medium text-[#B54708]">Kondisi: {rep.facility_condition}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-[#111827]">{rep.reporter_name}</td>
                                                    <td className="max-w-sm px-4 py-3">
                                                        <div className="inline-block rounded bg-[#F0F2F4] px-1.5 py-0.5 text-[11px] font-semibold text-[#5D6673]">
                                                            {rep.kategori}
                                                        </div>
                                                        <div className="text-xs text-[#667085] line-clamp-2">{rep.deskripsi}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                        <div className="font-medium text-[#111827]">{rep.created_at}</div>
                                                        <div className="text-[#667085]">{rep.created_at_human}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                                        <Link
                                                            href={`/petugas/reports/${rep.id}`}
                                                            className="rounded bg-[#2D4C79] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#243E63]"
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
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-[#111827]">
                                    <span>Monitoring Fasilitas Dalam Perbaikan</span>
                                    <span className="rounded-full bg-[#B54708]/10 px-2 py-0.5 text-xs font-semibold text-[#B54708]">
                                        {under_repair_facilities_count}
                                    </span>
                                </h2>
                                <p className="mt-0.5 text-xs text-[#667085]">
                                    Daftar aset fasilitas kampus yang saat ini dinonaktifkan sementara untuk penanganan kerusakan teknis.
                                </p>
                            </div>
                        </div>

                        {filteredUnderRepair.length === 0 ? (
                            <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
                                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7F0] text-[#16794A]">
                                    ✓
                                </div>
                                <h3 className="text-base font-semibold text-[#111827]">Semua Fasilitas Berfungsi Normal</h3>
                                <p className="mt-1 text-sm text-[#667085]">
                                    {searchQuery
                                        ? 'Tidak ditemukan fasilitas perbaikan yang sesuai kata kunci.'
                                        : 'Saat ini tidak ada fasilitas kampus yang sedang dalam status perbaikan.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-2xs">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold uppercase text-[#667085]">
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
                                                    <td className="px-4 py-3 font-semibold text-[#111827]">
                                                        {fac.name}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-[#667085]">
                                                        <span className="capitalize">{fac.type.replace('_', ' ')}</span> · {fac.location}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-[#667085]">
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
        </PetugasLayout>
    );
}
