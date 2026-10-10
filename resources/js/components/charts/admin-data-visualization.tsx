import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import MatplotlibLineChart, { type DailyTrendPoint } from './matplotlib-line-chart';
import MatplotlibHorizontalBarChart, { type CategoryUsage } from './matplotlib-horizontal-bar-chart';
import MatplotlibVerticalBarChart, { type LocationDamagePoint } from './matplotlib-vertical-bar-chart';
import { Activity, BarChart2, Calendar, Flame, Layers } from 'lucide-react';

export type ChartStatsProps = {
    daily_usage_trend: DailyTrendPoint[];
    usage_by_type: CategoryUsage[];
    damage_by_location: LocationDamagePoint[];
};

type Props = {
    stats: ChartStatsProps;
    monthLabel: string;
    selectedMonth?: string;
    availableMonths?: Array<{ value: string; label: string }>;
};

type ViewTab = 'all' | 'trend' | 'category' | 'damage';

export default function AdminDataVisualization({
    stats,
    monthLabel,
    selectedMonth,
    availableMonths = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<ViewTab>('all');

    // Calculate quick analytical insights
    const insights = useMemo(() => {
        // 1. Peak usage day
        const peakDay = [...stats.daily_usage_trend].sort((a, b) => b.total_hours - a.total_hours)[0];

        // 2. Most utilized category
        const topCategory = [...stats.usage_by_type].sort((a, b) => b.total_hours - a.total_hours)[0];

        // 3. Top damaged location
        const topHotspot = stats.damage_by_location[0];

        return {
            peakDay: peakDay && peakDay.total_hours > 0 ? peakDay : null,
            topCategory: topCategory && topCategory.total_hours > 0 ? topCategory : null,
            topHotspot: topHotspot && topHotspot.total_reports > 0 ? topHotspot : null,
        };
    }, [stats]);

    return (
        <div className="space-y-4">
            {/* Figure Panel Header */}
            <div className="space-y-3.5 border-b border-slate-200 pb-3.5">
                {/* Baris 1: Judul di kiri, Pemilih Bulan di kanan (rata kanan sejajar elemen bawah) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-md bg-[#2D4C79] text-white">
                                <Activity className="size-4" />
                            </span>
                            <h2 className="text-lg font-bold text-slate-900">
                                Visualisasi Data & Analitik Kampus
                            </h2>
                        </div>
                    </div>

                    {/* Month Filter Selector (Rata Kanan) */}
                    {availableMonths && availableMonths.length > 0 && (
                        <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="text-xs text-slate-500 font-medium hidden md:inline">Bulan Analisis:</span>
                            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
                                <Calendar className="size-3.5 text-slate-500" />
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => {
                                        router.get(
                                            '/admin',
                                            { month: e.target.value },
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            }
                                        );
                                    }}
                                    aria-label="Pilih Bulan Analisis"
                                    className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer pr-1"
                                >
                                    {availableMonths.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Baris 2: Tab Navigasi Plot (Rata Kiri) & Indikator Periode (Rata Kanan) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
                    {/* View Switcher Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1 font-mono text-xs">
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                                activeTab === 'all'
                                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Layers className="size-3.5" />
                            Semua Plot
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('trend')}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                                activeTab === 'trend'
                                    ? 'bg-white text-[#2D4C79] shadow-xs border border-slate-200 font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Activity className="size-3.5" />
                            Tren Harian
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('category')}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                                activeTab === 'category'
                                    ? 'bg-white text-[#2D4C79] shadow-xs border border-slate-200 font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <BarChart2 className="size-3.5" />
                            Utilisasi Kategori
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('damage')}
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                                activeTab === 'damage'
                                    ? 'bg-white text-rose-700 shadow-xs border border-slate-200 font-bold'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Flame className="size-3.5" />
                            Titik Panas Kerusakan
                        </button>
                    </div>

                    <div className="font-mono text-xs text-slate-500">
                        Periode: <span className="font-semibold text-slate-800">{monthLabel}</span>
                    </div>
                </div>
            </div>

        {/* Quick Analytical Insights Pill Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-blue-50 text-[#2D4C79] border border-blue-200 font-mono text-xs font-bold">
                        ▲
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] font-mono uppercase text-slate-500">
                            Hari Beban Puncak
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate">
                            {insights.peakDay ? (
                                <>
                                    {insights.peakDay.label} ·{' '}
                                    <span className="text-[#2D4C79]">{insights.peakDay.total_hours} Jam</span>
                                </>
                            ) : (
                                <span className="text-slate-400">Belum ada pemakaian</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold">
                        ★
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] font-mono uppercase text-slate-500">
                            Kategori Paling Diminati
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate">
                            {insights.topCategory ? (
                                <>
                                    {insights.topCategory.label} ·{' '}
                                    <span className="text-emerald-700">{insights.topCategory.total_hours} Jam</span>
                                </>
                            ) : (
                                <span className="text-slate-400">Belum ada pemakaian</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-bold">
                        !
                    </div>
                    <div className="min-w-0">
                        <div className="text-[11px] font-mono uppercase text-slate-500">
                            Hotspot Laporan Terbanyak
                        </div>
                        <div className="text-xs font-bold text-slate-900 truncate">
                            {insights.topHotspot ? (
                                <>
                                    {insights.topHotspot.location} ·{' '}
                                    <span className="text-rose-700">{insights.topHotspot.total_reports} Insiden</span>
                                </>
                            ) : (
                                <span className="text-emerald-600">0 insiden kerusakan</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Plots Display Grid */}
            {activeTab === 'all' && (
                <div className="space-y-4">
                    {/* Primary Line Chart (Full Width) */}
                    <MatplotlibLineChart
                        data={stats.daily_usage_trend}
                        monthLabel={monthLabel}
                    />

                    {/* Secondary 2-Column Bar Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <MatplotlibHorizontalBarChart
                            data={stats.usage_by_type}
                            monthLabel={monthLabel}
                        />
                        <MatplotlibVerticalBarChart
                            data={stats.damage_by_location}
                        />
                    </div>
                </div>
            )}

            {activeTab === 'trend' && (
                <div>
                    <MatplotlibLineChart
                        data={stats.daily_usage_trend}
                        monthLabel={monthLabel}
                    />
                </div>
            )}

            {activeTab === 'category' && (
                <div>
                    <MatplotlibHorizontalBarChart
                        data={stats.usage_by_type}
                        monthLabel={monthLabel}
                    />
                </div>
            )}

            {activeTab === 'damage' && (
                <div>
                    <MatplotlibVerticalBarChart
                        data={stats.damage_by_location}
                    />
                </div>
            )}
        </div>
    );
}
