import UserPageLayout from '@/layouts/user-page-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, MapPin, Search, SlidersHorizontal, UsersRound } from 'lucide-react';
import { FormEvent, useState } from 'react';

type Facility = {
    id: number;
    name: string;
    type: string;
    location: string;
    capacity: number;
    description: string | null;
    condition: 'aktif' | 'dalam_perbaikan' | 'nonaktif';
    parent_facility: { id: number; name: string } | null;
};

type Filters = {
    search: string;
    type: string;
    location: string;
    minimum_capacity: number | '';
};

type Option = {
    value: string;
    label: string;
};

type Props = {
    facilities: Facility[];
    filters: Filters;
    locations: string[];
    types: Option[];
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

export default function FacilityIndex({
    facilities,
    filters,
    locations,
    types,
}: Props) {
    const [form, setForm] = useState<Filters>(filters);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get('/facilities', form, {
            preserveScroll: true,
            preserveState: true,
        });
    }

    function resetFilters() {
        setForm({ search: '', type: '', location: '', minimum_capacity: '' });
        router.get('/facilities');
    }

    return (
        <>
            <Head title="Katalog Fasilitas — AduPDF" />
            <UserPageLayout active="facilities">
                <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    {/* Header */}
                    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#17324D] via-[#214B68] to-[#167C77] px-6 py-9 text-white shadow-[0_28px_70px_-34px_rgba(15,23,42,0.8)] sm:px-8 sm:py-12">
                        <div aria-hidden="true" className="absolute -right-14 -top-24 size-72 rounded-full border-[36px] border-white/5" />
                        <div className="relative max-w-3xl">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Eksplorasi ruang kampus</p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Temukan ruang yang tepat untuk setiap kegiatan.</h1>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">Cari ruang kelas, laboratorium, aula, lapangan, dan peralatan kampus berdasarkan lokasi serta kapasitas yang Anda butuhkan.</p>
                        </div>
                    </div>

                    {/* Filter Toolbar (Design Section 13) */}
                    <form
                        onSubmit={submit}
                        className="ui-card mb-8 p-5 sm:p-6"
                    >
                        <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><SlidersHorizontal className="size-5" /></span><div><h2 className="text-sm font-extrabold text-slate-900">Filter fasilitas</h2><p className="text-xs text-slate-500">Persempit hasil sesuai kebutuhan Anda.</p></div></div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="sm:col-span-2 lg:col-span-1">
                                <label className="mb-1.5 block text-xs font-semibold text-[#111827]">
                                    Cari Fasilitas
                                </label>
                                <input
                                    type="text"
                                    value={form.search}
                                    onChange={(e) => setForm({ ...form, search: e.target.value })}
                                    placeholder="Nama atau lokasi..."
                                    className="ui-input"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#111827]">
                                    Tipe
                                </label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="ui-input"
                                >
                                    <option value="">Semua tipe</option>
                                    {types.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#111827]">
                                    Lokasi
                                </label>
                                <select
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    className="ui-input"
                                >
                                    <option value="">Semua lokasi</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#111827]">
                                    Kapasitas Min.
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={form.minimum_capacity}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            minimum_capacity:
                                                e.target.value === '' ? '' : Number(e.target.value),
                                        })
                                    }
                                    placeholder="0 orang"
                                    className="ui-input"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
                            <span className="text-xs text-[#667085]">
                                Menampilkan <strong className="font-semibold text-[#111827]">{facilities.length}</strong> fasilitas
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="ui-button-secondary py-2 text-xs"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="ui-button-primary py-2 text-xs"
                                >
                                    <Search className="size-3.5" />Terapkan Filter
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Facility List (Design Section 14) */}
                    {facilities.length === 0 ? (
                        <div className="ui-card grid place-items-center border-dashed p-12 text-center">
                            <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Search className="size-6" /></span>
                            <p className="text-sm font-semibold text-[#111827]">
                                Fasilitas tidak ditemukan
                            </p>
                            <p className="mt-1 text-xs text-[#667085]">
                                Coba sesuaikan kata kunci pencarian atau ubah kriteria filter Anda.
                            </p>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-4 inline-flex h-9 items-center justify-center rounded-md border border-[#D0D5DD] bg-white px-4 text-xs font-semibold text-[#2D4C79] hover:bg-[#E9EEF5] transition"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {facilities.map((fac) => {
                                const status = conditionConfig[fac.condition] || conditionConfig.aktif;

                                return (
                                    <article
                                        key={fac.id}
                                        className="group ui-card relative flex flex-col justify-between overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_55px_-30px_rgba(15,118,110,0.45)]"
                                    >
                                        <div>
                                            <div className="mb-5 grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-teal-50 text-[#245578] transition group-hover:scale-105"><Building2 className="size-6" /></div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-[#2D4C79]">
                                                    {typeLabels[fac.type] || fac.type}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${status.classes}`}
                                                >
                                                    <span>{status.icon}</span>
                                                    <span>{status.label}</span>
                                                </span>
                                            </div>

                                            <h2 className="mt-3 text-base font-semibold text-[#111827]">
                                                {fac.name}
                                            </h2>

                                            <dl className="mt-4 space-y-2.5 rounded-2xl bg-slate-50 p-4 text-xs text-[#667085]">
                                                <div className="flex justify-between">
                                                    <dt className="flex items-center gap-1.5"><MapPin className="size-3.5 text-teal-600" />Lokasi</dt>
                                                    <dd className="font-medium text-[#111827]">
                                                        {fac.location}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="flex items-center gap-1.5"><UsersRound className="size-3.5 text-teal-600" />Kapasitas</dt>
                                                    <dd className="font-medium text-[#111827]">
                                                        {fac.capacity} orang
                                                    </dd>
                                                </div>
                                                {fac.parent_facility && (
                                                    <div className="flex justify-between">
                                                        <dt>Ruangan Induk:</dt>
                                                        <dd className="font-medium text-[#2D4C79]">
                                                            {fac.parent_facility.name}
                                                        </dd>
                                                    </div>
                                                )}
                                            </dl>

                                            {fac.description && (
                                                <p className="mt-3 line-clamp-2 text-xs text-[#667085]">
                                                    {fac.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
                                            <Link
                                                href={`/facilities/${fac.id}`}
                                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-xs font-bold text-white transition hover:bg-[#17324D]"
                                            >
                                                Lihat detail & jadwal <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </main>
            </UserPageLayout>
        </>
    );
}
