import { Head, Link } from '@inertiajs/react';

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

const statusConfig: Record<ReportStatus, { label: string; classes: string; icon: string }> = {
    baru: { label: 'Baru', classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]', icon: '○' },
    diproses: { label: 'Diproses', classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]', icon: '↻' },
    selesai: { label: 'Selesai', classes: 'border-[#B7E2CB] bg-[#EAF7F0] text-[#16794A]', icon: '✓' },
    ditolak: { label: 'Ditolak', classes: 'border-[#F2B8B5] bg-[#FDECEC] text-[#B42318]', icon: '×' },
};

export default function ReportIndex({ reports, success }: Props) {
    return (
        <>
            <Head title="Laporan Saya" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="w-full">
                    <Link href="/facilities" className="text-sm font-medium text-[#2D4C79] hover:underline">Kembali ke fasilitas</Link>
                    <div className="mt-6 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Laporan saya</h1>
                            <p className="mt-1 text-sm text-[#667085]">Pantau status penanganan laporan kerusakan Anda.</p>
                        </div>
                        <Link href="/reports/create" className="shrink-0 rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white hover:bg-[#243E63]">Laporkan kerusakan</Link>
                    </div>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}

                    {reports.length === 0 ? (
                        <section className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6">
                            <h2 className="font-semibold">Belum ada laporan</h2>
                            <p className="mt-1 text-sm text-[#667085]">Laporan kerusakan yang Anda kirim akan muncul di sini.</p>
                            <Link href="/reports/create" className="mt-4 inline-flex rounded-md border border-[#D0D5DD] px-4 py-2 text-sm font-semibold text-[#2D4C79] hover:bg-[#F3F5F7]">Laporkan kerusakan</Link>
                        </section>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {reports.map((report) => {
                                const status = statusConfig[report.status_laporan];

                                return (
                                    <Link key={report.id} href={`/reports/${report.id}`} className="block rounded-lg border border-[#E5E7EB] bg-white p-5 hover:border-[#2D4C79]">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-sm text-[#667085]">{report.facility.location}</p>
                                                <h2 className="mt-1 font-semibold">{report.facility.name}</h2>
                                                <p className="mt-1 text-sm text-[#667085]">{report.kategori} · {report.reported_at} WIB</p>
                                            </div>
                                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${status.classes}`}><span>{status.icon}</span>{status.label}</span>
                                        </div>
                                        <p className="mt-3 line-clamp-2 text-sm text-[#667085]">{report.deskripsi}</p>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
