import { useMemo, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { exportSvgToPng } from '@/lib/chart-exporter';

export type LocationDamagePoint = {
    location: string;
    total_reports: number;
};

type Props = {
    data: LocationDamagePoint[];
};

export default function MatplotlibVerticalBarChart({ data }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const width = 760;
    const height = 270;
    const padding = { top: 35, right: 35, bottom: 65, left: 55 };

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const { maxReports, yTicks } = useMemo(() => {
        const rawMax = Math.max(...data.map((d) => d.total_reports), 1);
        const calcMax = Math.max(4, Math.ceil(rawMax));
        const step = Math.ceil(calcMax / 4);
        const adjustedMax = step * 4;
        const ticks = [0, step, step * 2, step * 3, adjustedMax];
        return { maxReports: adjustedMax, yTicks: ticks };
    }, [data]);

    const colWidth = plotWidth / (data.length || 1);
    const barWidth = Math.min(42, Math.max(18, colWidth * 0.45));

    const getBarHeight = (reports: number) => {
        return (reports / (maxReports || 1)) * plotHeight;
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                    <h3 className="text-sm font-bold text-slate-800">
                        Distribusi Insiden Kerusakan per Lokasi Kampus
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Sumbu Y: Frekuensi Laporan Gangguan · Sumbu X: Gedung / Kawasan Kampus
                    </p>
                </div>

                {/* Plotly-style Snapshot Button */}
                <button
                    type="button"
                    onClick={() => exportSvgToPng(svgRef.current, 'distribusi-insiden-lokasi')}
                    title="Unduh Snapshot Gambar (PNG)"
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
                >
                    <Camera className="size-3.5 text-slate-500" />
                    <span>Simpan Plot</span>
                </button>
            </div>

            {/* SVG Canvas */}
            <div className="relative w-full">
                {data.length === 0 ? (
                    <div className="flex h-56 flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center">
                        <p className="font-mono text-xs font-semibold text-slate-600">
                            Data insiden kerusakan masih kosong (0 laporan).
                        </p>
                        <p className="font-mono text-[11px] text-slate-400 mt-1">
                            Seluruh infrastruktur dan fasilitas kampus dalam kondisi prima.
                        </p>
                    </div>
                ) : (
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-auto select-none"
                    >
                        {/* Plotting area box (axes frame) */}
                        <rect
                            x={padding.left}
                            y={padding.top}
                            width={plotWidth}
                            height={plotHeight}
                            fill="#FCFCFD"
                            stroke="#475569"
                            strokeWidth="1.2"
                        />

                        {/* Horizontal Gridlines & Y Ticks */}
                        {yTicks.map((tickVal) => {
                            const y = padding.top + plotHeight - (tickVal / (maxReports || 1)) * plotHeight;
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
                                    {/* Left tick mark */}
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
                                        {tickVal}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Y Axis Label (Rotated) */}
                        <text
                            transform={`rotate(-90) translate(-${padding.top + plotHeight / 2}, 16)`}
                            textAnchor="middle"
                            className="font-mono text-[10px] font-semibold fill-slate-700"
                        >
                            Frekuensi Laporan Insiden
                        </text>

                        {/* Bars and X Ticks */}
                        {data.map((item, index) => {
                            const xCenter = padding.left + index * colWidth + colWidth / 2;
                            const xBar = xCenter - barWidth / 2;
                            const bHeight = Math.max(2, getBarHeight(item.total_reports));
                            const yBar = padding.top + plotHeight - bHeight;
                            const isHovered = hoveredIndex === index;

                            return (
                                <g
                                    key={item.location}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="cursor-pointer transition"
                                >
                                    {/* Bottom X Tick Mark */}
                                    <line
                                        x1={xCenter}
                                        y1={padding.top + plotHeight}
                                        x2={xCenter}
                                        y2={padding.top + plotHeight + 4}
                                        stroke="#475569"
                                        strokeWidth="1.2"
                                    />

                                    {/* Bar Rectangle */}
                                    <rect
                                        x={xBar}
                                        y={yBar}
                                        width={barWidth}
                                        height={bHeight}
                                        fill="#E11D48"
                                        stroke="#881337"
                                        strokeWidth="1.2"
                                        rx="1"
                                        className="transition-all duration-150"
                                        opacity={hoveredIndex !== null && !isHovered ? 0.6 : 1}
                                    />

                                    {/* Value label on top of bar */}
                                    <text
                                        x={xCenter}
                                        y={yBar - 5}
                                        textAnchor="middle"
                                        className="font-mono text-[10px] font-bold fill-rose-900"
                                    >
                                        {item.total_reports}
                                    </text>

                                    {/* X Axis Label (Location Name with truncation) */}
                                    <text
                                        x={xCenter}
                                        y={padding.top + plotHeight + 16}
                                        textAnchor="middle"
                                        className={`font-mono text-[10px] ${
                                            isHovered ? 'fill-rose-700 font-bold' : 'fill-slate-700'
                                        }`}
                                    >
                                        {item.location.length > 14
                                            ? `${item.location.slice(0, 12)}…`
                                            : item.location}
                                    </text>
                                </g>
                            );
                        })}

                        {/* X Axis General Label */}
                        <text
                            x={padding.left + plotWidth / 2}
                            y={height - 8}
                            textAnchor="middle"
                            className="font-mono text-[10px] font-semibold fill-slate-700"
                        >
                            Lokasi / Kawasan Gedung Kampus
                        </text>
                    </svg>
                )}
            </div>
        </div>
    );
}
