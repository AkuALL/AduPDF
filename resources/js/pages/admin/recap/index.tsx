import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    HelpCircle,
    Info,
    RotateCcw,
    Search,
} from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';

type FacilityRecapItem = {
    id: number;
    name: string;
    type: string;
    type_label: string;
    is_tool: boolean;
    is_room: boolean;
    parent_room_name?: string | null;
    location: string;
    capacity: number;
    condition: string;
    condition_label: string;
    usage_count: number;
    usage_duration_minutes: number;
    usage_hours: number;
    unique_users_count: number;
    occupancy_rate: number;
    damage_count: number;
};

type DamageFacilityItem = {
    id: number;
    name: string;
    location: string;
    report_count: number;
    condition: string;
    condition_label: string;
    type_label: string;
};

type DamageLocationItem = {
    location: string;
    total_reports: number;
    facilities_count: number;
};

type Props = {
    period: string;
    filter_label: string;
    start_date: string;
    end_date: string;
    start_date_input: string;
    end_date_input: string;
    facility_type_filter: string | null;
    location_filter: string | null;
    search_filter: string | null;
    summary: {
        total_reservations: number;
        total_hours_used: number;
        total_damage_reports: number;
        avg_occupancy_rate: number;
        most_used_facility: string;
        most_used_count: number;
        most_damaged_facility: string;
        most_damaged_count: number;
        most_damaged_location: string;
    };
    facilities: FacilityRecapItem[];
    damage_by_facility: DamageFacilityItem[];
    damage_by_location: DamageLocationItem[];
    available_locations: string[];
    facility_types: Array<{ value: string; label: string }>;
};

