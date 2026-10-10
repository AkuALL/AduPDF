import { Head, Link, usePage } from '@inertiajs/react';
import { UserNavbar } from '@/components/user-navbar';
import FacilityPhotoCarousel from '@/components/facility-photo-carousel';
import { facilityImages } from '@/lib/facility-images';
import DateCalendarGrid from '@/components/date-calendar-grid';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { useEffect, useState } from 'react';

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

const longDateFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

type DayPlan = {
    id: string;
    date: string;
    availability: Availability | null;
    isLoading: boolean;
    selectedRange: { start: number; end: number } | null;
    isCalendarOpen: boolean;
    isExpanded: boolean;
};

export default function FacilityShow({ facility, availability, selectedDate }: Props) {
    const page = usePage<{ auth?: { user?: AuthUser | null } }>();
    const user = page.props.auth?.user;
    const pageVersion = page.version;

    const today = todayWibDate();
    const currentTime = currentWibTime();
    const isTodayUnavailable = currentTime >= '19:30';

    const tomorrowValue = new Date(`${today}T00:00:00Z`);
    tomorrowValue.setUTCDate(tomorrowValue.getUTCDate() + 1);
    const tomorrow = tomorrowValue.toISOString().slice(0, 10);

    const latestDateValue = new Date(`${today}T00:00:00Z`);
    latestDateValue.setUTCDate(latestDateValue.getUTCDate() + 90);
    const latestDate = latestDateValue.toISOString().slice(0, 10);
    const defaultDate = isTodayUnavailable ? tomorrow : today;
    const initialDate = selectedDate || availability?.date || defaultDate;

    const [days, setDays] = useState<DayPlan[]>([
        {
            id: `day-${initialDate}`,
            date: initialDate,
            availability: availability || null,
            isLoading: false,
            selectedRange: null,
            isCalendarOpen: false,
            isExpanded: true,
        },
    ]);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

    const status = conditionConfig[facility.condition] || conditionConfig.aktif;
    const isRoom = ['ruang_kelas', 'aula', 'laboratorium'].includes(facility.type);

    const isSlotPast = (dayDate: string, slotStartTime: string) => {
        if (dayDate < today) return true;
        if (dayDate > today) return false;
        return slotStartTime <= currentTime;
    };

    const isSlotSelectable = (day: DayPlan, slot: AvailabilitySlot) => {
        return slot.is_available && (day.availability?.is_reservable ?? false) && !isSlotPast(day.date, slot.start_time);
    };

    const fetchAvailability = async (targetDate: string): Promise<Availability | null> => {
        try {
            const headers: Record<string, string> = {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Inertia': 'true',
                Accept: 'application/json',
            };
            if (pageVersion) {
                headers['X-Inertia-Version'] = pageVersion;
            }

            const res = await fetch(`/facilities/${facility.id}?date=${targetDate}`, { headers });
            if (res.ok) {
                const data = await res.json();
                return data.props?.availability || null;
            }
        } catch (e) {
            console.error('Gagal mengambil ketersediaan via AJAX:', e);
        }
        return null;
    };

    const getNextDate = (existingDates: string[]): string => {
        const sorted = [...existingDates].sort();
        const last = sorted[sorted.length - 1] || today;
        const d = new Date(`${last}T00:00:00Z`);
        d.setUTCDate(d.getUTCDate() + 1);
        let nextStr = d.toISOString().slice(0, 10);
        let count = 0;
        while (existingDates.includes(nextStr) && count < 60) {
            d.setUTCDate(d.getUTCDate() + 1);
            nextStr = d.toISOString().slice(0, 10);
            count++;
        }
        return nextStr;
    };

    const toggleCalendar = (dayId: string) => {
        setDays((prev) =>
            prev.map((d) => (d.id === dayId ? { ...d, isCalendarOpen: !d.isCalendarOpen } : { ...d, isCalendarOpen: false }))
        );
    };

    const toggleDayExpanded = (dayId: string) => {
        setDays((prev) =>
            prev.map((d) => (d.id === dayId ? { ...d, isExpanded: !d.isExpanded } : d))
        );
    };

    const handleDayDateChange = (dayId: string, newDate: string) => {
        setDays((prev) =>
            prev.map((d) =>
                d.id === dayId
                    ? {
                          ...d,
                          date: newDate,
                          availability: null,
                          isLoading: true,
                          selectedRange: null,
                          isCalendarOpen: false,
                      }
                    : d
            )
        );

        fetchAvailability(newDate).then((avail) => {
            setDays((prev) =>
                prev.map((d) => (d.id === dayId ? { ...d, availability: avail, isLoading: false } : d))
            );
        });
    };

    const [isAddDayOpen, setIsAddDayOpen] = useState(false);

    const handleAddDate = (targetDate: string) => {
        setIsAddDayOpen(false);

        const existing = days.find((d) => d.date === targetDate);
        if (existing) {
            setDays((prev) =>
                prev.map((d) => (d.date === targetDate ? { ...d, isExpanded: true } : d))
            );
            return;
        }

        const newDayId = `day-${Date.now()}`;

        // Collapse all older days and open the new day!
        setDays((prev) => [
            ...prev.map((d) => ({ ...d, isExpanded: false, isCalendarOpen: false })),
            {
                id: newDayId,
                date: targetDate,
                availability: null,
                isLoading: true,
                selectedRange: null,
                isCalendarOpen: false,
                isExpanded: true,
            },
        ]);

        fetchAvailability(targetDate).then((avail) => {
            setDays((prev) =>
                prev.map((d) => (d.id === newDayId ? { ...d, availability: avail, isLoading: false } : d))
            );
        });
    };

    const handleRemoveDay = (dayId: string) => {
        if (days.length <= 1) return;
        setDays((prev) => prev.filter((d) => d.id !== dayId));
    };

    const handleSlotClick = (dayId: string, idx: number) => {
        setDays((prev) =>
            prev.map((day) => {
                if (day.id !== dayId || !day.availability?.slots) return day;

                const currentRange = day.selectedRange;
                if (!currentRange) {
                    return { ...day, selectedRange: { start: idx, end: idx } };
                }

                const { start, end } = currentRange;

                // Clicking start slot: deselect if single, collapse to start if range
                if (idx === start) {
                    return { ...day, selectedRange: start === end ? null : { start, end: start } };
                }

                // Clicking end slot when range is active: undo time window, revert to start slot only
                if (idx === end && start !== end) {
                    return { ...day, selectedRange: { start, end: start } };
                }

                // Clicking backwards (idx < start): move forward only, so change selection
                if (idx < start) {
                    return { ...day, selectedRange: { start: idx, end: idx } };
                }

                // Clicking forward (idx > start): adjust end to idx if contiguous range is available
                const allAvailable = day.availability.slots
                    .slice(start, idx + 1)
                    .every((s) => isSlotSelectable(day, s));

                return {
                    ...day,
                    selectedRange: allAvailable ? { start, end: idx } : { start: idx, end: idx },
                };
            })
        );
    };

    const handleResetAll = () => {
        setDays((prev) => prev.map((d) => ({ ...d, selectedRange: null })));
        document.cookie = 'pending_reservation=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
    };

    const selectedDays = days.filter((d) => d.selectedRange !== null && d.availability?.slots);
    const totalSelectedSlots = selectedDays.reduce((sum, d) => {
        if (!d.selectedRange) return sum;
        return sum + (d.selectedRange.end - d.selectedRange.start + 1);
    }, 0);

    const savePendingReservationCookie = () => {
        if (selectedDays.length === 0) return;
        const reservationUrl = `/reservations/create?facility_id=${facility.id}&start_time=${selectedDays[0].date}T${selectedDays[0].availability!.slots[selectedDays[0].selectedRange!.start].start_time}&end_time=${selectedDays[selectedDays.length - 1].date}T${selectedDays[selectedDays.length - 1].availability!.slots[selectedDays[selectedDays.length - 1].selectedRange!.end].end_time}&schedules=${encodeURIComponent(
            JSON.stringify(
                selectedDays.map((d) => ({
                    date: d.date,
                    start_time: d.availability!.slots[d.selectedRange!.start].start_time,
                    end_time: d.availability!.slots[d.selectedRange!.end].end_time,
                    slots_count: d.selectedRange!.end - d.selectedRange!.start + 1,
                }))
            )
        )}`;

        const payload = {
            facility_id: facility.id,
            facility_name: facility.name,
            start_time: `${selectedDays[0].date}T${selectedDays[0].availability!.slots[selectedDays[0].selectedRange!.start].start_time}`,
            end_time: `${selectedDays[selectedDays.length - 1].date}T${selectedDays[selectedDays.length - 1].availability!.slots[selectedDays[selectedDays.length - 1].selectedRange!.end].end_time}`,
            schedules: selectedDays.map((d) => ({
                date: d.date,
                start_time: d.availability!.slots[d.selectedRange!.start].start_time,
                end_time: d.availability!.slots[d.selectedRange!.end].end_time,
                slots_count: d.selectedRange!.end - d.selectedRange!.start + 1,
            })),
            url: reservationUrl,
        };

        const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
        document.cookie = `pending_reservation=${encodeURIComponent(JSON.stringify(payload))}; expires=${expires}; path=/; SameSite=Lax`;
    };

    useEffect(() => {
        if (selectedDays.length > 0) {
            savePendingReservationCookie();
        }
    }, [days]);

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
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 transition cursor-pointer"
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
                                <span className="text-sm font-semibold text-[#2D4C79]">
                                    {typeLabels[facility.type] || facility.type}
                                </span>
                                <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
                                    {facility.name}
                                </h1>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${status.classes}`}
                            >
                                <span>{status.icon}</span>
                                <span>{status.label}</span>
                            </span>
                        </div>

                        {/* Metadata Grid */}
                        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-[#E5E7EB] py-5 sm:grid-cols-3">
                            <div>
                                <dt className="text-sm font-medium text-[#667085]">Lokasi</dt>
                                <dd className="mt-1 text-base font-semibold text-[#111827]">
                                    {facility.location}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-[#667085]">Kapasitas</dt>
                                <dd className="mt-1 text-base font-semibold text-[#111827]">
                                    {facility.capacity} orang
                                </dd>
                            </div>
                            {facility.parent_facility && (
                                <div className="col-span-2 sm:col-span-1">
                                    <dt className="text-sm font-medium text-[#667085]">Ruangan Induk</dt>
                                    <dd className="mt-1 text-base font-semibold">
                                        <Link
                                            href={`/facilities/${facility.parent_facility.id}`}
                                            className="text-[#2D4C79] hover:underline cursor-pointer"
                                        >
                                            {facility.parent_facility.name} →
                                        </Link>
                                    </dd>
                                </div>
                            )}
                        </dl>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-base font-semibold text-[#111827]">Deskripsi</h2>
                            <p className="mt-2 text-base leading-relaxed text-[#667085]">
                                {facility.description || 'Tidak ada deskripsi tambahan untuk fasilitas ini.'}
                            </p>
                        </div>
                        </div>
                        </div>

                        {/* Peralatan yang berada di dalam ruangan */}
                        {isRoom && (
                            <div className="mt-8 border-t border-[#E5E7EB] pt-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-semibold text-[#111827]">
                                        Peralatan di Ruangan Ini ({facility.child_tools.length})
                                    </h2>
                                </div>

                                {facility.child_tools.length === 0 ? (
                                    <p className="mt-3 text-sm text-[#667085]">
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
                                                                className="text-base font-medium text-[#2D4C79] hover:underline cursor-pointer"
                                                            >
                                                                {tool.name}
                                                            </Link>
                                                            <p className="text-sm text-[#667085]">
                                                                {typeLabels[tool.type] || tool.type}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toolStatus.classes}`}
                                                        >
                                                            <span>{toolStatus.icon}</span>
                                                            <span>{toolStatus.label}</span>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Informasi pemesanan saat ada alat dalam perbaikan */}
                                        <div className="mt-3 rounded-md bg-[#FFF5E6] border border-[#F5D6A6] p-3 text-sm text-[#A15C00]">
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
                                <span className="text-sm font-semibold uppercase tracking-wider text-[#2D4C79]">
                                    Informasi Jadwal
                                </span>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
                                    Cek Ketersediaan Waktu
                                </h2>
                                <p className="mt-1 text-sm text-[#667085]">
                                    Pilih waktu antara 07.00 – 20.00 WIB (slot 30 menit).
                                </p>
                            </div>

                            {/* Date Picker Control & Unified Tambah Hari Dropdown */}
                            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                                {days.length === 1 && (
                                    <div className="relative flex items-center gap-2">
                                        <span id="availability-date-label" className="text-sm font-medium text-[#667085] whitespace-nowrap">
                                            Pilih Tanggal:
                                        </span>
                                        <button
                                            type="button"
                                            aria-haspopup="dialog"
                                            aria-expanded={days[0].isCalendarOpen}
                                            aria-labelledby="availability-date-label availability-date-value"
                                            onClick={() => toggleCalendar(days[0].id)}
                                            className="inline-flex min-w-44 items-center justify-between gap-3 rounded-md border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-[#111827] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/30"
                                        >
                                            <span id="availability-date-value">{displayDateFormatter.format(new Date(`${days[0].date}T00:00:00Z`))}</span>
                                            <span aria-hidden="true" className="text-[#667085]">▾</span>
                                        </button>
                                        {days[0].isCalendarOpen && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => toggleCalendar(days[0].id)} />
                                                <div
                                                    role="dialog"
                                                    aria-label="Pilih tanggal ketersediaan"
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Escape') {
                                                            toggleCalendar(days[0].id);
                                                        }
                                                    }}
                                                    className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white shadow-lg"
                                                >
                                                    <DateCalendarGrid
                                                        value={days[0].date}
                                                        minimumDate={today}
                                                        maximumDate={latestDate}
                                                        onSelect={(date) => handleDayDateChange(days[0].id, date)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Unified Single Tambah Hari Dropdown Button */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        aria-haspopup="dialog"
                                        aria-expanded={isAddDayOpen}
                                        onClick={() => setIsAddDayOpen((prev) => !prev)}
                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#2D4C79] bg-[#2D4C79] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition cursor-pointer"
                                        title="Pilih tanggal untuk menambah hari reservasi"
                                    >
                                        <span aria-hidden="true">+</span> Tambah Hari <span aria-hidden="true" className="text-white/80">▾</span>
                                    </button>
                                    {isAddDayOpen && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setIsAddDayOpen(false)} />
                                            <div
                                                role="dialog"
                                                aria-label="Pilih tanggal untuk menambah hari reservasi"
                                                onKeyDown={(event) => {
                                                    if (event.key === 'Escape') {
                                                        setIsAddDayOpen(false);
                                                    }
                                                }}
                                                className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white shadow-lg"
                                            >
                                                <DateCalendarGrid
                                                    value={today}
                                                    minimumDate={today}
                                                    maximumDate={latestDate}
                                                    onSelect={(date) => handleAddDate(date)}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* List of Days (Single or Multi-Day) */}
                        <div className="mt-6 flex flex-col gap-6">
                            {days.map((day, dayIndex) => (
                                <div
                                    key={day.id}
                                    className={`rounded-lg transition ${
                                        days.length > 1
                                            ? 'border border-[#D0D5DD] bg-[#FAFAFC] p-4 sm:p-5 shadow-sm'
                                            : ''
                                    }`}
                                >
                                    {/* Multi-day Header per day */}
                                    {days.length > 1 && (
                                        <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${day.isExpanded ? 'pb-3 border-b border-[#E5E7EB]' : ''}`}>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center rounded-md bg-[#2D4C79] px-2.5 py-1 text-xs font-bold text-white">
                                                    Hari {dayIndex + 1}
                                                </span>
                                                <span className="text-base font-semibold text-[#111827]">
                                                    {longDateFormatter.format(new Date(`${day.date}T00:00:00Z`))}
                                                </span>
                                                {day.selectedRange !== null && day.availability ? (
                                                    <span className="inline-flex items-center rounded bg-[#EAF7F0] border border-[#B7E2CB] px-2.5 py-0.5 text-xs font-semibold text-[#16794A]">
                                                        ✓ {day.availability.slots[day.selectedRange.start].start_time} - {day.availability.slots[day.selectedRange.end].end_time} ({day.selectedRange.end - day.selectedRange.start + 1} slot)
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-[#98A2B3] italic">
                                                        (Belum ada slot dipilih)
                                                    </span>
                                                )}
                                            </div>

                                            <div className="relative flex items-center gap-2">
                                                {day.isExpanded && (
                                                    <>
                                                        <span className="text-sm font-medium text-[#667085] whitespace-nowrap">
                                                            Ubah Tanggal:
                                                        </span>
                                                        <button
                                                            type="button"
                                                            aria-haspopup="dialog"
                                                            aria-expanded={day.isCalendarOpen}
                                                            onClick={() => toggleCalendar(day.id)}
                                                            className="inline-flex min-w-40 items-center justify-between gap-2 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/30"
                                                        >
                                                            <span>{displayDateFormatter.format(new Date(`${day.date}T00:00:00Z`))}</span>
                                                            <span aria-hidden="true" className="text-[#667085]">▾</span>
                                                        </button>
                                                        {day.isCalendarOpen && (
                                                            <div
                                                                role="dialog"
                                                                aria-label={`Pilih tanggal ketersediaan hari ${dayIndex + 1}`}
                                                                onKeyDown={(event) => {
                                                                    if (event.key === 'Escape') {
                                                                        toggleCalendar(day.id);
                                                                    }
                                                                }}
                                                                className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg bg-white shadow-lg"
                                                            >
                                                                <DateCalendarGrid
                                                                    value={day.date}
                                                                    minimumDate={today}
                                                                    maximumDate={latestDate}
                                                                    onSelect={(date) => handleDayDateChange(day.id, date)}
                                                                />
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {/* Tombol Panah Expand/Collapse |^ */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDayExpanded(day.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#344054] shadow-sm hover:bg-[#F9FAFB] transition cursor-pointer"
                                                    title={day.isExpanded ? "Sembunyikan slot waktu" : "Buka slot waktu untuk melihat/mengubah"}
                                                >
                                                    <span>{day.isExpanded ? 'Tutup Slot' : 'Lihat Slot'}</span>
                                                    <span aria-hidden="true" className="font-mono text-xs font-bold">{day.isExpanded ? '▲' : '▼'}</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveDay(day.id)}
                                                    className="inline-flex items-center gap-1 rounded-md border border-[#F5C6A7] bg-[#FFF0E8] px-2.5 py-1.5 text-sm font-semibold text-[#B54708] hover:bg-[#FDE2D2] transition cursor-pointer"
                                                    title="Hapus hari ini"
                                                >
                                                    ✕ Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Availability Summary Stats & Slot Grid only shown when isExpanded is true */}
                                    {day.isExpanded && (
                                        <>
                                            {day.isLoading ? (
                                                <div className="py-8 text-center text-sm font-medium text-[#667085]">
                                                    <span className="inline-block animate-pulse mr-2">⏳</span> Memuat ketersediaan {day.date}...
                                                </div>
                                            ) : day.availability ? (
                                                <>
                                                    <div className="mt-4 flex flex-wrap items-center gap-3 border-y border-[#E5E7EB] py-3 text-sm">
                                                        <div className="flex items-center gap-1.5 font-medium text-[#16794A]">
                                                            <span className="inline-block h-2 w-2 rounded-full bg-[#16794A]" />
                                                            <span>{day.availability.available_slots_count} Slot Tersedia</span>
                                                        </div>
                                                        <span className="text-[#D0D5DD]">•</span>
                                                        <div className="flex items-center gap-1.5 font-medium text-[#667085]">
                                                            <span className="inline-block h-2 w-2 rounded-full bg-[#98A2B3]" />
                                                            <span>{day.availability.occupied_slots_count} Tidak Tersedia</span>
                                                        </div>
                                                        <span className="text-[#D0D5DD]">•</span>
                                                        <span className="text-[#667085]">Total {day.availability.total_slots} slot (30 mnt/slot)</span>

                                                        {!day.availability.is_reservable && (
                                                            <span className="ml-auto rounded bg-[#FFF0E8] border border-[#F5C6A7] px-2 py-0.5 text-xs font-semibold text-[#B54708]">
                                                                Fasilitas Saat Ini Tidak Dapat Direservasi
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Slot Grid */}
                                                    <div className="mt-5">
                                                        {day.availability.slots.length > 0 ? (
                                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                                                                {day.availability.slots.map((slot, index) => {
                                                                    const isPast = isSlotPast(day.date, slot.start_time);
                                                                    const isSelectable = isSlotSelectable(day, slot);
                                                                    const isSelected =
                                                                        day.selectedRange !== null &&
                                                                        index >= day.selectedRange.start &&
                                                                        index <= day.selectedRange.end;

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
                                                                                onClick={() => handleSlotClick(day.id, index)}
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
                                                                                <span className="text-sm font-bold tracking-tight">
                                                                                    {slot.start_time} - {slot.end_time}
                                                                                </span>
                                                                                <span className={`mt-1 inline-flex items-center text-xs font-semibold uppercase tracking-wider ${isSelected ? 'text-white/90' : ''}`}>
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
                                                                            <span className="text-sm font-bold tracking-tight">
                                                                                {slot.start_time} - {slot.end_time}
                                                                            </span>
                                                                            <span className="mt-1 inline-flex items-center text-xs font-semibold uppercase tracking-wider">
                                                                                {statusBadge}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <p className="text-center text-sm text-[#667085] py-8">
                                                                Tidak ada slot ketersediaan pada tanggal ini.
                                                            </p>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="py-8 text-center text-sm text-[#B54708]">
                                                    Gagal memuat ketersediaan untuk tanggal ini.{' '}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDayDateChange(day.id, day.date)}
                                                        className="underline font-semibold cursor-pointer"
                                                    >
                                                        Coba lagi
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* CTA / Summary Pilihan Slot */}
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-[#E5E7EB] pt-5">
                            <div>
                                {selectedDays.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-bold text-[#111827]">
                                                Total Pilihan: {totalSelectedSlots} slot ({selectedDays.length} hari)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setIsResetConfirmOpen(true)}
                                                className="text-sm text-[#B54708] hover:underline cursor-pointer"
                                            >
                                                Reset semua pilihan
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {selectedDays.map((d) => {
                                                const startStr = d.availability!.slots[d.selectedRange!.start].start_time;
                                                const endStr = d.availability!.slots[d.selectedRange!.end].end_time;
                                                const count = d.selectedRange!.end - d.selectedRange!.start + 1;
                                                return (
                                                    <span
                                                        key={d.id}
                                                        className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-[#F9FAFB] px-2.5 py-1 text-xs text-[#344054]"
                                                    >
                                                        <span className="font-semibold text-[#2D4C79]">{d.date}:</span>
                                                        <span>{startStr} - {endStr}</span>
                                                        <span className="rounded bg-[#E9EEF5] px-1.5 py-0.2 text-[11px] font-bold text-[#2D4C79]">
                                                            {count} slot
                                                        </span>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-sm text-[#667085]">
                                        Belum ada slot waktu yang dipilih. Klik slot di atas untuk memilih.
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {totalSelectedSlots > 0 ? (
                                    <Link
                                        href={`/reservations/create?facility_id=${facility.id}&start_time=${selectedDays[0].date}T${selectedDays[0].availability!.slots[selectedDays[0].selectedRange!.start].start_time}&end_time=${selectedDays[selectedDays.length - 1].date}T${selectedDays[selectedDays.length - 1].availability!.slots[selectedDays[selectedDays.length - 1].selectedRange!.end].end_time}&schedules=${encodeURIComponent(
                                            JSON.stringify(
                                                selectedDays.map((d) => ({
                                                    date: d.date,
                                                    start_time: d.availability!.slots[d.selectedRange!.start].start_time,
                                                    end_time: d.availability!.slots[d.selectedRange!.end].end_time,
                                                    slots_count: d.selectedRange!.end - d.selectedRange!.start + 1,
                                                }))
                                            )
                                        )}`}
                                        onClick={savePendingReservationCookie}
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-[#2D4C79] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                    >
                                        Ajukan Reservasi ({totalSelectedSlots} slot • {selectedDays.length} hari)
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-md bg-[#E5E7EB] px-5 text-sm font-semibold text-[#98A2B3]"
                                    >
                                        Pilih Slot Waktu
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <ConfirmDialog
                    open={isResetConfirmOpen}
                    onOpenChange={setIsResetConfirmOpen}
                    title="Reset Pilihan Jadwal"
                    description="Apakah Anda yakin ingin menghapus semua slot jadwal yang telah Anda pilih untuk fasilitas ini?"
                    confirmText="Ya, Reset Pilihan"
                    variant="destructive"
                    onConfirm={() => {
                        handleResetAll();
                        setIsResetConfirmOpen(false);
                    }}
                />
            </div>
        </>
    );
}
