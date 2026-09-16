import { Head, Link, router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

type Facility = {
    id: number;
    name: string;
    type: string;
    location: string;
    capacity: number;
    description: string | null;
    condition: string;
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

const conditionLabels: Record<string, string> = {
    aktif: 'Aktif',
    dalam_perbaikan: 'Dalam perbaikan',
    nonaktif: 'Nonaktif',
};

const conditionClasses: Record<string, string> = {
    aktif: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    dalam_perbaikan: 'bg-amber-50 text-amber-800 ring-amber-200',
    nonaktif: 'bg-slate-100 text-slate-700 ring-slate-200',
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
            <Head title="Fasilitas" />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <Link href="/" className="text-sm font-medium text-[#2D4C79] hover:underline">
                                AduPDF
                            </Link>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Fasilitas Kampus</h1>
                            <p className="mt-2 text-slate-600">
                                Temukan fasilitas sesuai kebutuhan kegiatan Anda.
                            </p>
                        </div>
                    </header>

                    <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
                        <label className="md:col-span-2">
                            <span className="mb-1.5 block text-sm font-medium">Cari fasilitas</span>
                            <input
                                value={form.search}
                                onChange={(event) => setForm({ ...form, search: event.target.value })}
                                placeholder="Nama atau lokasi fasilitas"
                                className="h-10 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            />
                        </label>
                        <label>
                            <span className="mb-1.5 block text-sm font-medium">Tipe</span>
                            <select
                                value={form.type}
                                onChange={(event) => setForm({ ...form, type: event.target.value })}
                                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            >
                                <option value="">Semua tipe</option>
                                {types.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                            </select>
                        </label>
                        <label>
                            <span className="mb-1.5 block text-sm font-medium">Lokasi</span>
                            <select
                                value={form.location}
                                onChange={(event) => setForm({ ...form, location: event.target.value })}
                                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 outline-none focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            >
                                <option value="">Semua lokasi</option>
                                {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                            </select>
                        </label>
                        <label>
                            <span className="mb-1.5 block text-sm font-medium">Kapasitas minimum</span>
                            <input
                                type="number"
                                min="0"
                                value={form.minimum_capacity}
                                onChange={(event) => setForm({ ...form, minimum_capacity: event.target.value === '' ? '' : Number(event.target.value) })}
                                className="h-10 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                            />
                        </label>
                        <div className="flex items-end gap-2 md:col-span-3">
                            <button type="submit" className="h-10 rounded-md bg-[#2D4C79] px-4 text-sm font-semibold text-white hover:bg-[#243E63]">
                                Terapkan filter
                            </button>
                            <button type="button" onClick={resetFilters} className="h-10 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                                Reset
                            </button>
                        </div>
                    </form>

                    <p className="mb-4 text-sm text-slate-600">{facilities.length} fasilitas ditemukan</p>

                    {facilities.length === 0 ? (
                        <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <h2 className="text-lg font-semibold">Fasilitas tidak ditemukan</h2>
                            <p className="mt-2 text-slate-600">Ubah atau hapus filter untuk melihat fasilitas lain.</p>
                        </section>
                    ) : (
                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {facilities.map((facility) => (
                                <article key={facility.id} className="flex flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-sm font-medium text-[#2D4C79]">{typeLabels[facility.type]}</span>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${conditionClasses[facility.condition]}`}>
                                            {conditionLabels[facility.condition]}
                                        </span>
                                    </div>
                                    <h2 className="mt-4 text-lg font-semibold">{facility.name}</h2>
                                    <dl className="mt-3 space-y-1 text-sm text-slate-600">
                                        <div className="flex justify-between gap-3"><dt>Lokasi</dt><dd className="text-right">{facility.location}</dd></div>
                                        <div className="flex justify-between gap-3"><dt>Kapasitas</dt><dd>{facility.capacity} orang</dd></div>
                                        {facility.parent_facility && <div className="flex justify-between gap-3"><dt>Ruangan</dt><dd className="text-right">{facility.parent_facility.name}</dd></div>}
                                    </dl>
                                    <Link href={`/facilities/${facility.id}`} className="mt-5 inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-[#2D4C79] hover:bg-slate-50">
                                        Lihat detail
                                    </Link>
                                </article>
                            ))}
                        </section>
                    )}
                </div>
            </main>
        </>
    );
}
