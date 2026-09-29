import { Form, Head, Link } from '@inertiajs/react';
import { store as storeReservation } from '@/actions/App/Http/Controllers/ReservationController';
import DateCalendarGrid from '@/components/date-calendar-grid';
import { useEffect, useState } from 'react';

const wibDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

const reservationDateFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const timeOptions = Array.from({ length: 27 }, (_, index) => {
    const minutes = 7 * 60 + index * 30;

    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
});
const startTimeOptions = timeOptions.slice(0, -1);

function currentWibDateTime(reference: Date = new Date()): { date: string; time: string } {
    const parts = Object.fromEntries(wibDateTimeFormatter.formatToParts(reference).map(({ type, value }) => [type, value])) as Record<string, string>;

    return {
        date: `${parts.year}-${parts.month}-${parts.day}`,
        time: `${parts.hour}:${parts.minute}`,
    };
}

function nextWibSlot(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const nextMinutes = Math.max(7 * 60, (Math.floor((hour * 60 + minute) / 30) + 1) * 30);

    return `${String(Math.floor(nextMinutes / 60)).padStart(2, '0')}:${String(nextMinutes % 60).padStart(2, '0')}`;
}

type Props = {
    facility: { id: number; name: string; location: string };
    reservable: boolean;
    success: string | null;
    server_now: string;
};

