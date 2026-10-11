import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    FileText,
    Search,
    XCircle,
} from 'lucide-react';
import PetugasLayout from '@/layouts/petugas-layout';
import { FlashAlert } from '@/components/flash-alert';
import { Link } from '@inertiajs/react';

type Report = {
    id: number;
    kategori: string;
    deskripsi: string;
    status_laporan: string;
    reported_at: string;
    reporter: string;
    facility: { name: string; location: string; condition: string };
};

type Props = {
    reports: Report[];
    counts?: {
        all: number;
        baru: number;
        diproses: number;
        selesai: number;
        ditolak: number;
    };
    current_status?: string;
    success: string | null;
};

const statusConfig: Record<string, { label: string; badge: string }> = {
    baru: {
        label: 'Menunggu',
        badge: 'border-amber-200 bg-amber-50 text-amber-800',
    },
    diproses: {
        label: 'Sedang Diproses',
        badge: 'border-blue-200 bg-blue-50 text-blue-800',
    },
    selesai: {
        label: 'Selesai',
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    },
    ditolak: {
        label: 'Ditolak',
        badge: 'border-rose-200 bg-rose-50 text-rose-800',
    },
};

export default function PetugasReportIndex({
    reports,
    counts = { all: reports.length, baru: 0, diproses: 0, selesai: 0, ditolak: 0 },
    current_status = 'baru',
    success,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredReports = useMemo(() => {
        if (!searchQuery.trim()) return reports;
        const q = searchQuery.toLowerCase();
        return reports.filter(
            (r) =>
                r.facility.name.toLowerCase().includes(q) ||
                r.facility.location.toLowerCase().includes(q) ||
                r.reporter.toLowerCase().includes(q) ||
                r.kategori.toLowerCase().includes(q) ||
                r.deskripsi.toLowerCase().includes(q)
        );
    }, [reports, searchQuery]);

    const cards = [
        {
            key: 'baru',
            label: 'Menunggu',
            sublabel: 'laporan baru',
            count: counts.baru,
            icon: Clock,
            iconStyle: 'border-amber-200 bg-amber-50 text-amber-700',
        },
        {
            key: 'diproses',
            label: 'Diproses',
            sublabel: 'sedang ditangani',
            count: counts.diproses,
            icon: AlertTriangle,
            iconStyle: 'border-blue-200 bg-blue-50 text-blue-700',
        },
        {
            key: 'selesai',
            label: 'Selesai',
            sublabel: 'telah diperbaiki',
            count: counts.selesai,
            icon: CheckCircle2,
            iconStyle: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        },
        {
            key: 'ditolak',
            label: 'Ditolak',
            sublabel: 'tidak disetujui',
            count: counts.ditolak,
            icon: XCircle,
            iconStyle: 'border-rose-200 bg-rose-50 text-rose-700',
        },
        {
            key: 'all',
            label: 'Semua Laporan',
            sublabel: 'semua riwayat',
            count: counts.all,
            icon: FileText,
            iconStyle: 'border-slate-200 bg-slate-50 text-slate-700',
        },
    ];

    function changeTab(key: string) {
        router.get(
            '/petugas/reports',
            { status: key },
            { preserveState: true, replace: true }
        );
    }

    const currentTabTitle =
        cards.find((c) => c.key === current_status)?.label ?? 'Laporan';

    return (
        <PetugasLayout activePage="reports">
            <Head title="Kelola Laporan Kerusakan — Petugas" />

            <main className="mx-auto w-full max-w-7xl px-4 py-8 text-slate-900 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            Laporan Kerusakan Fasilitas
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Pilih salah satu di bawah ini
                        </p>
                    </div>
                </div>

                {/* Flash Success Notification */}
                {success && (
                    <FlashAlert
                        type="success"
                        message={success}
                        autoCloseDelay={5000}
                    />
                )}

                {/* Kartu KPI Utama yang Berfungsi Langsung Sebagai Filter Tab */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {cards.map((c) => {
                        const active = current_status === c.key;
                        const Icon = c.icon;
                        return (
                            <button
                                key={c.key}
                                type="button"
                                onClick={() => changeTab(c.key)}
                                className={`rounded-xl border p-4 text-left transition shadow-sm cursor-pointer ${
                                    active
                                        ? 'border-[#2D4C79] bg-white ring-2 ring-[#2D4C79]/20'
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        {c.label}
                                    </span>
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg border ${c.iconStyle}`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>
                                </div>
                                <div className="mt-2 text-3xl font-bold text-slate-900">{c.count}</div>
                                <div className="mt-1 text-xs text-slate-500">{c.sublabel}</div>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Active Info Bar (Tanpa Sub-Tab Redundan) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Kategori Terpilih:{' '}
                        <span className="text-slate-900 font-bold capitalize">
                            {currentTabTitle}
                        </span>{' '}
                        ({filteredReports.length} laporan)
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari fasilitas, pelapor, atau deskripsi..."
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

                {/* Table View */}
                {filteredReports.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900">
                            {searchQuery ? 'Tidak Ada Hasil Pencarian' : 'Tidak Ada Laporan pada Kategori Ini'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            {searchQuery
                                ? 'Coba ubah kata kunci pencarian Anda.'
                                : 'Saat ini tidak ada laporan yang sesuai dengan filter yang dipilih.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-700">
                                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3">Fasilitas & Lokasi</th>
                                        <th className="px-5 py-3">Kategori & Deskripsi</th>
                                        <th className="px-5 py-3">Pelapor</th>
                                        <th className="px-5 py-3">Waktu Lapor</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {filteredReports.map((report) => {
                                        const cfg = statusConfig[report.status_laporan] ?? {
                                            label: report.status_laporan,
                                            badge: 'border-slate-200 bg-slate-100 text-slate-700',
                                        };
                                        return (
                                            <tr
                                                key={report.id}
                                                className="transition hover:bg-slate-50/80"
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold text-slate-900">
                                                        {report.facility.name}
                                                    </div>
                                                    <div className="mt-0.5 text-xs text-slate-500">
                                                        {report.facility.location}
                                                    </div>
                                                </td>
                                                <td className="max-w-md px-5 py-4">
                                                    <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                                        {report.kategori}
                                                    </span>
                                                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                                                        {report.deskripsi}
                                                    </p>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-xs font-medium text-slate-900">
                                                    {report.reporter}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                                                    {report.reported_at} WIB
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4">
                                                    <span
                                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}
                                                    >
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-right">
                                                    <Link
                                                        href={`/petugas/reports/${report.id}`}
                                                        className="inline-flex items-center gap-1.5 rounded-md bg-[#2D4C79] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#243E63] active:bg-[#1C3150] cursor-pointer"
                                                    >
                                                        Tinjau Detail →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </PetugasLayout>
    );
}
