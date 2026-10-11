import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { FlashAlert } from '@/components/flash-alert';
import { UserNavbar } from '@/components/user-navbar';

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
    const [clientFileErrors, setClientFileErrors] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const errorsList: string[] = [];
        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

        if (files && files.length > 0) {
            if (files.length > 8) {
                errorsList.push('Maksimal 8 foto yang dapat dilampirkan.');
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.size > MAX_FILE_SIZE) {
                    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                    errorsList.push(`Foto "${file.name}" berukuran ${sizeMb} MB, melebihi batas maksimal 2 MB.`);
                }
                if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                    errorsList.push(`Foto "${file.name}" harus berformat JPG, JPEG, atau PNG.`);
                }
            }
        }

        setClientFileErrors(errorsList);
    };

    return (
        <>
            <Head title="Laporkan Kerusakan" />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                <UserNavbar current="reports" />

                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    <div className="w-full">
                        <div className="mb-6">
                            <Link
                                href="/facilities"
                                className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 transition cursor-pointer"
                            >
                                <span aria-hidden="true">←</span> Kembali ke fasilitas
                            </Link>
                        </div>
                        <h1 className="mt-6 text-2xl font-bold">Laporkan kerusakan</h1>
                        <p className="mt-2 text-sm text-[#667085]">
                            Sertakan foto pendukung agar Petugas dapat menindaklanjuti laporan Anda.
                        </p>
                        {success && (
                            <FlashAlert
                                type="success"
                                message={success}
                                autoCloseDelay={5000}
                            />
                        )}

                        <Form
                            action="/reports"
                            method="post"
                            encType="multipart/form-data"
                            resetOnSuccess
                            onSubmit={(e) => {
                                if (clientFileErrors.length > 0) {
                                    e.preventDefault();
                                }
                            }}
                            className="mt-6 space-y-5 rounded-lg border border-[#E5E7EB] bg-white p-6"
                        >
                            {({ errors, processing, progress }) => {
                                const serverAttachmentErrors = Object.entries(errors)
                                    .filter(([key]) => key.startsWith('attachments'))
                                    .map(([_, msg]) => msg);
                                const allAttachmentErrors = Array.from(
                                    new Set([...clientFileErrors, ...serverAttachmentErrors])
                                );

                                return (
                                    <>
                                        <div>
                                            <label htmlFor="facility_id" className="block text-sm font-medium">
                                                Fasilitas
                                            </label>
                                            <select
                                                id="facility_id"
                                                name="facility_id"
                                                required
                                                defaultValue=""
                                                aria-invalid={!!errors.facility_id}
                                                className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827]"
                                            >
                                                <option value="" disabled>
                                                    Pilih fasilitas
                                                </option>
                                                {facilities.map((facility) => (
                                                    <option key={facility.id} value={facility.id}>
                                                        {facility.name} · {facility.location}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.facility_id && (
                                                <p role="alert" className="mt-1 text-sm text-red-700">
                                                    {errors.facility_id}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="kategori" className="block text-sm font-medium">
                                                Kategori kerusakan
                                            </label>
                                            <select
                                                id="kategori"
                                                name="kategori"
                                                required
                                                defaultValue=""
                                                aria-invalid={!!errors.kategori}
                                                className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827]"
                                            >
                                                <option value="" disabled>
                                                    Pilih kategori kerusakan
                                                </option>
                                                <option value="Ringan">Ringan</option>
                                                <option value="Sedang">Sedang</option>
                                                <option value="Parah">Parah</option>
                                            </select>
                                            {errors.kategori && (
                                                <p role="alert" className="mt-1 text-sm text-red-700">
                                                    {errors.kategori}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="deskripsi" className="block text-sm font-medium">
                                                Deskripsi
                                            </label>
                                            <textarea
                                                id="deskripsi"
                                                name="deskripsi"
                                                required
                                                rows={5}
                                                aria-invalid={!!errors.deskripsi}
                                                className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-[#111827]"
                                            />
                                            {errors.deskripsi && (
                                                <p role="alert" className="mt-1 text-sm text-red-700">
                                                    {errors.deskripsi}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="attachments" className="block text-sm font-medium">
                                                Foto pendukung
                                            </label>
                                            <input
                                                id="attachments"
                                                name="attachments[]"
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                multiple
                                                required
                                                onChange={handleFileChange}
                                                aria-invalid={allAttachmentErrors.length > 0}
                                                className="mt-1 block w-full rounded-md border border-[#D0D5DD] bg-white p-1.5 text-xs text-[#667085] file:mr-3 file:rounded-md file:border-0 file:bg-[#2D4C79] file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-white file:shadow-xs hover:file:bg-[#243E63] file:cursor-pointer cursor-pointer focus:border-[#2D4C79] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                            />
                                            <p className="mt-1.5 text-xs text-[#667085]">
                                                Wajib 1–8 foto JPG, JPEG, atau PNG. Maksimal 2 MB per foto.
                                            </p>
                                            {allAttachmentErrors.length > 0 && (
                                                <div
                                                    role="alert"
                                                    className="mt-2.5 space-y-1.5 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800"
                                                >
                                                    {allAttachmentErrors.map((err, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5">
                                                            <span className="font-bold text-rose-600">⚠</span>
                                                            <span>{err}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {progress && (
                                            <progress value={progress.percentage} max="100" className="w-full">
                                                {progress.percentage}%
                                            </progress>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={processing || clientFileErrors.length > 0}
                                            className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
                                        >
                                            {processing ? 'Mengirim...' : 'Kirim laporan'}
                                        </button>
                                    </>
                                );
                            }}
                        </Form>
                    </div>
                </main>
            </div>
        </>
    );
}
