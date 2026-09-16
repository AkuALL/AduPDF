import { Head, Link } from '@inertiajs/react';

type ChildTool = {
    id: number;
    name: string;
    type: string;
    condition: 'aktif' | 'dalam_perbaikan' | 'nonaktif';
};

type Facility = {
    id: number;
    name: string;
    type: string;
    location: string;
    capacity: number;
    description: string | null;
    condition: 'aktif' | 'dalam_perbaikan' | 'nonaktif';
    parent_facility: { id: number; name: string } | null;
    child_tools: ChildTool[];
};

type Props = {
    facility: Facility;
};

const typeLabels: Record<string, string> = {
    ruang_kelas: 'Ruang kelas',
    aula: 'Aula',
    laboratorium: 'Laboratorium',
    alat: 'Alat',
    lapangan: 'Lapangan',
};

const conditionConfig: Record<
    'aktif' | 'dalam_perbaikan' | 'nonaktif',
    { label: string; icon: string; classes: string }
> = {
    aktif: {
        label: 'Aktif',
        icon: '✓',
        classes: 'bg-[#EAF7F0] text-[#16794A] border-[#B7E2CB]',
    },
    dalam_perbaikan: {
        label: 'Dalam perbaikan',
        icon: '!',
        classes: 'bg-[#FFF0E8] text-[#B54708] border-[#F5C6A7]',
    },
    nonaktif: {
        label: 'Nonaktif',
        icon: '—',
        classes: 'bg-[#F0F2F4] text-[#5D6673] border-[#D7DBE0]',
    },
};

export default function FacilityShow({ facility }: Props) {
    const status = conditionConfig[facility.condition] || conditionConfig.aktif;
    const isRoom = ['ruang_kelas', 'aula', 'laboratorium'].includes(facility.type);

    return (
        <>
            <Head title={`${facility.name} — AduPDF`} />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                {/* Navigation Bar */}
                <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
                    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-xl font-bold tracking-tight text-[#2D4C79]">
                                    AduPDF
                                </span>
                                <span className="rounded bg-[#E9EEF5] px-1.5 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                    Kampus
                                </span>
                            </Link>
                            <nav className="hidden sm:flex sm:gap-6 text-sm">
                                <Link
                                    href="/facilities"
                                    className="font-semibold text-[#2D4C79] border-b-2 border-[#2D4C79] pb-4 pt-4"
                                >
                                    Fasilitas
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="/login"
                                className="inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium text-[#111827] hover:bg-[#F3F5F7] transition"
                            >
                                Masuk
                            </a>
                            <a
                                href="/register"
                                className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                            >
                                Daftar
                            </a>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back Breadcrumb */}
                    <div className="mb-6">
                        <Link
                            href="/facilities"
                            className="inline-flex items-center text-xs font-semibold text-[#2D4C79] hover:underline"
                        >
                            ← Kembali ke Katalog Fasilitas
                        </Link>
                    </div>

                    {/* Facility Detail Card (Design Section 15.1) */}
                    <article className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-8">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <span className="text-xs font-semibold text-[#2D4C79]">
                                    {typeLabels[facility.type] || facility.type}
                                </span>
                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                                    {facility.name}
                                </h1>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.classes}`}
                            >
                                <span>{status.icon}</span>
                                <span>{status.label}</span>
                            </span>
                        </div>

                        {/* Metadata Grid */}
                        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[#E5E7EB] py-5 sm:grid-cols-3">
                            <div>
                                <dt className="text-xs font-medium text-[#667085]">Lokasi</dt>
                                <dd className="mt-1 text-sm font-semibold text-[#111827]">
                                    {facility.location}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-[#667085]">Kapasitas</dt>
                                <dd className="mt-1 text-sm font-semibold text-[#111827]">
                                    {facility.capacity} orang
                                </dd>
                            </div>
                            {facility.parent_facility && (
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-xs font-medium text-[#667085]">Ruangan Induk</dt>
                                    <dd className="mt-1 text-sm font-semibold">
                                        <Link
                                            href={`/facilities/${facility.parent_facility.id}`}
                                            className="text-[#2D4C79] hover:underline"
                                        >
                                            {facility.parent_facility.name} →
                                        </Link>
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold text-[#111827]">Deskripsi</h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#667085]">
                                {facility.description || 'Tidak ada deskripsi tambahan untuk fasilitas ini.'}
                            </p>
                        </div>

                        {/* Related Resources: Child Tools (Design Section 15.3 & BR-10) */}
                        {isRoom && (
                            <div className="mt-8 border-t border-[#E5E7EB] pt-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-[#111827]">
                                        Peralatan di Ruangan Ini ({facility.child_tools.length})
                                    </h2>
                                </div>

                                {facility.child_tools.length === 0 ? (
                                    <p className="mt-3 text-xs text-[#667085]">
                                        Tidak ada peralatan terpisah yang terdaftar di ruangan ini.
                                    </p>
                                ) : (
                                    <>
                                        <div className="mt-3 divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB] bg-[#F7F8FA]/50">
                                            {facility.child_tools.map((tool) => {
                                                const toolStatus =
                                                    conditionConfig[tool.condition] ||
                                                    conditionConfig.aktif;

                                                return (
                                                    <div
                                                        key={tool.id}
                                                        className="flex items-center justify-between gap-4 px-4 py-3 bg-white"
                                                    >
                                                        <div>
                                                            <Link
                                                                href={`/facilities/${tool.id}`}
                                                                className="text-sm font-medium text-[#2D4C79] hover:underline"
                                                            >
                                                                {tool.name}
                                                            </Link>
                                                            <p className="text-xs text-[#667085]">
                                                                {typeLabels[tool.type] || tool.type}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${toolStatus.classes}`}
                                                        >
                                                            <span>{toolStatus.icon}</span>
                                                            <span>{toolStatus.label}</span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Contextual Notice per Section 15.3 & BR-10 */}
                                        <div className="mt-3 rounded-md bg-[#FFF5E6] border border-[#F5D6A6] p-3 text-xs text-[#A15C00]">
                                            <strong>Ketentuan Kampus:</strong> Apabila salah satu peralatan di atas sedang dalam perbaikan, ruangan induk ini tetap dapat diajukan untuk reservasi penuh.
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Action Area */}
                        <div className="mt-8 flex flex-col gap-3 border-t border-[#E5E7EB] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <span className="text-xs text-[#667085]">
                                Ingin memesan fasilitas ini? Silakan masuk ke akun Anda.
                            </span>
                            <div className="flex gap-2">
                                <a
                                    href="/login"
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                >
                                    Masuk untuk Reservasi
                                </a>
                            </div>
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
}
