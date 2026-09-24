import { Form, Head, Link, usePage } from '@inertiajs/react';
import PetugasLayout from '@/layouts/petugas-layout';

type ReservationItem = {
    id: number;
    user_name: string;
    facility_name: string;
    facility_location: string;
    tujuan: string;
    status: string;
    created_at: string;
    created_at_human: string;
};

type ReservationSegment = {
    slot_key: string;
    slot_label: string;
    start_time: string;
    end_time: string;
    count: number;
    reservations: ReservationItem[];
};

type ReportItem = {
    id: number;
    kategori: string;
    deskripsi: string;
    reporter_name: string;
    facility_name: string;
    facility_location: string;
    facility_condition: string;
    status: string;
    created_at: string;
    created_at_human: string;
};

type Props = {
    pending_reservations_count: number;
    new_reports_count: number;
    reservation_segments: ReservationSegment[];
    reports: ReportItem[];
};

export default function PetugasDashboard({
    pending_reservations_count,
    new_reports_count,
    reservation_segments,
    reports,
}: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    return (
        <PetugasLayout activePage="dashboard">
            <Head title="Dashboard Petugas — AduPDF" />
                <main className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div role="status" className="mb-6 rounded-md border border-[#B7E2CB] bg-[#EAF7F0] p-4 text-sm text-[#16794A]">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div role="alert" className="mb-6 rounded-md border border-[#F2B8B5] bg-[#FDECEC] p-4 text-sm text-[#B42318]">
                            {flash.error}
                        </div>
                    )}

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">Dashboard Operasional Petugas</h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Pantau antrean reservasi menunggu persetujuan dan laporan kerusakan baru dari sivitas akademika.
                        </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Antrean Reservasi</span>
                                <div className="mt-1 text-3xl font-bold text-[#111827]">{pending_reservations_count}</div>
                                <span className="text-xs text-[#667085]">pengajuan menunggu persetujuan</span>
                            </div>
                            <span className="rounded-full border border-[#F5D6A6] bg-[#FFF5E6] px-3 py-1 text-xs font-semibold text-[#A15C00]">
                                ○ Menunggu
                            </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Antrean Kerusakan</span>
                                <div className="mt-1 text-3xl font-bold text-[#111827]">{new_reports_count}</div>
                                <span className="text-xs text-[#667085]">laporan baru perlu diproses</span>
                            </div>
                            <span className="rounded-full border border-[#F5D6A6] bg-[#FFF5E6] px-3 py-1 text-xs font-semibold text-[#A15C00]">
                                ○ Baru
                            </span>
                        </div>
                    </div>

                    {/* Section 1: Reservation Segments */}
                    <section className="mb-10 space-y-4">
                        <div className="border-b border-[#E5E7EB] pb-3">
                            <h2 className="text-lg font-bold text-[#111827]">Antrean Reservasi Menunggu (Segmen Slot Waktu)</h2>
                            <p className="mt-0.5 text-xs text-[#667085]">
                                Dikelompokkan per slot waktu penggunaan (slot terdekat ditampilkan lebih dahulu), dan diurutkan secara FIFO (First In, First Out).
                            </p>
                        </div>

                        {reservation_segments.length === 0 ? (
                            <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
                                <h3 className="text-base font-semibold text-[#111827]">Tidak Ada Antrean Reservasi</h3>
                                <p className="mt-1 text-sm text-[#667085]">Seluruh pengajuan reservasi telah diproses.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reservation_segments.map((segment) => (
                                    <div key={segment.slot_key} className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                                            <div>
                                                <div className="text-sm font-bold text-[#111827]">{segment.slot_label}</div>
                                                <div className="text-xs text-[#667085]">
                                                    Rentang Slot: {segment.start_time} – {segment.end_time}
                                                </div>
                                            </div>
                                            <span className="rounded-full border border-[#BFD6ED] bg-[#E9EEF5] px-2.5 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                                {segment.count} Pengajuan di Slot Ini
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold uppercase text-[#667085]">
                                                    <tr>
                                                        <th className="px-4 py-3">Fasilitas</th>
                                                        <th className="px-4 py-3">Pemesan</th>
                                                        <th className="px-4 py-3">Tujuan</th>
                                                        <th className="px-4 py-3">Diajukan</th>
                                                        <th className="px-4 py-3 text-right">Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#E5E7EB]">
                                                    {segment.reservations.map((res) => (
                                                        <tr key={res.id} className="hover:bg-[#F8FAFC]">
                                                            <td className="px-4 py-3">
                                                                <div className="font-semibold text-[#111827]">{res.facility_name}</div>
                                                                <div className="text-xs text-[#667085]">{res.facility_location}</div>
                                                            </td>
                                                            <td className="px-4 py-3 font-medium text-[#111827]">{res.user_name}</td>
                                                            <td className="max-w-xs px-4 py-3 text-xs text-[#667085]">{res.tujuan}</td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                                <div className="font-medium text-[#111827]">{res.created_at}</div>
                                                                <div className="text-[#667085]">{res.created_at_human}</div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-4 py-3 text-right">
                                                                <div className="inline-flex gap-2">
                                                                    <Form action={`/petugas/reservations/${res.id}/approve`} method="patch">
                                                                        {({ processing }) => (
                                                                            <button
                                                                                type="submit"
                                                                                disabled={processing}
                                                                                className="rounded bg-[#16794A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#12633c] disabled:opacity-50"
                                                                            >
                                                                                Setujui
                                                                            </button>
                                                                        )}
                                                                    </Form>
                                                                    <Form action={`/petugas/reservations/${res.id}/reject`} method="patch">
                                                                        {({ processing }) => (
                                                                            <button
                                                                                type="submit"
                                                                                disabled={processing}
                                                                                className="rounded border border-[#F2B8B5] bg-[#FDECEC] px-3 py-1.5 text-xs font-semibold text-[#B42318] hover:bg-[#FCD8D8] disabled:opacity-50"
                                                                            >
                                                                                Tolak
                                                                            </button>
                                                                        )}
                                                                    </Form>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section 2: Report Queue */}
                    <section className="space-y-4">
                        <div className="border-b border-[#E5E7EB] pb-3">
                            <h2 className="text-lg font-bold text-[#111827]">Antrean Laporan Kerusakan Baru</h2>
                            <p className="mt-0.5 text-xs text-[#667085]">
                                Laporan kerusakan berstatus baru yang membutuhkan verifikasi atau tindak lanjut penanganan.
                            </p>
                        </div>

                        {reports.length === 0 ? (
                            <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
                                <h3 className="text-base font-semibold text-[#111827]">Tidak Ada Laporan Baru</h3>
                                <p className="mt-1 text-sm text-[#667085]">Belum ada laporan kerusakan baru yang perlu diproses.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-[#E5E7EB] bg-[#F7F8FA] text-xs font-semibold uppercase text-[#667085]">
                                            <tr>
                                                <th className="px-4 py-3">Fasilitas</th>
                                                <th className="px-4 py-3">Pelapor</th>
                                                <th className="px-4 py-3">Kategori & Deskripsi</th>
                                                <th className="px-4 py-3">Waktu Lapor</th>
                                                <th className="px-4 py-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E5E7EB]">
                                            {reports.map((rep) => (
                                                <tr key={rep.id} className="hover:bg-[#F8FAFC]">
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-[#111827]">{rep.facility_name}</div>
                                                        <div className="text-xs text-[#667085]">
                                                            {rep.facility_location} · Kondisi: {rep.facility_condition}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-[#111827]">{rep.reporter_name}</td>
                                                    <td className="max-w-sm px-4 py-3">
                                                        <div className="inline-block rounded bg-[#F0F2F4] px-1.5 py-0.5 text-[11px] font-semibold text-[#5D6673]">
                                                            {rep.kategori}
                                                        </div>
                                                        <div className="text-xs text-[#667085] line-clamp-2">{rep.deskripsi}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                        <div className="font-medium text-[#111827]">{rep.created_at}</div>
                                                        <div className="text-[#667085]">{rep.created_at_human}</div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3 text-right">
                                                        <Link
                                                            href={`/petugas/reports/${rep.id}`}
                                                            className="rounded bg-[#2D4C79] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#243E63]"
                                                        >
                                                            Detail & Proses →
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
        </PetugasLayout>
    );
}
