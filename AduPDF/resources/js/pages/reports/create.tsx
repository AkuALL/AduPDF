import { Form, Head, Link } from '@inertiajs/react';

type Facility = {
    id: number;
    name: string;
    location: string;
};

type Props = {
    facilities: Facility[];
    success: string | null;
};

export default function CreateReport({ facilities, success }: Props) {
    return (
        <>
            <Head title="Laporkan Kerusakan" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="w-full">
                    <Link href="/facilities" className="text-sm font-medium text-[#2D4C79] hover:underline">
                        Kembali ke fasilitas
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold">Laporkan kerusakan</h1>
                    <p className="mt-2 text-sm text-[#667085]">Sertakan foto pendukung agar Petugas dapat menindaklanjuti laporan Anda.</p>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}

                    <Form action="/reports" method="post" encType="multipart/form-data" resetOnSuccess className="mt-6 space-y-5 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        {({ errors, processing, progress }) => (
                            <>
                                <div>
                                    <label htmlFor="facility_id" className="block text-sm font-medium">Fasilitas</label>
                                    <select id="facility_id" name="facility_id" required defaultValue="" aria-invalid={!!errors.facility_id} className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2">
                                        <option value="" disabled>Pilih fasilitas</option>
                                        {facilities.map((facility) => (
                                            <option key={facility.id} value={facility.id}>{facility.name} · {facility.location}</option>
                                        ))}
                                    </select>
                                    {errors.facility_id && <p role="alert" className="mt-1 text-sm text-red-700">{errors.facility_id}</p>}
                                </div>
                                <div>
                                    <label htmlFor="kategori" className="block text-sm font-medium">Kategori kerusakan</label>
                                    <input id="kategori" name="kategori" type="text" required maxLength={100} aria-invalid={!!errors.kategori} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" />
                                    {errors.kategori && <p role="alert" className="mt-1 text-sm text-red-700">{errors.kategori}</p>}
                                </div>
                                <div>
                                    <label htmlFor="deskripsi" className="block text-sm font-medium">Deskripsi</label>
                                    <textarea id="deskripsi" name="deskripsi" required rows={5} aria-invalid={!!errors.deskripsi} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" />
                                    {errors.deskripsi && <p role="alert" className="mt-1 text-sm text-red-700">{errors.deskripsi}</p>}
                                </div>
                                <div>
                                    <label htmlFor="attachments" className="block text-sm font-medium">Foto pendukung</label>
                                    <input id="attachments" name="attachments[]" type="file" accept="image/jpeg,image/png" multiple required aria-invalid={!!errors.attachments} className="mt-1 block w-full text-sm" />
                                    <p className="mt-1 text-sm text-[#667085]">Wajib 1–8 foto JPG, JPEG, atau PNG. Maksimal 2 MB per foto.</p>
                                    {errors.attachments && <p role="alert" className="mt-1 text-sm text-red-700">{errors.attachments}</p>}
                                    {errors['attachments.0'] && <p role="alert" className="mt-1 text-sm text-red-700">{errors['attachments.0']}</p>}
                                </div>
                                {progress && <progress value={progress.percentage} max="100" className="w-full">{progress.percentage}%</progress>}
                                <button type="submit" disabled={processing} className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                                    {processing ? 'Mengirim...' : 'Kirim laporan'}
                                </button>
                            </>
                        )}
                    </Form>
                </div>
            </main>
        </>
    );
}
