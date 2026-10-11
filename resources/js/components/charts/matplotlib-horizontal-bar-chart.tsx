import { useMemo, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { exportSvgToPng } from '@/lib/chart-exporter';

export type CategoryUsage = {
    type: string;
    label: string;
    total_hours: number;
    total_reservations: number;
};

type Props = {
    data: CategoryUsage[];
    monthLabel: string;
};

const BAR_COLORS: Record<string, { fill: string; stroke: string }> = {
    ruang_kelas: { fill: '#2D4C79', stroke: '#1B3152' },
    laboratorium: { fill: '#0284C7', stroke: '#0369A1' },
    aula: { fill: '#4F46E5', stroke: '#3730A3' },
    lapangan: { fill: '#16A34A', stroke: '#15803D' },
    alat: { fill: '#D97706', stroke: '#B45309' },
};

export default function MatplotlibHorizontalBarChart({ data, monthLabel }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoveredType, setHoveredType] = useState<string | null>(null);

    const width = 760;
    const height = 270;
    const padding = { top: 35, right: 120, bottom: 45, left: 110 };

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const { maxHours, xTicks } = useMemo(() => {
        const rawMax = Math.max(...data.map((d) => d.total_hours), 1);
        const step = rawMax <= 5 ? 1 : rawMax <= 20 ? 5 : rawMax <= 50 ? 10 : 25;
        const calcMax = Math.max(step * 4, Math.ceil(rawMax / step) * step);
        const ticks = [0, calcMax * 0.25, calcMax * 0.5, calcMax * 0.75, calcMax];
        return { maxHours: calcMax, xTicks: ticks };
    }, [data]);

    const rowHeight = plotHeight / (data.length || 1);
    const barHeight = Math.min(22, rowHeight * 0.55);

    const getBarWidth = (hours: number) => {
        return (hours / (maxHours || 1)) * plotWidth;
    };

    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                    <h3 className="text-base font-bold text-slate-800">
                        Distribusi Durasi Pemakaian per Kategori ({monthLabel})
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={() => exportSvgToPng(svgRef.current, `utilisasi-kategori-${monthLabel}`)}
                    title="Unduh Snapshot Gambar (PNG)"
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
                >
                    <Camera className="size-3.5 text-slate-500" />
                    <span>Simpan Plot</span>
                </button>
            </div>

            {/* SVG Canvas */}
            <div className="relative w-full">
                <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
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

                    {/* Vertical Gridlines & X Ticks */}
                    {xTicks.map((tickVal) => {
                        const x = padding.left + (tickVal / (maxHours || 1)) * plotWidth;
                        return (
                            <g key={tickVal}>
                                <line
                                    x1={x}
                                    y1={padding.top}
                                    x2={x}
                                    y2={padding.top + plotHeight}
                                    stroke="#E2E8F0"
                                    strokeDasharray="3 3"
                                    strokeWidth="1"
                                />
                                {/* Bottom tick mark */}
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
                                    {tickVal % 1 === 0 ? tickVal : tickVal.toFixed(1)}
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
                        Total Jam Terpakai (Hours)
                    </text>

                    {/* Bars and Y Ticks */}
                    {data.map((cat, index) => {
                        const yCenter = padding.top + index * rowHeight + rowHeight / 2;
                        const yBar = yCenter - barHeight / 2;
                        const barW = Math.max(2, getBarWidth(cat.total_hours));
                        const colors = BAR_COLORS[cat.type] || { fill: '#64748B', stroke: '#334155' };
                        const isHovered = hoveredType === cat.type;

                        return (
                            <g
                                key={cat.type}
                                onMouseEnter={() => setHoveredType(cat.type)}
                                onMouseLeave={() => setHoveredType(null)}
                                className="cursor-pointer transition"
                            >
                                {/* Horizontal row guide */}
                                <line
                                    x1={padding.left}
                                    y1={yCenter}
                                    x2={padding.left + plotWidth}
                                    y2={yCenter}
                                    stroke="#F1F5F9"
                                    strokeDasharray="2 2"
                                    strokeWidth="0.8"
                                />

                                {/* Left Y Tick Mark */}
                                <line
                                    x1={padding.left - 4}
                                    y1={yCenter}
                                    x2={padding.left}
                                    y2={yCenter}
                                    stroke="#475569"
                                    strokeWidth="1.2"
                                />

                                {/* Y Axis Label (Category Name) */}
                                <text
                                    x={padding.left - 8}
                                    y={yCenter + 3.5}
                                    textAnchor="end"
                                    className={`font-mono text-[11px] ${
                                        isHovered ? 'fill-[#2D4C79] font-bold' : 'fill-slate-700 font-medium'
                                    }`}
                                >
                                    {cat.label}
                                </text>

                                {/* Bar Rectangle */}
                                <rect
                                    x={padding.left}
                                    y={yBar}
                                    width={barW}
                                    height={barHeight}
                                    fill={colors.fill}
                                    stroke={colors.stroke}
                                    strokeWidth="1.2"
                                    rx="1"
                                    className="transition-all duration-150"
                                    opacity={hoveredType && !isHovered ? 0.6 : 1}
                                />

                                {/* Value Label at End of Bar */}
                                <text
                                    x={padding.left + barW + 8}
                                    y={yCenter + 3.5}
                                    className="font-mono text-[10px] font-semibold fill-slate-800"
                                >
                                    {cat.total_hours} Jam{' '}
                                    <tspan className="fill-slate-500 font-normal">
                                        ({cat.total_reservations}x)
                                    </tspan>
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