export default function CreateReservation({ facility, reservable, success, server_now }: Props) {
    const serverTimestamp = new Date(server_now).getTime();
    const [currentWib, setCurrentWib] = useState(() => currentWibDateTime(new Date(serverTimestamp)));
    const minimumStartTime = nextWibSlot(currentWib.time);
    const todayUnavailable = minimumStartTime > '19:30';
    const firstReservableDateValue = new Date(`${currentWib.date}T00:00:00Z`);
    if (todayUnavailable) {
        firstReservableDateValue.setUTCDate(firstReservableDateValue.getUTCDate() + 1);
    }
    const firstReservableDate = firstReservableDateValue.toISOString().slice(0, 10);
    const latestDateValue = new Date(`${currentWib.date}T00:00:00Z`);
    latestDateValue.setUTCDate(latestDateValue.getUTCDate() + 90);
    const latestDate = latestDateValue.toISOString().slice(0, 10);
    const [currentHour, currentMinute] = currentWib.time.split(':').map(Number);
    const currentMinutes = currentHour * 60 + currentMinute;
    const latestStartMinutes = Math.floor(currentMinutes / 30) * 30;
    const latestStartTime = `${String(Math.floor(latestStartMinutes / 60)).padStart(2, '0')}:${String(latestStartMinutes % 60).padStart(2, '0')}`;
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const requestedStart = params?.get('start_time') ?? '';
    const requestedEnd = params?.get('end_time') ?? '';
    const requestedDate = requestedStart.slice(0, 10);
    const requestedStartTime = requestedStart.slice(11, 16);
    const requestedEndTime = requestedEnd.slice(11, 16);
    const initialDateIsValid = requestedDate >= firstReservableDate && requestedDate <= latestDate;
    const initialStartIsValid = initialDateIsValid
        && startTimeOptions.includes(requestedStartTime)
        && (requestedDate !== currentWib.date || requestedStartTime >= minimumStartTime)
        && (requestedDate !== latestDate || requestedStartTime <= latestStartTime);
    const initialEndIsValid = initialStartIsValid
        && requestedEnd.slice(0, 10) === requestedDate
        && timeOptions.includes(requestedEndTime)
        && requestedEndTime > requestedStartTime;
    const [selectedDate, setSelectedDate] = useState(initialDateIsValid ? requestedDate : '');
    const [startTime, setStartTime] = useState(initialStartIsValid ? requestedStartTime : '');
    const [endTime, setEndTime] = useState(initialEndIsValid ? requestedEndTime : '');
    const noCurrentDaySlots = selectedDate === currentWib.date && todayUnavailable;
    const startTimeError = noCurrentDaySlots
        ? 'Tanggal ini tidak tersedia karena jam operasional sudah berakhir. Pilih tanggal lain.'
        : !startTime
        ? ''
        : !startTimeOptions.includes(startTime)
            ? 'Jam mulai harus antara 07:00–19:30 WIB dengan interval 30 menit.'
            : selectedDate === currentWib.date && startTime < minimumStartTime
                ? `Jam mulai harus setelah ${minimumStartTime} WIB.`
                : selectedDate === latestDate && startTime > latestStartTime
                    ? `Jam mulai paling lambat ${latestStartTime} WIB.`
                    : '';
    const endTimeError = !endTime
        ? ''
        : !timeOptions.includes(endTime)
            ? 'Jam selesai harus antara 07:30–20:00 WIB dengan interval 30 menit.'
            : !startTime || endTime <= startTime
                ? 'Jam selesai harus setelah jam mulai.'
                : '';

    useEffect(() => {
        const serverClockOffset = serverTimestamp - Date.now();
        const interval = window.setInterval(() => {
            setCurrentWib(currentWibDateTime(new Date(Date.now() + serverClockOffset)));
        }, 30_000);

        return () => window.clearInterval(interval);
    }, [serverTimestamp]);

    useEffect(() => {
        if (selectedDate && (selectedDate < firstReservableDate || selectedDate > latestDate)) {
            setSelectedDate('');
            setStartTime('');
            setEndTime('');
        }
    }, [firstReservableDate, latestDate, selectedDate]);

    return (
        <>
            <Head title="Ajukan Reservasi" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-10 text-[#111827]">
                <div className="w-full">
                    <Link href={`/facilities/${facility.id}`} className="text-sm font-medium text-[#2D4C79] hover:underline">
                        <span aria-hidden="true">←</span> Kembali
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold">Ajukan reservasi</h1>
                    <p className="mt-2 text-sm text-[#667085]">{facility.name} · {facility.location}</p>
                    {success && <p role="status" className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">{success}</p>}
                    {!reservable && <p role="alert" className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Fasilitas ini sedang tidak dapat direservasi.</p>}

                    <Form {...storeReservation.form()} resetOnSuccess onSuccess={() => { setSelectedDate(''); setStartTime(''); setEndTime(''); }} className="mt-6 space-y-5 rounded-lg border border-[#E5E7EB] bg-white p-6">
                        {({ errors, processing }) => (
                            <>
                                <input type="hidden" name="facility_id" value={facility.id} />
                                <input type="hidden" name="start_time" value={selectedDate && startTime ? `${selectedDate}T${startTime}` : ''} />
                                <input type="hidden" name="end_time" value={selectedDate && endTime ? `${selectedDate}T${endTime}` : ''} />
                                {errors.facility_id && <p role="alert" className="text-sm text-red-700">{errors.facility_id}</p>}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <fieldset className="min-w-0" aria-describedby="reservation_date_hint" aria-invalid={!!errors.start_time}>
                                        <legend className="text-sm font-medium">Tanggal</legend>
                                        <DateCalendarGrid
                                            value={selectedDate}
                                            minimumDate={firstReservableDate}
                                            maximumDate={latestDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setStartTime('');
                                                setEndTime('');
                                            }}
                                        />
                                        <p id="reservation_date_hint" className="mt-1 text-xs text-[#667085]">
                                            {todayUnavailable ? 'Hari ini tidak tersedia karena jam operasional sudah berakhir.' : 'Tanggal lampau berwarna abu-abu dan tidak dapat dipilih.'}
                                        </p>
                                    </fieldset>
                                    <div>
                                        <label htmlFor="start_time_select" className="block text-sm font-medium">Mulai (WIB)</label>
                                        <input
                                            id="start_time_select"
                                            type="time"
                                            value={startTime}
                                            required
                                            disabled={!selectedDate || noCurrentDaySlots}
                                            min={selectedDate === currentWib.date && !noCurrentDaySlots ? minimumStartTime : '07:00'}
                                            max={selectedDate === latestDate && latestStartTime < '19:30' ? latestStartTime : '19:30'}
                                            step={1800}
                                            onChange={(event) => {
                                                setStartTime(event.currentTarget.value);
                                                setEndTime('');
                                            }}
                                            aria-invalid={!!errors.start_time || !!startTimeError}
                                            aria-describedby={startTimeError ? 'start_time_client_error' : undefined}
                                            className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 focus-visible:border-[#2D4C79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 disabled:cursor-not-allowed disabled:bg-[#F3F5F7] disabled:text-[#98A2B3]"
                                        />
                                        {startTimeError && <p id="start_time_client_error" role="alert" className="mt-1 text-sm text-red-700">{startTimeError}</p>}
                                        {errors.start_time && <p role="alert" className="mt-1 text-sm text-red-700">{errors.start_time}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="end_time_select" className="block text-sm font-medium">Selesai (WIB)</label>
                                        <input
                                            id="end_time_select"
                                            type="time"
                                            value={endTime}
                                            required
                                            disabled={!selectedDate || !startTime}
                                            min={startTime ? nextWibSlot(startTime) : '07:30'}
                                            max="20:00"
                                            step={1800}
                                            onChange={(event) => setEndTime(event.currentTarget.value)}
                                            aria-invalid={!!errors.end_time || !!endTimeError}
                                            aria-describedby={endTimeError ? 'end_time_client_error' : undefined}
                                            className="mt-1 w-full rounded-md border border-[#D0D5DD] bg-white px-3 py-2 focus-visible:border-[#2D4C79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20 disabled:cursor-not-allowed disabled:bg-[#F3F5F7] disabled:text-[#98A2B3]"
                                        />
                                        {endTimeError && <p id="end_time_client_error" role="alert" className="mt-1 text-sm text-red-700">{endTimeError}</p>}
                                        {errors.end_time && <p role="alert" className="mt-1 text-sm text-red-700">{errors.end_time}</p>}
                                    </div>
                                </div>
                                {selectedDate && startTime && endTime && (
                                    <p role="status" className="rounded-md bg-[#F3F5F7] px-3 py-2 text-sm text-[#344054]">
                                        Jadwal dipilih: {reservationDateFormatter.format(new Date(`${selectedDate}T00:00:00Z`))}, {startTime}–{endTime} WIB
                                    </p>
                                )}
                                <div>
                                    <label htmlFor="tujuan" className="block text-sm font-medium">Tujuan penggunaan</label>
                                    <textarea id="tujuan" name="tujuan" required maxLength={5000} rows={4} aria-invalid={!!errors.tujuan} className="mt-1 w-full rounded-md border border-[#D0D5DD] px-3 py-2" />
                                    {errors.tujuan && <p role="alert" className="mt-1 text-sm text-red-700">{errors.tujuan}</p>}
                                </div>
                                <p className="text-sm text-[#667085]">Jam operasional 07:00–20:00 WIB, dalam slot 30 menit. Waktu yang sudah lewat tidak dapat dipilih. Pengajuan menunggu persetujuan Petugas.</p>
                                <button type="submit" disabled={processing || !reservable || !selectedDate || !startTime || !endTime || !!startTimeError || !!endTimeError} className="rounded-md bg-[#2D4C79] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
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
