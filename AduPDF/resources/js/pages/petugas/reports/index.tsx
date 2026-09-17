import { Head, Link } from '@inertiajs/react';

type Report = {
    id: number;
    kategori: string;
    deskripsi: string;
    reported_at: string;
    reporter: string;
    facility: { name: string; location: string; condition: string };
};

type Props = { reports: Report[]; success: string | null };

export default function PetugasReportIndex({ reports, success }: Props) {
    return (
        <>
            <Head title="Antrian Laporan" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="mx-auto max-w-4xl">
                    <Link href="/petugas/dashboard" className="text-sm font-medium text-[#2D4C79] hover:underline">Kembali ke dashboard</Link>
                    <h1 className="mt-6 text-2xl font-bold">Antrian laporan baru</h1>
                    <p className="mt-1 text-sm text-[#667085]">Tinjau laporan kerusakan yang belum diproses.</p>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}

                    {reports.length === 0 ? (
                        <p className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6 text-sm text-[#667085]">Tidak ada laporan baru untuk diproses.</p>
                    ) : (
                        <div className="mt-6 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                            <div className="hidden grid-cols-[1.2fr_1.1fr_1fr_auto] gap-4 border-b border-[#E5E7EB] bg-[#F7F8FA] px-5 py-3 text-xs font-semibold text-[#667085] md:grid">
                                <span>Fasilitas</span><span>Pelapor</span><span>Dilaporkan</span><span />
                            </div>
                            {reports.map((report) => (
                                <Link key={report.id} href={`/petugas/reports/${report.id}`} className="grid gap-2 border-b border-[#E5E7EB] px-5 py-4 last:border-b-0 hover:bg-[#F8FAFC] md:grid-cols-[1.2fr_1.1fr_1fr_auto] md:items-center md:gap-4">
                                    <div><p className="font-semibold">{report.facility.name}</p><p className="mt-1 text-sm text-[#667085]">{report.kategori} · {report.facility.location}</p></div>
                                    <p className="text-sm text-[#667085]"><span className="md:hidden">Pelapor: </span>{report.reporter}</p>
                                    <p className="text-sm text-[#667085]">{report.reported_at} WIB</p>
                                    <span className="text-sm font-semibold text-[#2D4C79]">Tinjau →</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
