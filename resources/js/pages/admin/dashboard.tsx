import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Building2,
    CalendarCheck,
    CheckCircle2,
    KeyRound,
    PlusCircle,
    UserCheck,
    Users,
} from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

type TopFacility = {
    id: number;
    name: string;
    type: string;
    type_label: string;
    is_tool: boolean;
    parent_room?: string | null;
    location: string;
    condition: string;
    usage_count: number;
    usage_hours: number;
};

type UnderRepairItem = {
    id: number;
    name: string;
    location: string;
    type: string;
    is_tool: boolean;
    parent_room?: string | null;
    condition: string;
};

type Props = {
    month_label: string;
    facility_stats: {
        total: number;
        active: number;
        under_repair: number;
        inactive: number;
        rooms: number;
        tools: number;
        fields: number;
    };
    usage_stats: {
        total_reservations: number;
        total_hours: number;
        top_used_facilities: TopFacility[];
    };
    maintenance_stats: {
        month_reports_count: number;
        under_repair_count: number;
        under_repair_list: UnderRepairItem[];
        top_damaged_facilities: Array<{
            id: number;
            name: string;
            location: string;
            report_count: number;
        }>;
        top_damaged_locations: Array<{
            location: string;
            total_reports: number;
            facilities_count: number;
        }>;
    };
    account_stats: {
        total_users: number;
        pengguna_count: number;
        petugas_count: number;
        admin_count: number;
    };
};

