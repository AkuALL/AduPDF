import { Form, Head, Link } from '@inertiajs/react';

type ReportStatus = 'baru' | 'diproses' | 'selesai' | 'ditolak';
type FacilityCondition = 'aktif' | 'dalam_perbaikan' | 'nonaktif';

type Report = {
    id: number;
    kategori: string;
    deskripsi: string;
    reported_at: string;
    reporter: string;
    status_laporan: ReportStatus;
    catatan_resolusi: string | null;
    facility: { name: string; location: string; condition: FacilityCondition };
    attachments: { id: number; original_name: string; file_size: number }[];
};

type Props = { report: Report; success: string | null };

const reportStatusConfig: Record<ReportStatus, { label: string; icon: string; classes: string }> = {
    baru: { label: 'Baru', icon: '○', classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]' },
    diproses: { label: 'Diproses', icon: '↻', classes: 'border-[#BFD6ED] bg-[#EBF3FB] text-[#2463A7]' },
    selesai: { label: 'Selesai', icon: '✓', classes: 'border-[#B7E2CB] bg-[#EAF7F0] text-[#16794A]' },
    ditolak: { label: 'Ditolak', icon: '×', classes: 'border-[#F2B8B5] bg-[#FDECEC] text-[#B42318]' },
};

const facilityConditionConfig: Record<FacilityCondition, { label: string; icon: string; classes: string }> = {
    aktif: { label: 'Aktif', icon: '✓', classes: 'border-[#B7E2CB] bg-[#EAF7F0] text-[#16794A]' },
    dalam_perbaikan: { label: 'Dalam perbaikan', icon: '!', classes: 'border-[#F5C6A7] bg-[#FFF0E8] text-[#B54708]' },
    nonaktif: { label: 'Nonaktif', icon: '—', classes: 'border-[#D7DBE0] bg-[#F0F2F4] text-[#5D6673]' },
};

