import { Form, Head, Link } from '@inertiajs/react';

type Props = {
    facility: { id: number; name: string; location: string };
    reservable: boolean;
    success: string | null;
};

export default function CreateReservation({ facility, reservable, success }: Props) {
    return (
        <>
            <Head title="Ajukan Reservasi" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="mx-auto max-w-xl">
                    <Link href={`/facilities/${facility.id}`} className="text-sm font-medium text-[#2D4C79] hover:underline">
                        Kembali ke detail fasilitas
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold">Ajukan reservasi</h1>
                    <p className="mt-2 text-sm text-[#667085]">{facility.name} · {facility.location}</p>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    {!reservable && <p role="alert" className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Fasilitas ini sedang tidak dapat direservasi.</p>}

                    <Form action="/reservations" method="post" resetOnSuccess className="mt-6 space-y-5 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        {({ errors, processing }) => (
                            <>
                                <input type="hidden" name="facility_id" value={facility.id} />
                                {errors.facility_id && <p role="alert" className="text-sm text-red-700">{errors.facility_id}</p>}
                                <div>
                                    <label htmlFor="start_time" className="block text-sm font-medium">Mulai (WIB)</label>
                                    <input id="start_time" name="start_time" type="datetime-local" step="1800" required aria-invalid={!!errors.start_time} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" />
                                    {errors.start_time && <p role="alert" className="mt-1 text-sm text-red-700">{errors.start_time}</p>}
                                </div>
                                <div>
                                    <label htmlFor="end_time" className="block text-sm font-medium">Selesai (WIB)</label>
                                    <input id="end_time" name="end_time" type="datetime-local" step="1800" required aria-invalid={!!errors.end_time} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" />
                                    {errors.end_time && <p role="alert" className="mt-1 text-sm text-red-700">{errors.end_time}</p>}
                                </div>
                                <div>
                                    <label htmlFor="tujuan" className="block text-sm font-medium">Tujuan penggunaan</label>
                                    <textarea id="tujuan" name="tujuan" required maxLength={5000} rows={4} aria-invalid={!!errors.tujuan} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" />
                                    {errors.tujuan && <p role="alert" className="mt-1 text-sm text-red-700">{errors.tujuan}</p>}
                                </div>
                                <p className="text-sm text-[#667085]">Jam operasional 07:00–20:00 WIB, dalam slot 30 menit. Pengajuan menunggu persetujuan Petugas.</p>
                                <button type="submit" disabled={processing || !reservable} className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                    {processing ? 'Mengirim...' : 'Kirim pengajuan'}
                                </button>
                            </>
                        )}
                    </Form>
                </div>
            </main>
        </>
    );
}