export default function AdminDashboard({
    month_label,
    facility_stats,
    usage_stats,
    maintenance_stats,
    account_stats,
}: Props) {
    return (
        <AdminLayout>
            <Head title="Dashboard Administrasi — AduPDF" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                Pusat Kendali & Tata Kelola
                            </span>
                            <span className="text-xs text-[#667085]">·</span>
                            <span className="text-xs text-[#667085]">Role: Administrator</span>
                            <span className="text-xs text-[#667085]">·</span>
                            <span className="text-xs text-[#667085]">{month_label}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                            Dashboard Administrasi
                        </h1>
                        <p className="text-sm text-[#667085] mt-1">
                            Ringkasan tata kelola fasilitas, penggunaan, dan pengawasan akun civitas.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                            href="/admin/recap"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-[#2D4C79] text-white hover:bg-[#243E63] shadow-xs transition"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Rekap & Ekspor
                        </Link>
                        <Link
                            href="/admin/facilities"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                        >
                            <Building2 className="w-4 h-4 text-[#667085]" />
                            Kelola Fasilitas
                        </Link>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md border border-[#D0D5DD] bg-white text-[#2D4C79] hover:bg-[#F3F5F7] transition"
                        >
                            <Users className="w-4 h-4 text-[#667085]" />
                            Kelola Akun
                        </Link>
                    </div>
                </div>

                {/* 4 Kartu KPI Eksekutif */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Kartu 1: Infrastruktur Fasilitas */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Infrastruktur Fasilitas</span>
                            <span className="w-8 h-8 rounded-md bg-[#2D4C79]/10 text-[#2D4C79] flex items-center justify-center">
                                <Building2 className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#111827]">{facility_stats.total}</span>
                            <span className="text-xs text-[#667085]">total fasilitas</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                            <span className="text-emerald-700 font-medium">{facility_stats.active} aktif</span>
                            <span>·</span>
                            <span className="text-amber-700 font-medium">{facility_stats.under_repair} perbaikan</span>
                            <span>·</span>
                            <span className="text-rose-700 font-medium">{facility_stats.inactive} nonaktif</span>
                        </div>
                    </div>

                    {/* Kartu 2: Pemakaian Bulan Ini */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Pemakaian ({month_label})</span>
                            <span className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                                <CalendarCheck className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#111827]">{usage_stats.total_reservations}</span>
                            <span className="text-xs text-[#667085]">reservasi disetujui</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                            <span>Total: <strong className="text-[#111827]">{usage_stats.total_hours} Jam</strong></span>
                            <span className="text-[11px] text-[#2D4C79] font-medium" title="Reservasi penuh dihitung sebagai penggunaan ruangan; alat dihitung jika dipesan secara individual">Penghitungan penggunaan ✓</span>
                        </div>
                    </div>

                    {/* Kartu 3: Gangguan & Perbaikan */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Gangguan & Perbaikan</span>
                            <span className="w-8 h-8 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#111827]">{maintenance_stats.under_repair_count}</span>
                            <span className="text-xs text-[#667085]">dalam perbaikan</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                            <span>Laporan Masuk: <strong className="text-[#111827]">{maintenance_stats.month_reports_count}</strong></span>
                            <Link href="/admin/recap" className="text-[#2D4C79] hover:underline font-medium">Detail →</Link>
                        </div>
                    </div>

                    {/* Kartu 4: Tata Kelola Akun */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider">Tata Kelola Akun</span>
                            <span className="w-8 h-8 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-[#111827]">{account_stats.total_users}</span>
                            <span className="text-xs text-[#667085]">pengguna terdaftar</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#667085]">
                            <span>{account_stats.pengguna_count} Pengguna</span>
                            <span>·</span>
                            <span>{account_stats.petugas_count} Petugas</span>
                            <span>·</span>
                            <span className="text-amber-800 font-semibold">1 Admin</span>
                        </div>
                    </div>
                </div>

                {/* Pantauan Pemeliharaan Fasilitas */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FBFBFC]">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${maintenance_stats.under_repair_list.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <h2 className="text-base font-bold text-[#111827]">
                                Pantauan Pemeliharaan Fasilitas
                            </h2>
                        </div>
                        <span className="text-xs text-[#667085]">
                            {maintenance_stats.under_repair_list.length} fasilitas sedang dalam perbaikan
                        </span>
                    </div>

                    {maintenance_stats.under_repair_list.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#F9FAFB] text-xs font-semibold text-[#4B5563] uppercase border-b border-[#E5E7EB]">
                                    <tr>
                                        <th className="px-6 py-3">Nama Fasilitas</th>
                                        <th className="px-6 py-3">Tipe / Ruangan Induk</th>
                                        <th className="px-6 py-3">Lokasi</th>
                                        <th className="px-6 py-3">Status Kondisi</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E7EB]">
                                    {maintenance_stats.under_repair_list.map((item) => (
                                        <tr key={item.id} className="hover:bg-[#F9FAFB] transition">
                                            <td className="px-6 py-3.5 font-semibold text-[#111827]">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-[#4B5563]">
                                                {item.is_tool ? (
                                                    <div>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                            Alat
                                                        </span>
                                                        {item.parent_room && (
                                                            <span className="text-[#667085] ml-1">dalam {item.parent_room}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="capitalize">{item.type.replace('_', ' ')}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-[#4B5563]">
                                                {item.location}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                                    Dalam Perbaikan
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <Link
                                                    href={`/admin/facilities/${item.id}/edit`}
                                                    className="text-xs font-medium text-[#2D4C79] hover:underline"
                                                >
                                                    Kelola Fasilitas →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="px-6 py-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 mb-3">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#111827]">Semua Fasilitas Beroperasi Normal</h3>
                            <p className="text-xs text-[#667085] mt-1 max-w-md mx-auto">
                                Saat ini tidak ada fasilitas yang berstatus dalam perbaikan. Semua ruangan dan alat siap digunakan untuk operasional kampus.
                            </p>
                        </div>
                    )}
                </div>

                {/* Grid 2 Kolom: Fasilitas Terpopuler & Laporan Gangguan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Panel Kiri: Top Used Facilities */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FBFBFC]">
                                <div>
                                    <h2 className="text-base font-bold text-[#111827]">
                                        Fasilitas Terpopuler (Bulan Ini)
                                    </h2>
                                    <p className="text-xs text-[#667085] mt-0.5">
                                        Penggunaan dihitung dari reservasi yang disetujui
                                    </p>
                                </div>
                                <Link href="/admin/recap" className="text-xs text-[#2D4C79] hover:underline font-semibold">
                                    Lihat Semua →
                                </Link>
                            </div>

                            {usage_stats.top_used_facilities.length > 0 ? (
                                <div className="divide-y divide-[#E5E7EB]">
                                    {usage_stats.top_used_facilities.map((facility, index) => (
                                        <div key={facility.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F9FAFB] transition">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#2D4C79]/10 text-[#2D4C79] text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-[#111827]">
                                                        {facility.name}
                                                    </div>
                                                    <div className="text-xs text-[#667085] flex items-center gap-2 mt-0.5">
                                                        <span>{facility.type_label}</span>
                                                        {facility.is_tool && facility.parent_room && (
                                                            <span>(dalam {facility.parent_room})</span>
                                                        )}
                                                        <span>·</span>
                                                        <span>{facility.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-[#111827]">
                                                    {facility.usage_count} kali
                                                </div>
                                                <div className="text-xs text-[#667085]">
                                                    {facility.usage_hours} jam terpakai
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center text-xs text-[#667085]">
                                    Belum ada aktivitas reservasi yang disetujui pada bulan {month_label}.
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-xs text-[#667085] flex items-center justify-between">
                            <span>Penggunaan alat hanya dihitung jika dipesan individual</span>
                            <Link href="/admin/recap" className="font-medium text-[#2D4C79] hover:underline">
                                Buka Rekapitulasi Lengkap
                            </Link>
                        </div>
                    </div>

                    {/* Panel Kanan: Laporan Kerusakan */}
                    <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-xs overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FBFBFC]">
                                <div>
                                    <h2 className="text-base font-bold text-[#111827]">
                                        Laporan Gangguan & Kerusakan
                                    </h2>
                                    <p className="text-xs text-[#667085] mt-0.5">
                                        Fasilitas dan lokasi paling sering dilaporkan civitas
                                    </p>
                                </div>
                                <Link href="/admin/recap?period=this_month" className="text-xs text-[#2D4C79] hover:underline font-semibold">
                                    Rekap Kerusakan →
                                </Link>
                            </div>

                            {maintenance_stats.top_damaged_facilities.length > 0 ? (
                                <div className="p-6 space-y-5">
                                    <div>
                                        <h3 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2.5">
                                            Fasilitas Paling Sering Dilaporkan:
                                        </h3>
                                        <div className="space-y-2">
                                            {maintenance_stats.top_damaged_facilities.map((damaged) => (
                                                <div key={damaged.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                                                    <span className="font-medium text-[#111827] truncate pr-2">
                                                        {damaged.name}
                                                        <span className="text-[#667085] font-normal ml-1">({damaged.location})</span>
                                                    </span>
                                                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                        {damaged.report_count} laporan
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {maintenance_stats.top_damaged_locations.length > 0 && (
                                        <div className="pt-3 border-t border-[#F3F4F6]">
                                            <h3 className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2.5">
                                                Sebaran Lokasi / Gedung Rawan:
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {maintenance_stats.top_damaged_locations.map((loc) => (
                                                    <div key={loc.location} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                                                        <div className="font-semibold text-xs text-[#111827] truncate">
                                                            {loc.location}
                                                        </div>
                                                        <div className="text-[11px] text-[#667085] mt-1 flex items-center justify-between">
                                                            <span>{loc.facilities_count} fasilitas</span>
                                                            <span className="font-bold text-rose-600">{loc.total_reports} insiden</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center text-xs text-[#667085]">
                                    Belum ada laporan kerusakan baru pada bulan {month_label}.
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-xs text-[#667085] flex items-center justify-between">
                            <span>Data dihimpun dari laporan civitas kampus</span>
                            <Link href="/admin/recap" className="font-medium text-[#2D4C79] hover:underline">
                                Analitik Lokasi Lengkap
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pintasan Cepat Akses Administrasi */}
                <div className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs">
                    <h2 className="text-base font-bold text-[#111827] mb-1">
                        Pintasan Cepat Tata Kelola Kampus
                    </h2>
                    <p className="text-xs text-[#667085] mb-4">
                        Akses instan modul administrasi tanpa tumpang tindih dengan antrean operasional harian Petugas.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        <Link
                            href="/admin/recap"
                            className="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="w-8 h-8 rounded-md bg-[#2D4C79]/10 text-[#2D4C79] flex items-center justify-center group-hover:bg-[#2D4C79] group-hover:text-white transition">
                                    <BarChart3 className="w-4 h-4" />
                                </span>
                                <span className="text-xs text-[#667085] group-hover:text-[#2D4C79] font-medium">Buka →</span>
                            </div>
                            <div className="text-sm font-bold text-[#111827] group-hover:text-[#2D4C79]">
                                Rekapitulasi Okupansi
                            </div>
                            <p className="text-xs text-[#667085] mt-1">
                                Analisis frekuensi pemakaian, durasi, dan ekspor data CSV.
                            </p>
                        </Link>

                        <Link
                            href="/admin/facilities/create"
                            className="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                                    <PlusCircle className="w-4 h-4" />
                                </span>
                                <span className="text-xs text-[#667085] group-hover:text-emerald-700 font-medium">Tambah →</span>
                            </div>
                            <div className="text-sm font-bold text-[#111827] group-hover:text-emerald-700">
                                Tambah Fasilitas Baru
                            </div>
                            <p className="text-xs text-[#667085] mt-1">
                                Daftarkan ruangan kelas, aula, laboratorium, atau alat baru.
                            </p>
                        </Link>

                        <Link
                            href="/admin/users/petugas/create"
                            className="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="w-8 h-8 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition">
                                    <UserCheck className="w-4 h-4" />
                                </span>
                                <span className="text-xs text-[#667085] group-hover:text-sky-700 font-medium">Buat →</span>
                            </div>
                            <div className="text-sm font-bold text-[#111827] group-hover:text-sky-700">
                                Buat Akun Petugas
                            </div>
                            <p className="text-xs text-[#667085] mt-1">
                                Provisioning staf operasional untuk memproses antrean reservasi.
                            </p>
                        </Link>

                        <Link
                            href="/admin/change-password"
                            className="group p-4 rounded-lg border border-[#E5E7EB] hover:border-[#2D4C79] hover:bg-[#F9FAFC] transition block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="w-8 h-8 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                                    <KeyRound className="w-4 h-4" />
                                </span>
                                <span className="text-xs text-[#667085] group-hover:text-amber-700 font-medium">Ubah →</span>
                            </div>
                            <div className="text-sm font-bold text-[#111827] group-hover:text-amber-700">
                                Keamanan & Sandi
                            </div>
                            <p className="text-xs text-[#667085] mt-1">
                                Kelola kata sandi akun Administrator.
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
