import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Building2,
    CalendarCheck,
    CheckCircle2,
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Dashboard Administrasi
                        </h1>
                    </div>
                </div>

                {/* 4 Kartu KPI Eksekutif */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Kartu 1: Infrastruktur Fasilitas */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Infrastruktur Fasilitas</span>
                            <span className="w-8 h-8 rounded-md bg-[#2D4C79]/10 text-[#2D4C79] flex items-center justify-center">
                                <Building2 className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{facility_stats.total}</span>
                            <span className="text-xs text-slate-500">total fasilitas</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="text-emerald-700 font-medium">{facility_stats.active} aktif</span>
                            <span>·</span>
                            <span className="text-amber-700 font-medium">{facility_stats.under_repair} perbaikan</span>
                            <span>·</span>
                            <span className="text-rose-700 font-medium">{facility_stats.inactive} nonaktif</span>
                        </div>
                    </div>

                    {/* Kartu 2: Pemakaian Bulan Ini */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pemakaian ({month_label})</span>
                            <span className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                                <CalendarCheck className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{usage_stats.total_reservations}</span>
                            <span className="text-xs text-slate-500">reservasi disetujui</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                            <span>Total: <strong className="text-slate-900">{usage_stats.total_hours} Jam</strong></span>
                        </div>
                    </div>

                    {/* Kartu 3: Gangguan & Perbaikan */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gangguan & Perbaikan</span>
                            <span className="w-8 h-8 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{maintenance_stats.under_repair_count}</span>
                            <span className="text-xs text-slate-500">dalam perbaikan</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Laporan Masuk: <strong className="text-slate-900">{maintenance_stats.month_reports_count}</strong></span>
                            <Link href="/admin/recap" className="text-[#2D4C79] hover:underline font-medium cursor-pointer">Detail →</Link>
                        </div>
                    </div>

                    {/* Kartu 4: Tata Kelola Akun */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tata Kelola Akun</span>
                            <span className="w-8 h-8 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </span>
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-slate-900">{account_stats.total_users}</span>
                            <span className="text-xs text-slate-500">pengguna terdaftar</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>{account_stats.pengguna_count} Pengguna</span>
                            <span>·</span>
                            <span>{account_stats.petugas_count} Petugas</span>
                        </div>
                    </div>
                </div>

                {/* Pantauan Pemeliharaan Fasilitas */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-2.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${maintenance_stats.under_repair_list.length > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                            <h2 className="text-base font-bold text-slate-900">
                                Pantauan Pemeliharaan Fasilitas
                            </h2>
                        </div>
                    </div>

                    {maintenance_stats.under_repair_list.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3">Nama Fasilitas</th>
                                        <th className="px-6 py-3">Tipe / Ruangan Induk</th>
                                        <th className="px-6 py-3">Lokasi</th>
                                        <th className="px-6 py-3 text-center">Status Kondisi</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {maintenance_stats.under_repair_list.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-3.5 font-semibold text-slate-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-slate-600">
                                                {item.is_tool ? (
                                                    <div>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                            Alat
                                                        </span>
                                                        {item.parent_room && (
                                                            <span className="text-slate-500 ml-1">dalam {item.parent_room}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="capitalize">{item.type.replace('_', ' ')}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-slate-600">
                                                {item.location}
                                            </td>
                                            <td className="px-6 py-3.5 text-center align-middle">
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                                                    Dalam Perbaikan
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <Link
                                                    href={`/admin/facilities/${item.id}/edit`}
                                                    className="text-xs font-medium text-[#2D4C79] hover:underline cursor-pointer"
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
                            <h3 className="text-sm font-semibold text-slate-900">Semua Fasilitas Beroperasi Normal</h3>
                        </div>
                    )}
                </div>

                {/* Grid 2 Kolom: Fasilitas Terpopuler & Laporan Gangguan */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Panel Kiri: Top Used Facilities */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        Fasilitas Terpopuler (Bulan Ini)
                                    </h2>
                                </div>
                                <Link href="/admin/recap" className="text-xs text-[#2D4C79] hover:underline font-semibold cursor-pointer">
                                    Lihat Semua →
                                </Link>
                            </div>

                            {usage_stats.top_used_facilities.length > 0 ? (
                                <div className="divide-y divide-slate-200">
                                    {usage_stats.top_used_facilities.map((facility, index) => (
                                        <div key={facility.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#2D4C79]/10 text-[#2D4C79] text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {facility.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
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
                                                <div className="text-sm font-bold text-slate-900">
                                                    {facility.usage_count} kali
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {facility.usage_hours} jam terpakai
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-10 text-center text-xs text-slate-500">
                                    Belum ada reservasi pada bulan {month_label}.
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-end">
                            <Link href="/admin/recap" className="font-medium text-[#2D4C79] hover:underline cursor-pointer">
                                Buka Rekapitulasi Lengkap
                            </Link>
                        </div>
                    </div>

                    {/* Panel Kanan: Laporan Kerusakan */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">
                                        Laporan Gangguan & Kerusakan
                                    </h2>
                                </div>
                                <Link href="/admin/recap?period=this_month" className="text-xs text-[#2D4C79] hover:underline font-semibold cursor-pointer">
                                    Rekap Kerusakan →
                                </Link>
                            </div>

                            {maintenance_stats.top_damaged_facilities.length > 0 ? (
                                <div className="p-6 space-y-5">
                                    <div>
                                        <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                                            Fasilitas Paling Sering Dilaporkan:
                                        </h3>
                                        <div className="space-y-2">
                                            {maintenance_stats.top_damaged_facilities.map((damaged) => (
                                                <div key={damaged.id} className="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-slate-50 border border-slate-200">
                                                    <span className="font-medium text-slate-900 truncate pr-2">
                                                        {damaged.name}
                                                        <span className="text-slate-500 font-normal ml-1">({damaged.location})</span>
                                                    </span>
                                                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                        {damaged.report_count} laporan
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {maintenance_stats.top_damaged_locations.length > 0 && (
                                        <div className="pt-3 border-t border-slate-100">
                                            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                                                Sebaran Lokasi / Gedung Rawan:
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {maintenance_stats.top_damaged_locations.map((loc) => (
                                                    <div key={loc.location} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                                                        <div className="font-semibold text-xs text-slate-900 truncate">
                                                            {loc.location}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
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
                                <div className="px-6 py-10 text-center text-xs text-slate-500">
                                    Belum ada laporan kerusakan bulan ini.
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-end">
                            <Link href="/admin/recap" className="font-medium text-[#2D4C79] hover:underline cursor-pointer">
                                Analitik Lokasi Lengkap
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}
