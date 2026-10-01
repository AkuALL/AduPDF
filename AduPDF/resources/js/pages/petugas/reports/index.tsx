import PetugasLayout from '@/layouts/petugas-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Check, ClipboardCheck, MapPin, UserRound } from 'lucide-react';

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
        <PetugasLayout active="reports">
            <Head title="Antrian Laporan" />
            <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="w-full">
                    <p className="ui-eyebrow">Tindak lanjut fasilitas</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-slate-900">Antrean laporan baru</h1>
                    <p className="mt-1 text-sm text-[#667085]">Tinjau laporan kerusakan yang belum diproses.</p>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}

                    {reports.length === 0 ? (
                        <div className="ui-card mt-6 grid place-items-center p-12 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Check className="size-7" /></span><p className="mt-4 font-bold text-slate-800">Tidak ada laporan baru</p><p className="mt-1 text-sm text-slate-500">Semua laporan sudah mendapatkan tindak lanjut.</p></div>
                    ) : (
                        <div className="ui-card mt-6 overflow-hidden">
                            <div className="hidden grid-cols-[1.2fr_1.1fr_1fr_auto] gap-4 border-b border-[#E5E7EB] bg-[#F7F8FA] px-5 py-3 text-xs font-semibold text-[#667085] md:grid">
                                <span>Fasilitas</span><span>Pelapor</span><span>Dilaporkan</span><span />
                            </div>
                            {reports.map((report) => (
                                <Link key={report.id} href={`/petugas/reports/${report.id}`} className="grid gap-2 border-b border-[#E5E7EB] px-5 py-4 last:border-b-0 hover:bg-[#F8FAFC] md:grid-cols-[1.2fr_1.1fr_1fr_auto] md:items-center md:gap-4">
                                    <div><p className="font-bold text-slate-900">{report.facility.name}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin className="size-3.5 text-teal-600" />{report.kategori} · {report.facility.location}</p></div>
                                    <p className="flex items-center gap-1.5 text-sm text-[#667085]"><UserRound className="size-3.5 text-teal-600" /><span className="md:hidden">Pelapor: </span>{report.reporter}</p>
                                    <p className="text-sm text-[#667085]">{report.reported_at} WIB</p>
                                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#245578]">Tinjau <ArrowRight className="size-4" /></span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </PetugasLayout>
    );
}
