import { Head, Link } from '@inertiajs/react';
import { UserNavbar } from '@/components/user-navbar';

type ReportStatus = 'baru' | 'diproses' | 'selesai' | 'ditolak';

type Report = {
    id: number;
    kategori: string;
    deskripsi: string;
    status_laporan: ReportStatus;
    reported_at: string;
    catatan_resolusi: string | null;
    facility: { id: number; name: string; location: string };
    attachments: { id: number; original_name: string; mime_type: string; file_size: number; url: string }[];
};

type Props = { report: Report };

const statusConfig: Record<ReportStatus, { label: string; classes: string; icon: string }> = {
    baru: { label: 'Baru', classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]', icon: '○' },
    diproses: { label: 'Diproses', classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]', icon: '↻' },
    selesai: { label: 'Selesai', classes: 'border-[#B7E2CB] bg-[#EAF7F0] text-[#16794A]', icon: '✓' },
    ditolak: { label: 'Ditolak', classes: 'border-[#F2B8B5] bg-[#FDECEC] text-[#B42318]', icon: '×' },
};

function formatFileSize(bytes: number): string {
    return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function ReportShow({ report }: Props) {
    const status = statusConfig[report.status_laporan];

    return (
        <>
            <Head title="Detail Laporan" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reports" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    <div className="w-full">
                        <div className="mb-6">
                            <Link
                                href="/reports"
                                className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 transition"
                            >
                                <span aria-hidden="true">←</span> Kembali ke laporan saya
                            </Link>
                        </div>
                    <article className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-[#667085]">{report.facility.location}</p>
                                <h1 className="mt-1 text-2xl font-bold">{report.facility.name}</h1>
                                <p className="mt-2 text-sm text-[#667085]">Dikirim {report.reported_at} WIB</p>
                            </div>
                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${status.classes}`}><span>{status.icon}</span>{status.label}</span>
                        </div>
                        <dl className="mt-6 space-y-4 border-y border-[#E5E7EB] py-5 text-sm">
                            <div><dt className="text-[#667085]">Kategori kerusakan</dt><dd className="mt-1 font-medium">{report.kategori}</dd></div>
                            <div><dt className="text-[#667085]">Deskripsi</dt><dd className="mt-1 whitespace-pre-wrap">{report.deskripsi}</dd></div>
                            {report.catatan_resolusi && <div><dt className="text-[#667085]">Catatan resolusi</dt><dd className="mt-1 whitespace-pre-wrap">{report.catatan_resolusi}</dd></div>}
                        </dl>
                        <section className="mt-6">
                            <h2 className="text-sm font-semibold">Foto pendukung ({report.attachments.length})</h2>
                            <div className="mt-3 divide-y rounded-lg border border-[#E5E7EB]">
                                {report.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                                        <span className="min-w-0 truncate font-medium">{attachment.original_name}</span>
                                        <div className="flex shrink-0 items-center gap-3">
                                            <span className="text-[#667085]">{formatFileSize(attachment.file_size)}</span>
                                            <a href={attachment.url} target="_blank" rel="noreferrer" className="font-semibold text-[#2D4C79] hover:underline">Lihat</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </article>
                </div>
            </main>
        </div>
    </>
    );
}
