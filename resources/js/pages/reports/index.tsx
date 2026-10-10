import { Head, Link } from '@inertiajs/react';
import { UserNavbar } from '@/components/user-navbar';

type ReportStatus = 'baru' | 'diproses' | 'selesai' | 'ditolak';

type Report = {
    id: number;
    kategori: string;
    deskripsi: string;
    status_laporan: ReportStatus;
    reported_at: string;
    facility: { id: number; name: string; location: string };
};

type Props = { reports: Report[]; success: string | null };

const statusConfig: Record<ReportStatus, { label: string; classes: string; icon?: string }> = {
    baru: {
        label: 'Baru',
        classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]',
        icon: '○',
    },
    diproses: {
        label: 'Diproses',
        classes: 'border-[#F5C6A7] bg-[#FFF0E8] text-[#B54708]',
        icon: '↻',
    },
    selesai: {
        label: 'Selesai',
        classes: 'border-[#B7E2CB] bg-[#EAF7F0] text-[#16794A]',
        icon: '✓',
    },
    ditolak: {
        label: 'Ditolak',
        classes: 'border-[#F2B8B5] bg-[#FDECEC] text-[#B42318]',
        icon: '×',
    },
};

export default function ReportIndex({ reports, success }: Props) {
    return (
        <>
            <Head title="Laporan Kerusakan — AduPDF" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reports" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                                Laporan Kerusakan
                            </h1>
                            <p className="mt-1 text-lg text-[#667085]">
                                Pantau status penanganan laporan fasilitas atau sampaikan aduan baru.
                            </p>
                        </div>
                        <Link
                            href="/reports/create"
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[#2D4C79] px-5 text-sm font-semibold text-white shadow-xs hover:bg-[#243E63] active:bg-[#1C3150] transition shrink-0"
                        >
                            <span>+</span>
                            <span>Laporkan Kerusakan</span>
                        </Link>
                    </div>

                    {success && (
                        <div
                            role="status"
                            className="mb-6 rounded-lg border border-green-200 bg-[#EAF7F0] p-4 text-sm font-medium text-[#16794A]"
                        >
                            {success}
                        </div>
                    )}

                    {reports.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-white p-12 text-center">
                            <p className="text-base font-semibold text-[#111827]">
                                Belum ada laporan kerusakan
                            </p>
                            <p className="mt-1 text-sm text-[#667085]">
                                Laporan kerusakan fasilitas yang Anda kirimkan akan muncul di sini.
                            </p>
                            <Link
                                href="/reports/create"
                                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-[#D0D5DD] bg-white px-4 text-xs font-semibold text-[#2D4C79] hover:bg-[#E9EEF5] transition"
                            >
                                Laporkan Kerusakan
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {reports.map((report) => {
                                const status = statusConfig[report.status_laporan];

                                return (
                                    <Link
                                        key={report.id}
                                        href={`/reports/${report.id}`}
                                        className="group flex flex-col justify-between rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] hover:border-[#2D4C79] hover:shadow-md transition"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-[#2D4C79] truncate">
                                                    {report.kategori}
                                                </span>
                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.classes}`}
                                                >
                                                    {status.icon && <span>{status.icon}</span>}
                                                    <span>{status.label}</span>
                                                </span>
                                            </div>

                                            <h2 className="mt-3 text-lg font-semibold text-[#111827] group-hover:text-[#2D4C79] transition-colors">
                                                {report.facility.name}
                                            </h2>

                                            <dl className="mt-3 space-y-1.5 text-sm text-[#667085]">
                                                <div className="flex justify-between">
                                                    <dt>Lokasi:</dt>
                                                    <dd className="font-medium text-[#111827]">
                                                        {report.facility.location}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt>Dilaporkan:</dt>
                                                    <dd className="font-medium text-[#111827]">
                                                        {report.reported_at} WIB
                                                    </dd>
                                                </div>
                                            </dl>

                                            <p className="mt-3 line-clamp-2 text-sm text-[#667085]">
                                                {report.deskripsi}
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                                            <div className="inline-flex h-10 w-full items-center justify-center rounded-md border border-[#D0D5DD] bg-white text-sm font-semibold text-[#2D4C79] group-hover:bg-[#E9EEF5] group-hover:border-[#2D4C79] transition">
                                                Lihat Detail Laporan →
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