export default function RecapIndex({
    period,
    filter_label,
    start_date_input,
    end_date_input,
    facility_type_filter,
    location_filter,
    search_filter,
    summary,
    facilities,
    damage_by_facility,
    damage_by_location,
    available_locations,
    facility_types,
}: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const [startDate, setStartDate] = useState(start_date_input);
    const [endDate, setEndDate] = useState(end_date_input);
    const [facilityType, setFacilityType] = useState(facility_type_filter ?? '');
    const [location, setLocation] = useState(location_filter ?? '');
    const [search, setSearch] = useState(search_filter ?? '');

    function applyFilter(e?: React.FormEvent) {
        if (e) e.preventDefault();
        router.get(
            '/admin/recap',
            {
                period: selectedPeriod,
                start_date: startDate,
                end_date: endDate,
                facility_type: facilityType || undefined,
                location: location || undefined,
                search: search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    }

    const baseExportParams = `period=${encodeURIComponent(selectedPeriod)}&start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}${facilityType ? `&facility_type=${encodeURIComponent(facilityType)}` : ''}${location ? `&location=${encodeURIComponent(location)}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
    const exportCsvUrl = `/admin/recap/export?${baseExportParams}&format=csv`;
    const exportExcelUrl = `/admin/recap/export?${baseExportParams}&format=excel`;
    const exportPdfUrl = `/admin/recap/export?${baseExportParams}&format=pdf`;

    return (
        <AdminLayout>
            <Head title="Rekapitulasi Okupansi & Kerusakan — AduPDF" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#2D4C79]/10 text-[#2D4C79]">
                                Analitik & Pelaporan
                            </span>
                            <span className="text-xs text-[#667085]">·</span>
                            <span className="text-xs text-[#667085]">Modul DA-03 & DA-04 (FR-19)</span>
                            <span className="text-xs text-[#667085]">·</span>
                            <span className="text-xs text-[#667085]">Aturan BR-21 Terverifikasi</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                            Rekapitulasi Okupansi & Kerusakan
                        </h1>
                        <p className="text-sm text-[#667085] mt-1">
                            Okupansi penggunaan fasilitas dan frekuensi laporan kerusakan per fasilitas serta lokasi kampus.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {/* CSV Export */}
                        <a
                            href={exportCsvUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-[#D0D5DD] bg-white text-[#111827] hover:bg-[#F3F5F7] shadow-2xs transition"
                            title="Unduh rekap dalam format CSV mentah"
                        >
                            <Download className="w-3.5 h-3.5 text-[#667085]" />
                            CSV
                        </a>

                        {/* Excel Export */}
                        <a
                            href={exportExcelUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-[#16794A]/30 bg-[#EAF7F0] text-[#16794A] hover:bg-[#D4EFE0] shadow-2xs transition"
                            title="Unduh rekap spreadsheet Excel terformat"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-[#16794A]" />
                            Excel (.xls)
                        </a>

                        {/* PDF Export */}
                        <a
                            href={exportPdfUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#2D4C79] text-white hover:bg-[#243E63] shadow-xs transition"
                            title="Unduh rekap dokumen PDF siap cetak"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            Dokumen PDF
                        </a>

                        <Link
                            href="/admin/dashboard"
                            className="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                    <form onSubmit={applyFilter} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                                    Periode Waktu
                                </label>
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => {
                                        setSelectedPeriod(e.target.value);
                                    }}
                                    className="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                >
                                    <option value="this_month">Bulan Ini</option>
                                    <option value="last_month">Bulan Lalu</option>
                                    <option value="last_30_days">30 Hari Terakhir</option>
                                    <option value="last_90_days">90 Hari Terakhir</option>
                                    <option value="all">Semua Waktu</option>
                                    <option value="custom">Kustom Rentang Tanggal</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                                    Tipe Fasilitas
                                </label>
                                <select
                                    value={facilityType}
                                    onChange={(e) => setFacilityType(e.target.value)}
                                    className="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                >
                                    <option value="">Semua Tipe</option>
                                    {facility_types.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#4B5563] mb-1">
                                    Lokasi / Gedung
                                </label>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                >
                                    <option value="">Semua Lokasi</option>
                                    {available_locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-[#F3F4F6]">
                            <div className="flex-1 max-w-sm">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama fasilitas..."
                                    className="w-full text-xs rounded-md border border-[#D0D5DD] px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs font-semibold rounded-md bg-[#2D4C79] text-white hover:bg-[#243E63] transition"
                                >
                                    Terapkan Filter
                                </button>
                                <Link
                                    href="/admin/recap"
                                    className="px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#667085] hover:bg-[#F3F5F7] transition"
                                >
                                    Reset
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>

                {/* 4 Kartu KPI Ringkasan Rekap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Total Reservasi Disetujui</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#111827]">{summary.total_reservations}</span>
                            <span className="text-xs text-[#667085]">penggunaan</span>
                        </div>
                        <div className="mt-2 text-xs text-[#667085]">
                            Periode: {filter_label}
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Total Jam Penggunaan</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#111827]">{summary.total_hours_used}</span>
                            <span className="text-xs text-[#667085]">jam terpakai</span>
                        </div>
                        <div className="mt-2 text-xs text-[#667085]">
                            Rata-rata Okupansi: <strong className="text-[#111827]">{summary.avg_occupancy_rate}%</strong>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Laporan Kerusakan Masuk</span>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-rose-700">{summary.total_damage_reports}</span>
                            <span className="text-xs text-[#667085]">laporan</span>
                        </div>
                        <div className="mt-2 text-xs text-[#667085]">
                            Lokasi Terbanyak: <strong className="text-[#111827]">{summary.most_damaged_location}</strong>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Fasilitas Paling Sering Dipakai</span>
                        <div className="mt-2 truncate font-bold text-lg text-[#111827]" title={summary.most_used_facility}>
                            {summary.most_used_facility}
                        </div>
                        <div className="mt-2 text-xs text-[#667085]">
                            Frekuensi: <strong className="text-[#111827]">{summary.most_used_count} kali</strong>
                        </div>
                    </div>
                </div>

                {/* Callout Box Aturan BR-21 */}
                <div className="rounded-lg bg-blue-50/70 border border-blue-200 p-4 text-xs text-[#2D4C79] flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#2D4C79] shrink-0 mt-0.5" />
                    <div>
                        <strong className="font-semibold block text-sm mb-0.5">Penetapan Aturan Rekapitulasi (BR-21):</strong>
                        Reservasi penuh ruangan dihitung secara tepat sebagai penggunaan ruangan tersebut. Alat di dalam ruangan dinonaktifkan dari pemesanan selama reservasi berlangsung, namun <em>tidak menambah frekuensi penggunaan individual alat</em>. Frekuensi penggunaan alat hanya dihitung dari reservasi alat yang diajukan dan disetujui secara eksplisit.
                    </div>
                </div>

                {/* Bagian 1: Tabel Okupansi & Penggunaan Fasilitas */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FBFBFC] flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-[#111827]">
                                Rekapitulasi Okupansi & Penggunaan Fasilitas
                            </h2>
                            <p className="text-xs text-[#667085] mt-0.5">
                                Menampilkan seluruh ruangan dan alat terdaftar beserta jam terbang pemakaian pada periode terpilih
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-[#667085] bg-white border border-[#D0D5DD] px-2.5 py-1 rounded">
                            {facilities.length} fasilitas terdata
                        </span>
                    </div>

                    {facilities.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] uppercase border-b border-[#E5E7EB]">
                                    <tr>
                                        <th className="px-6 py-3">Nama Fasilitas</th>
                                        <th className="px-6 py-3">Tipe / Ruangan Induk</th>
                                        <th className="px-6 py-3">Lokasi</th>
                                        <th className="px-6 py-3">Kondisi</th>
                                        <th className="px-6 py-3 text-center">Reservasi Disetujui</th>
                                        <th className="px-6 py-3 text-center">Total Durasi</th>
                                        <th className="px-6 py-3 text-center">Pengguna Unik</th>
                                        <th className="px-6 py-3 text-right">Tingkat Okupansi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]">
                                    {facilities.map((facility) => (
                                        <tr key={facility.id} className="hover:bg-[#F9FAFB] transition">
                                            <td className="px-6 py-3.5">
                                                <div className="font-semibold text-[#111827]">
                                                    {facility.name}
                                                </div>
                                                <div className="text-[11px] text-[#667085]">
                                                    Kapasitas: {facility.capacity} orang
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-[#4B5563]">
                                                {facility.is_tool ? (
                                                    <div>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                                            Alat
                                                        </span>
                                                        {facility.parent_room_name && (
                                                            <div className="text-[11px] text-[#667085] mt-0.5">
                                                                Ruangan: {facility.parent_room_name}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                                                        {facility.type_label}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-[#4B5563]">
                                                {facility.location}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                        facility.condition === 'aktif'
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                            : facility.condition === 'dalam_perbaikan'
                                                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                                                    }`}
                                                >
                                                    {facility.condition_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-center font-bold text-[#111827]">
                                                {facility.usage_count} kali
                                            </td>
                                            <td className="px-6 py-3.5 text-center text-xs font-medium text-[#4B5563]">
                                                {facility.usage_hours} Jam
                                            </td>
                                            <td className="px-6 py-3.5 text-center text-xs text-[#667085]">
                                                {facility.unique_users_count} orang
                                            </td>
                                            <td className="px-6 py-3.5 text-right font-semibold text-[#2D4C79]">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#2D4C79] rounded-full"
                                                            style={{ width: `${Math.min(100, facility.occupancy_rate)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs">{facility.occupancy_rate}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <p className="text-sm font-semibold text-[#111827]">Tidak Ada Fasilitas Sesuai Filter</p>
                            <p className="text-xs text-[#667085] mt-1">Coba sesuaikan filter tipe atau kata kunci pencarian Anda.</p>
                        </div>
                    )}
                </div>

                {/* Bagian 2 & 3: Frekuensi Kerusakan per Fasilitas & Lokasi */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tabel Kerusakan per Fasilitas */}
                    <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FBFBFC]">
                            <h2 className="text-base font-bold text-[#111827]">
                                Frekuensi Kerusakan per Fasilitas
                            </h2>
                            <p className="text-xs text-[#667085] mt-0.5">
                                Jumlah insiden gangguan atau kerusakan yang dilaporkan civitas
                            </p>
                        </div>

                        {damage_by_facility.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] uppercase border-b border-[#E5E7EB]">
                                        <tr>
                                            <th className="px-6 py-3">Fasilitas</th>
                                            <th className="px-6 py-3">Lokasi</th>
                                            <th className="px-6 py-3">Kondisi</th>
                                            <th className="px-6 py-3 text-right">Laporan Masuk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E5E7EB]">
                                        {damage_by_facility.map((df) => (
                                            <tr key={df.id} className="hover:bg-[#F9FAFB] transition">
                                                <td className="px-6 py-3.5 font-semibold text-[#111827]">
                                                    {df.name}
                                                </td>
                                                <td className="px-6 py-3.5 text-xs text-[#4B5563]">
                                                    {df.location}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                                                        {df.condition_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-right font-bold text-rose-700">
                                                    {df.report_count} kali
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center text-xs text-[#667085]">
                                Tidak ada laporan kerusakan pada periode filter terpilih.
                            </div>
                        )}
                    </div>

                    {/* Tabel Kerusakan per Lokasi */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#FBFBFC]">
                            <h2 className="text-base font-bold text-[#111827]">
                                Frekuensi per Lokasi
                            </h2>
                            <p className="text-xs text-[#667085] mt-0.5">
                                Titik konsentrasi insiden per gedung
                            </p>
                        </div>

                        {damage_by_location.length > 0 ? (
                            <div className="divide-y divide-[#E5E7EB]">
                                {damage_by_location.map((locStat) => (
                                    <div key={locStat.location} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F9FAFB] transition">
                                        <div>
                                            <div className="text-sm font-semibold text-[#111827]">
                                                {locStat.location}
                                            </div>
                                            <div className="text-xs text-[#667085] mt-0.5">
                                                {locStat.facilities_count} fasilitas terdata
                                            </div>
                                        </div>
                                        <span className="font-bold text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
                                            {locStat.total_reports} insiden
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center text-xs text-[#667085]">
                                Belum ada laporan kerusakan di lokasi mana pun pada periode ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
