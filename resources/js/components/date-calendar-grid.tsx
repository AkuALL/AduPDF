import { useEffect, useState } from 'react';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
const monthFormatter = new Intl.DateTimeFormat('id-ID', { timeZone: 'UTC', month: 'long' });
const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type Props = {
    value: string;
    minimumDate: string;
    maximumDate: string;
    onSelect: (date: string) => void;
};

export default function DateCalendarGrid({ value, minimumDate, maximumDate, onSelect }: Props) {
    const firstYear = Number(minimumDate.slice(0, 4));
    const firstMonth = Number(minimumDate.slice(5, 7));
    const [lastYear, lastMonth] = maximumDate.slice(0, 7).split('-').map(Number);
    const months = Array.from({ length: (lastYear - firstYear) * 12 + lastMonth - firstMonth + 1 }, (_, index) => {
        const date = new Date(Date.UTC(firstYear, firstMonth - 1 + index, 1));

        return {
            value: date.toISOString().slice(0, 7),
            year: date.getUTCFullYear(),
            label: monthFormatter.format(date),
        };
    });
    const years = [...new Set(months.map(({ year }) => year))];
    const [visibleMonth, setVisibleMonth] = useState(() => (
        value >= minimumDate && value <= maximumDate ? value.slice(0, 7) : minimumDate.slice(0, 7)
    ));
    const [visibleYear, visibleMonthNumber] = visibleMonth.split('-').map(Number);
    const firstCalendarDay = new Date(`${visibleMonth}-01T00:00:00Z`);
    const firstWeekday = firstCalendarDay.getUTCDay();
    const daysInMonth = new Date(Date.UTC(visibleYear, visibleMonthNumber, 0)).getUTCDate();
    const calendarCells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
        if (index < firstWeekday) {
            return null;
        }

        const date = `${visibleMonth}-${String(index - firstWeekday + 1).padStart(2, '0')}`;

        return date < minimumDate ? null : date;
    });

    useEffect(() => {
        if (visibleMonth < minimumDate.slice(0, 7)) {
            setVisibleMonth(minimumDate.slice(0, 7));
        } else if (visibleMonth > maximumDate.slice(0, 7)) {
            setVisibleMonth(maximumDate.slice(0, 7));
        }
    }, [maximumDate, minimumDate, visibleMonth]);

    return (
        <div className="rounded-md border border-[#D0D5DD] bg-white p-3">
            <div className="flex gap-2">
                <select
                    aria-label="Bulan"
                    value={visibleMonth}
                    onChange={(event) => setVisibleMonth(event.currentTarget.value)}
                    className="min-w-0 flex-1 rounded-md border border-[#D0D5DD] bg-white px-2 py-2 text-sm focus-visible:border-[#2D4C79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20"
                >
                    {months.filter(({ year }) => year === visibleYear).map(({ value: month, label }) => (
                        <option key={month} value={month}>{label}</option>
                    ))}
                </select>
                <select
                    aria-label="Tahun"
                    value={visibleYear}
                    onChange={(event) => setVisibleMonth(months.find(({ year }) => year === Number(event.currentTarget.value))?.value ?? visibleMonth)}
                    className="rounded-md border border-[#D0D5DD] bg-white px-2 py-2 text-sm focus-visible:border-[#2D4C79] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20"
                >
                    {years.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#667085]">
                {weekdays.map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
                {calendarCells.map((date, index) => {
                    if (!date) {
                        return <span key={`empty-${index}`} aria-hidden="true" />;
                    }

                    const isDisabled = date > maximumDate;
                    const isSelected = value === date;

                    return (
                        <button
                            key={date}
                            type="button"
                            disabled={isDisabled}
                            aria-label={dateFormatter.format(new Date(`${date}T00:00:00Z`))}
                            aria-pressed={isSelected}
                            onClick={() => onSelect(date)}
                            className={`h-9 rounded-md text-sm transition-colors ${isSelected ? 'bg-[#2D4C79] font-semibold text-white' : isDisabled ? 'cursor-not-allowed bg-[#F3F5F7] text-[#98A2B3]' : 'text-[#111827] hover:bg-[#EAF0F7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/30'} ${date === minimumDate && !isSelected ? 'ring-1 ring-[#2D4C79]' : ''}`}
                        >
                            {Number(date.slice(-2))}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
