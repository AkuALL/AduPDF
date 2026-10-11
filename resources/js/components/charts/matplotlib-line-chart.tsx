import { useMemo, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { exportSvgToPng } from '@/lib/chart-exporter';

export type DailyTrendPoint = {
    day: number;
    label: string;
    reservations_count: number;
    total_hours: number;
};

type Props = {
    data: DailyTrendPoint[];
    monthLabel: string;
};

export default function MatplotlibLineChart({ data, monthLabel }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [showHours, setShowHours] = useState(true);
    const [showCount, setShowCount] = useState(true);

    // Dimension setup (standard 16:7 matplotlib figure aspect ratio)
    const width = 760;
    const height = 300;
    const padding = { top: 35, right: 35, bottom: 50, left: 60 };

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Calculate Y scales dynamically based on active series
    const { maxHours, yTicks, xTickIndices } = useMemo(() => {
        const activeHours = showHours ? data.map((d) => d.total_hours) : [0];
        const activeCounts = showCount ? data.map((d) => d.reservations_count) : [0];
        const rawMax = Math.max(...activeHours, ...activeCounts, 1);

        // Round up to clean step
        const step = rawMax <= 5 ? 1 : rawMax <= 15 ? 2.5 : rawMax <= 30 ? 5 : 10;
        const calculatedMax = Math.max(step * 4, Math.ceil(rawMax / step) * step);

        const ticks = [
            0,
            calculatedMax * 0.25,
            calculatedMax * 0.5,
            calculatedMax * 0.75,
            calculatedMax,
        ];

        // X ticks: pick days like 1, 5, 10, 15, 20, 25, 30
        const tickIndices: number[] = [];
        data.forEach((d, idx) => {
            if (d.day === 1 || d.day % 5 === 0 || idx === data.length - 1) {
                tickIndices.push(idx);
            }
        });

        return { maxHours: calculatedMax, yTicks: ticks, xTickIndices: tickIndices };
    }, [data, showHours, showCount]);

    const getX = (index: number) => {
        if (data.length <= 1) return padding.left + plotWidth / 2;
        return padding.left + (index / (data.length - 1)) * plotWidth;
    };

    const getYHours = (val: number) => {
        return padding.top + plotHeight - (val / (maxHours || 1)) * plotHeight;
    };

    // Build SVG path for total_hours line
    const hoursPath = useMemo(() => {
        if (data.length === 0 || !showHours) return '';
        return data.reduce((acc, point, index) => {
            const x = getX(index);
            const y = getYHours(point.total_hours);
            return `${acc} ${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }, '');
    }, [data, maxHours, showHours]);

    // Build SVG path for reservations count line
    const countPath = useMemo(() => {
        if (data.length === 0 || !showCount) return '';
        return data.reduce((acc, point, index) => {
            const x = getX(index);
            const y = getYHours(point.reservations_count);
            return `${acc} ${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }, '');
    }, [data, maxHours, showCount]);

    // Handle mouse move for crosshair & tooltip
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const normalizedX = (clientX / rect.width) * width;

        if (normalizedX < padding.left || normalizedX > padding.left + plotWidth) {
            setHoverIndex(null);
            return;
        }

        const relativePlotX = normalizedX - padding.left;
        const closestIndex = Math.min(
            data.length - 1,
            Math.max(0, Math.round((relativePlotX / plotWidth) * (data.length - 1)))
        );

        setHoverIndex(closestIndex);
    };

    const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header / Figure Title + Plotly Toolbar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                    <h3 className="text-base font-bold text-slate-800">
                        Tren Okupansi Fasilitas Harian ({monthLabel})
                    </h3>
                </div>

                {/* Plotly-style Snapshot Button */}
                <button
                    type="button"
                    onClick={() => exportSvgToPng(svgRef.current, `tren-okupansi-${monthLabel}`)}
                    title="Unduh Snapshot Gambar (PNG)"
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
                >
                    <Camera className="size-3.5 text-slate-500" />
                    <span>Simpan Plot</span>
                </button>
            </div>

            {/* SVG Chart Canvas */}
            <div className="relative w-full">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-auto select-none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    {/* Background plotting area */}
                    <rect
                        x={padding.left}
                        y={padding.top}
                        width={plotWidth}
                        height={plotHeight}
                        fill="#FCFCFD"
                        stroke="#475569"
                        strokeWidth="1.2"
                    />

                    {/* Horizontal Gridlines (Matplotlib dashed style) */}
                    {yTicks.map((tickVal) => {
                        const y = getYHours(tickVal);
                        return (
                            <g key={tickVal}>
                                <line
                                    x1={padding.left}
                                    y1={y}
                                    x2={padding.left + plotWidth}
                                    y2={y}
                                    stroke="#E2E8F0"
                                    strokeDasharray="3 3"
                                    strokeWidth="1"
                                />
                                {/* Y Tick Mark */}
                                <line
                                    x1={padding.left - 4}
                                    y1={y}
                                    x2={padding.left}
                                    y2={y}
                                    stroke="#475569"
                                    strokeWidth="1.2"
                                />
                                {/* Y Tick Label */}
                                <text
                                    x={padding.left - 8}
                                    y={y + 3.5}
                                    textAnchor="end"
                                    className="font-mono text-[10px] fill-slate-600"
                                >
                                    {tickVal % 1 === 0 ? tickVal : tickVal.toFixed(1)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Vertical Gridlines & X Ticks */}
                    {xTickIndices.map((idx) => {
                        const pt = data[idx];
                        if (!pt) return null;
                        const x = getX(idx);
                        return (
                            <g key={idx}>
                                <line
                                    x1={x}
                                    y1={padding.top}
                                    x2={x}
                                    y2={padding.top + plotHeight}
                                    stroke="#F1F5F9"
                                    strokeDasharray="2 2"
                                    strokeWidth="0.8"
                                />
                                {/* X Tick Mark */}
                                <line
                                    x1={x}
                                    y1={padding.top + plotHeight}
                                    x2={x}
                                    y2={padding.top + plotHeight + 4}
                                    stroke="#475569"
                                    strokeWidth="1.2"
                                />
                                {/* X Tick Label */}
                                <text
                                    x={x}
                                    y={padding.top + plotHeight + 16}
                                    textAnchor="middle"
                                    className="font-mono text-[10px] fill-slate-600"
                                >
                                    {pt.day}
                                </text>
                            </g>
                        );
                    })}

                    {/* X Axis Label */}
                    <text
                        x={padding.left + plotWidth / 2}
                        y={height - 8}
                        textAnchor="middle"
                        className="font-mono text-[10px] font-semibold fill-slate-700"
                    >
                        Hari (Tanggal 1 — {data.length})
                    </text>

                    {/* Y Axis Label (Rotated) */}
                    <text
                        transform={`rotate(-90) translate(-${padding.top + plotHeight / 2}, 16)`}
                        textAnchor="middle"
                        className="font-mono text-[10px] font-semibold fill-slate-700"
                    >
                        Total Durasi (Jam) / Frekuensi
                    </text>

                    {/* Plot Line 1: Total Hours (Navy #2D4C79 with markers) */}
                    {showHours && (
                        <>
                            <path
                                d={hoursPath}
                                fill="none"
                                stroke="#2D4C79"
                                strokeWidth="2.2"
                                strokeLinejoin="round"
                            />
                            {data.map((point, index) => {
                                const x = getX(index);
                                const y = getYHours(point.total_hours);
                                return (
                                    <circle
                                        key={`h-${index}`}
                                        cx={x}
                                        cy={y}
                                        r={point.total_hours > 0 ? 3.5 : 2}
                                        fill={point.total_hours > 0 ? '#2D4C79' : '#94A3B8'}
                                        stroke="#FFFFFF"
                                        strokeWidth="1"
                                    />
                                );
                            })}
                        </>
                    )}

                    {/* Plot Line 2: Reservations Count (Emerald #16A34A with markers) */}
                    {showCount && (
                        <>
                            <path
                                d={countPath}
                                fill="none"
                                stroke="#16A34A"
                                strokeWidth="1.8"
                                strokeDasharray="5 3"
                                strokeLinejoin="round"
                            />
                            {data.map((point, index) => {
                                const x = getX(index);
                                const y = getYHours(point.reservations_count);
                                return (
                                    <circle
                                        key={`c-${index}`}
                                        cx={x}
                                        cy={y}
                                        r={point.reservations_count > 0 ? 3 : 1.5}
                                        fill={point.reservations_count > 0 ? '#16A34A' : '#CBD5E1'}
                                        stroke="#FFFFFF"
                                        strokeWidth="0.8"
                                    />
                                );
                            })}
                        </>
                    )}

                    {/* Matplotlib Legend Box with Plotly Toggle Functionality */}
                    <g transform={`translate(${padding.left + plotWidth - 170}, ${padding.top + 10})`}>
                        <rect
                            x="0"
                            y="0"
                            width="160"
                            height="50"
                            fill="#FFFFFF"
                            fillOpacity="0.95"
                            stroke="#CBD5E1"
                            strokeWidth="1"
                            rx="2"
                        />
                        {/* Legend item 1: Durasi Jam (Clickable) */}
                        <g
                            onClick={() => setShowHours(!showHours)}
                            className="cursor-pointer"
                            opacity={showHours ? 1 : 0.35}
                        >
                            <line x1="12" y1="16" x2="32" y2="16" stroke="#2D4C79" strokeWidth="2.2" />
                            <circle cx="22" cy="16" r="3" fill="#2D4C79" stroke="#FFF" strokeWidth="0.8" />
                            <text
                                x="38"
                                y="19"
                                className={`font-mono text-[10px] select-none ${
                                    showHours ? 'fill-slate-800 font-medium' : 'fill-slate-400 line-through'
                                }`}
                            >
                                Durasi (Jam)
                            </text>
                        </g>

                        {/* Legend item 2: Frekuensi Reservasi (Clickable) */}
                        <g
                            onClick={() => setShowCount(!showCount)}
                            className="cursor-pointer"
                            opacity={showCount ? 1 : 0.35}
                        >
                            <line
                                x1="12"
                                y1="34"
                                x2="32"
                                y2="34"
                                stroke="#16A34A"
                                strokeWidth="1.8"
                                strokeDasharray="4 2"
                            />
                            <circle cx="22" cy="34" r="2.5" fill="#16A34A" stroke="#FFF" strokeWidth="0.8" />
                            <text
                                x="38"
                                y="37"
                                className={`font-mono text-[10px] select-none ${
                                    showCount ? 'fill-slate-800 font-medium' : 'fill-slate-400 line-through'
                                }`}
                            >
                                Jumlah Reservasi
                            </text>
                        </g>
                    </g>

                    {/* Crosshair Guideline on Hover */}
                    {hoverIndex !== null && (
                        <g>
                            <line
                                x1={getX(hoverIndex)}
                                y1={padding.top}
                                x2={getX(hoverIndex)}
                                y2={padding.top + plotHeight}
                                stroke="#64748B"
                                strokeDasharray="3 3"
                                strokeWidth="1"
                            />
                            {showHours && (
                                <circle
                                    cx={getX(hoverIndex)}
                                    cy={getYHours(data[hoverIndex].total_hours)}
                                    r="5.5"
                                    fill="#2D4C79"
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                />
                            )}
                            {showCount && (
                                <circle
                                    cx={getX(hoverIndex)}
                                    cy={getYHours(data[hoverIndex].reservations_count)}
                                    r="4.5"
                                    fill="#16A34A"
                                    stroke="#FFFFFF"
                                    strokeWidth="2"
                                />
                            )}
                        </g>
                    )}
                </svg>

                {/* Tooltip Card (positioned dynamically) */}
                {hoverIndex !== null && activePoint && (
                    <div
                        className="pointer-events-none absolute top-2 rounded border border-slate-700 bg-slate-900/95 px-3 py-1.5 text-sm text-white shadow-md font-mono"
                        style={{
                            left: `${Math.min(
                                85,
                                Math.max(15, (getX(hoverIndex) / width) * 100)
                            )}%`,
                            transform: 'translateX(-50%)',
                        }}
                    >
                        <div className="font-bold text-amber-300">
                            {activePoint.label} (Hari {activePoint.day})
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs">
                            {showHours && (
                                <span className="text-sky-300">
                                    ● Durasi: <strong>{activePoint.total_hours} Jam</strong>
                                </span>
                            )}
                            {showCount && (
                                <span className="text-emerald-300">
                                    ■ Reservasi: <strong>{activePoint.reservations_count}x</strong>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
