import { Head, Link, router, usePage } from '@inertiajs/react';

type AuthUser = {
    id: number;
    name?: string;
    nama?: string;
    email: string;
    role: string;
};

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

type AvailabilitySlot = {
    start_time: string;
    end_time: string;
    is_available: boolean;
    status: string;
    label: string;
};

type Availability = {
    date: string;
    is_reservable: boolean;
    total_slots: number;
    available_slots_count: number;
    occupied_slots_count: number;
    slots: AvailabilitySlot[];
};

type Props = {
    facility: Facility;
    availability?: Availability;
    selectedDate?: string;
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

export default function FacilityShow({ facility, availability, selectedDate }: Props) {
    const { auth } = usePage<{ auth?: { user?: AuthUser | null } }>().props;
    const user = auth?.user;

    const status = conditionConfig[facility.condition] || conditionConfig.aktif;
    const isRoom = ['ruang_kelas', 'aula', 'laboratorium'].includes(facility.type);

    const currentDate = selectedDate || availability?.date || new Date().toISOString().slice(0, 10);

    const handleDateChange = (newDate: string) => {
        router.get(
            `/facilities/${facility.id}`,
            { date: newDate },
            { preserveState: true, preserveScroll: true }
        );
    };

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
                                {user?.role === 'pengguna' && (
                                    <Link
                                        href="/reservations"
                                        className="font-medium text-[#667085] hover:text-[#2D4C79] pb-4 pt-4 transition"
                                    >
                                        Reservasi Saya
                                    </Link>
                                )}
                                {user?.role === 'petugas' && (
                                    <Link
                                        href="/petugas/reservations"
                                        className="font-medium text-[#667085] hover:text-[#2D4C79] pb-4 pt-4 transition"
                                    >
                                        Panel Petugas
                                    </Link>
                                )}
                                {user?.role === 'admin' && (
                                    <a
                                        href="/admin/facilities"
                                        className="font-medium text-[#667085] hover:text-[#2D4C79] pb-4 pt-4 transition"
                                    >
                                        Kelola Fasilitas
                                    </a>
                                )}
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <div className="text-right hidden sm:block">
                                        <span className="text-xs font-semibold text-[#111827] block">
                                            {user.nama || user.name}
                                        </span>
                                        <span className="text-[10px] text-[#667085] capitalize block">
                                            {user.role}
                                        </span>
                                    </div>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="inline-flex h-9 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#5D6673] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition shadow-sm"
                                    >
                                        Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
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
                                {user
                                    ? (availability?.is_reservable ? 'Fasilitas ini dapat diajukan untuk reservasi kegiatan akademik atau organisasi.' : 'Fasilitas ini sedang tidak menerima pengajuan reservasi.')
                                    : 'Ingin memesan fasilitas ini? Silakan masuk ke akun Anda.'}
                            </span>
                            <div className="flex gap-2">
                                {user ? (
                                    availability?.is_reservable ? (
                                        <Link
                                            href={`/reservations/create?facility_id=${facility.id}`}
                                            className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                        >
                                            Ajukan Reservasi Fasilitas Ini
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-md bg-[#E5E7EB] px-4 text-xs font-semibold text-[#98A2B3]"
                                        >
                                            Tidak Tersedia untuk Reservasi
                                        </button>
                                    )
                                ) : (
                                    <a
                                        href="/login"
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                    >
                                        Masuk untuk Reservasi
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Availability Schedule Section (AG-04, FR-01, FR-02) */}
                    <section className="mt-8 rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D4C79]">
                                    Integrasi Jadwal Operasional
                                </span>
                                <h2 className="mt-1 text-xl font-bold tracking-tight text-[#111827]">
                                    Ketersediaan Slot (07:00 – 20:00 WIB)
                                </h2>
                                <p className="mt-1 text-xs text-[#667085]">
                                    Interval 30 menit. Ketersediaan otomatis mencerminkan kondisi fisik fasilitas dan reservasi yang disetujui.
                                </p>
                            </div>

                            {/* Date Picker Control */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="availability-date" className="text-xs font-medium text-[#667085] whitespace-nowrap">
                                    Pilih Tanggal:
                                </label>
                                <input
                                    id="availability-date"
                                    type="date"
                                    value={currentDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm focus:border-[#2D4C79] focus:outline-none focus:ring-1 focus:ring-[#2D4C79]"
                                />
                            </div>
                        </div>

                        {/* Availability Summary Stats */}
                        {availability && (
                            <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-[#E5E7EB] py-3 text-xs">
                                <div className="flex items-center gap-1.5 font-medium text-[#16794A]">
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#16794A]" />
                                    <span>{availability.available_slots_count} Slot Tersedia</span>
                                </div>
                                <span className="text-[#D0D5DD]">•</span>
                                <div className="flex items-center gap-1.5 font-medium text-[#667085]">
                                    <span className="inline-block h-2 w-2 rounded-full bg-[#98A2B3]" />
                                    <span>{availability.occupied_slots_count} Tidak Tersedia</span>
                                </div>
                                <span className="text-[#D0D5DD]">•</span>
                                <span className="text-[#667085]">Total {availability.total_slots} slot (30 mnt/slot)</span>

                                {!availability.is_reservable && (
                                    <span className="ml-auto rounded bg-[#FFF0E8] border border-[#F5C6A7] px-2 py-0.5 text-[11px] font-semibold text-[#B54708]">
                                        Fasilitas Saat Ini Tidak Dapat Direservasi
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Slot Grid */}
                        <div className="mt-6">
                            {availability && availability.slots.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                                    {availability.slots.map((slot) => {
                                        let slotStyle = 'bg-[#EAF7F0] border-[#B7E2CB] text-[#16794A]';
                                        let statusBadge = 'Tersedia';

                                        if (slot.status === 'terisi') {
                                            slotStyle = 'bg-[#F3F5F7] border-[#E5E7EB] text-[#667085] opacity-80';
                                            statusBadge = 'Dipesan';
                                        } else if (slot.status === 'dalam_perbaikan') {
                                            slotStyle = 'bg-[#FFF0E8] border-[#F5C6A7] text-[#B54708]';
                                            statusBadge = 'Perbaikan';
                                        } else if (slot.status === 'nonaktif' || !slot.is_available) {
                                            slotStyle = 'bg-[#F0F2F4] border-[#D7DBE0] text-[#5D6673]';
                                            statusBadge = 'Nonaktif';
                                        }

                                        const isClickable = slot.is_available && availability.is_reservable;
                                        const reservationUrl = `/reservations/create?facility_id=${facility.id}&start_time=${currentDate}T${slot.start_time}&end_time=${currentDate}T${slot.end_time}`;

                                        if (isClickable) {
                                            return (
                                                <Link
                                                    key={slot.start_time}
                                                    href={reservationUrl}
                                                    title={`Klik untuk ajukan reservasi slot ${slot.start_time} - ${slot.end_time}`}
                                                    className={`group flex flex-col items-center justify-center rounded-md border p-2 text-center transition-all cursor-pointer hover:bg-[#D4EFE0] hover:border-[#16794A] hover:shadow-sm hover:scale-[1.02] ${slotStyle}`}
                                                >
                                                    <span className="text-xs font-bold tracking-tight group-hover:underline">
                                                        {slot.start_time} - {slot.end_time}
                                                    </span>
                                                    <span className="mt-1 inline-flex items-center text-[10px] font-semibold uppercase tracking-wider">
                                                        {statusBadge}
                                                    </span>
                                                </Link>
                                            );
                                        }

                                        return (
                                            <div
                                                key={slot.start_time}
                                                title={`Slot ${slot.start_time} - ${slot.end_time} (${statusBadge})`}
                                                className={`flex flex-col items-center justify-center rounded-md border p-2 text-center transition-all cursor-default ${slotStyle}`}
                                            >
                                                <span className="text-xs font-bold tracking-tight">
                                                    {slot.start_time} - {slot.end_time}
                                                </span>
                                                <span className="mt-1 inline-flex items-center text-[10px] font-semibold uppercase tracking-wider">
                                                    {statusBadge}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-xs text-[#667085] py-8">
                                    Memuat informasi slot ketersediaan...
                                </p>
                            )}
                        </div>

                        {/* FR-02 Privacy Protection Notice */}
                        <div className="mt-6 rounded-md bg-[#F3F5F7] border border-[#E5E7EB] p-3 text-xs text-[#667085]">
                            <div className="flex items-start gap-2">
                                <span className="font-bold text-[#2D4C79]">ℹ Perlindungan Privasi (FR-02):</span>
                                <span>
                                    Sistem hanya menampilkan status ketersediaan slot waktu. Identitas pemesan, kontak, dan tujuan kegiatan yang telah disetujui dirahasiakan dari tampilan publik.
                                </span>
                            </div>
                        </div>

                        {/* CTA / Quick Link to Reservation */}
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#E5E7EB] pt-5">
                            <span className="text-xs text-[#667085]">
                                {availability?.is_reservable
                                    ? 'Slot waktu di atas dapat diajukan oleh pengguna terverifikasi.'
                                    : 'Fasilitas ini sedang tidak menerima pengajuan reservasi baru.'}
                            </span>
                            <div className="flex gap-2">
                                {availability?.is_reservable ? (
                                    <Link
                                        href={`/reservations/create?facility_id=${facility.id}`}
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                    >
                                        Ajukan Reservasi Fasilitas Ini
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-md bg-[#E5E7EB] px-4 text-xs font-semibold text-[#98A2B3]"
                                    >
                                        Tidak Tersedia untuk Reservasi
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
