import { Head, Link, router, usePage } from '@inertiajs/react';
import { UserNavbar } from '@/components/user-navbar';
import FacilityPhotoCarousel from '@/components/facility-photo-carousel';
import { facilityImages } from '@/lib/facility-images';
import DateCalendarGrid from '@/components/date-calendar-grid';
import { useState } from 'react';

const wibDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const displayDateFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

function todayWibDate(): string {
    const parts = Object.fromEntries(wibDateFormatter.formatToParts(new Date()).map(({ type, value }) => [type, value])) as Record<string, string>;

    return `${parts.year}-${parts.month}-${parts.day}`;
}

function currentWibTime(): string {
    return new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

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
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);

    const status = conditionConfig[facility.condition] || conditionConfig.aktif;
    const isRoom = ['ruang_kelas', 'aula', 'laboratorium'].includes(facility.type);

    const today = todayWibDate();
    const currentTime = currentWibTime();
    const latestDateValue = new Date(`${today}T00:00:00Z`);
    latestDateValue.setUTCDate(latestDateValue.getUTCDate() + 90);
    const latestDate = latestDateValue.toISOString().slice(0, 10);
    const currentDate = selectedDate || availability?.date || today;

    const isSlotPast = (slotStartTime: string) => {
        if (currentDate < today) return true;
        if (currentDate > today) return false;
        return slotStartTime <= currentTime;
    };

    const isSlotSelectable = (slot: AvailabilitySlot) => {
        return slot.is_available && (availability?.is_reservable ?? false) && !isSlotPast(slot.start_time);
    };

    const handleDateChange = (newDate: string) => {
        setIsCalendarOpen(false);
        setSelectedRange(null);
        router.get(
            `/facilities/${facility.id}`,
            { date: newDate },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSlotClick = (idx: number) => {
        if (!availability?.slots) return;

        if (!selectedRange) {
            setSelectedRange({ start: idx, end: idx });
            return;
        }

        const { start, end } = selectedRange;

        // Clicking start slot: deselect if single, collapse to start if range
        if (idx === start) {
            setSelectedRange(start === end ? null : { start, end: start });
            return;
        }

        // Clicking end slot when range is active: undo time window, revert to start slot only
        if (idx === end && start !== end) {
            setSelectedRange({ start, end: start });
            return;
        }

        // Clicking backwards (idx < start): move forward only, so change selection
        if (idx < start) {
            setSelectedRange({ start: idx, end: idx });
            return;
        }

        // Clicking forward (idx > start): adjust end to idx if contiguous range is available
        const allAvailable = availability.slots
            .slice(start, idx + 1)
            .every((s) => isSlotSelectable(s));

        if (allAvailable) {
            setSelectedRange({ start, end: idx });
        } else {
            setSelectedRange({ start: idx, end: idx });
        }
    };

    return (
        <>
            <Head title={`${facility.name} — AduPDF`} />
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                {/* Navigation Bar */}
                <UserNavbar current="facilities" />

                {/* Main Content Area */}
                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link
                            href="/facilities"
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 transition"
                        >
                            <span aria-hidden="true">←</span> Kembali
                        </Link>
                    </div>

                    {/* Facility Detail Card (Design Section 15.1) */}
                    <article className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-8">
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-8">
                        {facilityImages[facility.type] && (
                            <FacilityPhotoCarousel images={facilityImages[facility.type]} alt={facility.name} />
                        )}
                        <div className="min-w-0">
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
                        </div>
                        </div>

                        {/* Peralatan yang berada di dalam ruangan */}
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

                                        {/* Informasi pemesanan saat ada alat dalam perbaikan */}
                                        <div className="mt-3 rounded-md bg-[#FFF5E6] border border-[#F5D6A6] p-3 text-xs text-[#A15C00]">
                                            <strong>Ketentuan Kampus:</strong> Apabila salah satu peralatan di atas sedang dalam perbaikan, ruangan induk ini tetap dapat diajukan untuk reservasi penuh.
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </article>

                    {/* Jadwal ketersediaan fasilitas */}
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
                            <div className="relative flex items-center gap-2">
                                <span id="availability-date-label" className="text-xs font-medium text-[#667085] whitespace-nowrap">
                                    Pilih Tanggal:
                                </span>
                                <button
                                    type="button"
                                    aria-haspopup="dialog"
                                    aria-expanded={isCalendarOpen}
                                    aria-labelledby="availability-date-label availability-date-value"
                                    onClick={() => setIsCalendarOpen((open) => !open)}
                                    className="inline-flex min-w-44 items-center justify-between gap-3 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/30"
                                >
                                    <span id="availability-date-value">{displayDateFormatter.format(new Date(`${currentDate}T00:00:00Z`))}</span>
                                    <span aria-hidden="true" className="text-[#667085]">▾</span>
                                </button>
                                {isCalendarOpen && (
                                    <div
                                        role="dialog"
                                        aria-label="Pilih tanggal ketersediaan"
                                        onKeyDown={(event) => {
                                            if (event.key === 'Escape') {
                                                setIsCalendarOpen(false);
                                            }
                                        }}
                                        className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white shadow-lg"
                                    >
                                        <DateCalendarGrid
                                            value={currentDate}
                                            minimumDate={today}
                                            maximumDate={latestDate}
                                            onSelect={handleDateChange}
                                        />
                                    </div>
                                )}
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
                                    {availability.slots.map((slot, index) => {
                                        const isPast = isSlotPast(slot.start_time);
                                        const isSelectable = isSlotSelectable(slot);
                                        const isSelected = selectedRange !== null && index >= selectedRange.start && index <= selectedRange.end;

                                        let slotStyle = 'bg-[#EAF7F0] border-[#B7E2CB] text-[#16794A]';
                                        let statusBadge = 'Tersedia';

                                        if (isSelected) {
                                            slotStyle = 'bg-[#2D4C79] border-[#1C3150] text-white shadow-sm ring-2 ring-[#2D4C79]/30';
                                            statusBadge = 'Dipilih';
                                        } else if (isPast) {
                                            slotStyle = 'bg-[#F3F5F7] border-[#E5E7EB] text-[#98A2B3] opacity-60';
                                            statusBadge = 'Lewat';
                                        } else if (slot.status === 'terisi') {
                                            slotStyle = 'bg-[#F3F5F7] border-[#E5E7EB] text-[#667085] opacity-80';
                                            statusBadge = 'Dipesan';
                                        } else if (slot.status === 'dalam_perbaikan') {
                                            slotStyle = 'bg-[#FFF0E8] border-[#F5C6A7] text-[#B54708]';
                                            statusBadge = 'Perbaikan';
                                        } else if (slot.status === 'nonaktif' || !slot.is_available) {
                                            slotStyle = 'bg-[#F0F2F4] border-[#D7DBE0] text-[#5D6673]';
                                            statusBadge = 'Nonaktif';
                                        }

                                        if (isSelectable) {
                                            return (
                                                <button
                                                    key={slot.start_time}
                                                    type="button"
                                                    onClick={() => handleSlotClick(index)}
                                                    aria-pressed={isSelected}
                                                    title={
                                                        isSelected
                                                            ? `Slot ${slot.start_time} - ${slot.end_time} dipilih (klik untuk ubah/batalkan)`
                                                            : `Klik untuk memilih slot ${slot.start_time} - ${slot.end_time}`
                                                    }
                                                    className={`group flex flex-col items-center justify-center rounded-md border p-2 text-center transition-all cursor-pointer ${
                                                        isSelected
                                                            ? slotStyle
                                                            : `${slotStyle} hover:bg-[#D4EFE0] hover:border-[#16794A] hover:shadow-sm hover:scale-[1.02]`
                                                    }`}
                                                >
                                                    <span className="text-xs font-bold tracking-tight">
                                                        {slot.start_time} - {slot.end_time}
                                                    </span>
                                                    <span className={`mt-1 inline-flex items-center text-[10px] font-semibold uppercase tracking-wider ${isSelected ? 'text-white/90' : ''}`}>
                                                        {statusBadge}
                                                    </span>
                                                </button>
                                            );
                                        }

                                        return (
                                            <div
                                                key={slot.start_time}
                                                aria-disabled="true"
                                                title={`Slot ${slot.start_time} - ${slot.end_time} (${statusBadge})`}
                                                className={`flex flex-col items-center justify-center rounded-md border p-2 text-center transition-all cursor-not-allowed select-none ${slotStyle}`}
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

                        {/* CTA / Quick Link to Reservation */}
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#E5E7EB] pt-5">
                            <div>
                                {selectedRange !== null && availability ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-semibold text-[#111827]">
                                            Slot dipilih: {availability.slots[selectedRange.start].start_time} - {availability.slots[selectedRange.end].end_time} (WIB)
                                        </span>
                                        <span className="rounded bg-[#E9EEF5] px-1.5 py-0.5 text-[10px] font-semibold text-[#2D4C79]">
                                            {selectedRange.end - selectedRange.start + 1} slot
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRange(null)}
                                            className="text-xs text-[#B54708] hover:underline"
                                        >
                                            Reset pilihan
                                        </button>
                                    </div>
                                ) : (
                                    !availability?.is_reservable && (
                                        <span className="text-xs text-[#B54708]">
                                            Fasilitas ini sedang tidak menerima pengajuan reservasi baru.
                                        </span>
                                    )
                                )}
                            </div>
                            <div className="flex gap-2">
                                {availability?.is_reservable && selectedRange !== null ? (
                                    <Link
                                        href={
                                            user
                                                ? `/reservations/create?facility_id=${facility.id}&start_time=${currentDate}T${availability.slots[selectedRange.start].start_time}&end_time=${currentDate}T${availability.slots[selectedRange.end].end_time}`
                                                : '/login'
                                        }
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                    >
                                        Ajukan Reservasi ({availability.slots[selectedRange.start].start_time} - {availability.slots[selectedRange.end].end_time})
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="inline-flex h-9 cursor-not-allowed items-center justify-center rounded-md bg-[#E5E7EB] px-4 text-xs font-semibold text-[#98A2B3]"
                                    >
                                        {!availability?.is_reservable ? 'Tidak Tersedia untuk Reservasi' : 'Pilih Slot Waktu'}
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