function formatFileSize(bytes: number): string {
    return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function PetugasReportShow({ report, success }: Props) {
    const reportStatus = reportStatusConfig[report.status_laporan];
    const facilityCondition = facilityConditionConfig[report.facility.condition];
    const isOpen = report.status_laporan === 'baru' || report.status_laporan === 'diproses';

    return (
        <>
            <Head title="Proses Laporan" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="w-full">
                    <Link href="/petugas/reports" className="text-sm font-medium text-[#2D4C79] hover:underline">Kembali ke antrian laporan</Link>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    <article className="mt-6 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div><p className="text-sm text-[#667085]">{report.facility.location}</p><h1 className="mt-1 text-2xl font-bold">{report.facility.name}</h1><p className="mt-2 text-sm text-[#667085]">Dilaporkan oleh {report.reporter} · {report.reported_at} WIB</p></div>
                            <div className="flex flex-wrap gap-2 sm:justify-end">
                                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${reportStatus.classes}`}><span>{reportStatus.icon}</span>Laporan: {reportStatus.label}</span>
                                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${facilityCondition.classes}`}><span>{facilityCondition.icon}</span>Fasilitas: {facilityCondition.label}</span>
                            </div>
                        </div>
                        <dl className="mt-6 space-y-4 border-y border-[#E5E7EB] py-5 text-sm">
                            <div><dt className="text-[#667085]">Kategori kerusakan</dt><dd className="mt-1 font-medium">{report.kategori}</dd></div>
                            <div><dt className="text-[#667085]">Deskripsi</dt><dd className="mt-1 whitespace-pre-wrap">{report.deskripsi}</dd></div>
                            {report.catatan_resolusi && <div><dt className="text-[#667085]">Catatan resolusi</dt><dd className="mt-1 whitespace-pre-wrap">{report.catatan_resolusi}</dd></div>}
                        </dl>
                        <section className="mt-6"><h2 className="text-sm font-semibold">Foto pendukung ({report.attachments.length})</h2><ul className="mt-3 divide-y rounded-lg border border-[#E5E7EB]">{report.attachments.map((attachment) => <li key={attachment.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm"><span className="min-w-0 truncate font-medium">{attachment.original_name}</span><span className="shrink-0 text-[#667085]">{formatFileSize(attachment.file_size)}</span></li>)}</ul></section>

                        {report.status_laporan === 'diproses' && report.facility.condition === 'aktif' && (
                            <Form action={`/petugas/reports/${report.id}/facility-condition`} method="patch" className="mt-6 border-t border-[#E5E7EB] pt-6">
                                {({ errors, processing }) => (
                                    <><input type="hidden" name="condition" value="dalam_perbaikan" /><p className="text-sm text-[#667085]">Tandai fasilitas dalam perbaikan jika kerusakan perlu menghentikan reservasi baru.</p>{errors.condition && <p role="alert" className="mt-2 text-sm text-red-700">{errors.condition}</p>}<button type="submit" disabled={processing} className="mt-3 rounded-md border border-[#F5C6A7] bg-[#FFF0E8] px-4 py-2 text-sm font-semibold text-[#B54708] disabled:opacity-50">{processing ? 'Memperbarui...' : 'Tandai dalam perbaikan'}</button></>
                                )}
                            </Form>
                        )}

                        {report.status_laporan === 'selesai' && report.facility.condition === 'dalam_perbaikan' && (
                            <Form action={`/petugas/reports/${report.id}/facility-condition`} method="patch" className="mt-6 border-t border-[#E5E7EB] pt-6">
                                {({ errors, processing }) => (
                                    <><input type="hidden" name="condition" value="aktif" /><p className="text-sm text-[#667085]">Kembalikan fasilitas ke aktif setelah perbaikan selesai. Sistem akan menolak tindakan ini bila masih ada laporan terbuka lain.</p>{errors.condition && <p role="alert" className="mt-2 text-sm text-red-700">{errors.condition}</p>}<button type="submit" disabled={processing} className="mt-3 rounded-md border border-[#B7E2CB] bg-[#EAF7F0] px-4 py-2 text-sm font-semibold text-[#16794A] disabled:opacity-50">{processing ? 'Memperbarui...' : 'Kembalikan ke aktif'}</button></>
                                )}
                            </Form>
                        )}

                        {isOpen && (
                            <Form action={`/petugas/reports/${report.id}`} method="patch" className="mt-6 border-t border-[#E5E7EB] pt-6">
                                {({ errors, processing }) => (
                                    <div className="space-y-4">
                                        <div><label htmlFor="status_laporan" className="block text-sm font-medium">Ubah status laporan</label><select id="status_laporan" name="status_laporan" required defaultValue="" aria-invalid={!!errors.status_laporan} className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2"><option value="" disabled>Pilih tindakan</option>{report.status_laporan === 'baru' && <option value="diproses">Tandai diproses</option>}<option value="ditolak">Tolak laporan</option>{report.status_laporan === 'diproses' && <option value="selesai">Tandai selesai</option>}</select>{errors.status_laporan && <p role="alert" className="mt-1 text-sm text-red-700">{errors.status_laporan}</p>}</div>
                                        <div><label htmlFor="catatan_resolusi" className="block text-sm font-medium">Catatan resolusi</label><textarea id="catatan_resolusi" name="catatan_resolusi" rows={4} maxLength={65535} aria-invalid={!!errors.catatan_resolusi} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" /><p className="mt-1 text-sm text-[#667085]">Wajib diisi saat laporan ditutup sebagai selesai atau ditolak.</p>{errors.catatan_resolusi && <p role="alert" className="mt-1 text-sm text-red-700">{errors.catatan_resolusi}</p>}</div>
                                        <button type="submit" disabled={processing} className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan perubahan'}</button>
                                    </div>
                                )}
                            </Form>
                        )}
                    </article>
                </div>
            </main>
        </>
    );
}
