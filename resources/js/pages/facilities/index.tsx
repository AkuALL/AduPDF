import { Head, Link, router, usePage } from '@inertiajs/react';
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

type AuthUser = {
    id: number;
    name?: string;
    nama?: string;
    email: string;
    role: string;
};

export default function FacilityIndex({
    facilities,
    filters,
    locations,
    types,
}: Props) {
    const { auth } = usePage<{ auth?: { user?: AuthUser | null } }>().props;
    const user = auth?.user;

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
            <div className="min-h-screen bg-[#F7F8FA] text-[#111827] font-sans antialiased">
                {/* Navigation Bar */}
                <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
                    <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="text-xl font-bold tracking-tight text-[#2D4C79]">
                                    AduPDF
                                </span>
                                <span className="rounded bg-[#E9EEF5] px-1.5 py-0.5 text-xs font-semibold text-[#2D4C79]">
                                    Kampus
                                </span>
                            </Link>
                            <nav className="hidden sm:flex sm:gap-6 text-sm">
                                <Link
                                    href="/facilities"
                                    className="font-semibold text-[#2D4C79] border-b-2 border-[#2D4C79] pb-4 pt-4"
                                >
                                    Fasilitas
                                </Link>
                                {user?.role === 'pengguna' && (
                                    <Link
                                        href="/reservations"
                                        className="font-medium text-[#667085] hover:text-[#2D4C79] pb-4 pt-4 transition"
                                    >
                                        Reservasi Saya
                                    </Link>
                                )}
                                {user?.role === 'petugas' && (
                                    <Link
                                        href="/petugas/reservations"
                                        className="font-medium text-[#667085] hover:text-[#2D4C79] pb-4 pt-4 transition"
                                    >
                                        Panel Petugas
                                    </Link>
                                )}
                                {user?.role === 'admin' && (
                                    <a
                                        href="/admin/facilities"
                                        className="font-medium text-[#667085] hover:text-[#2D4C79] pb-4 pt-4 transition"
                                    >
                                        Kelola Fasilitas
                                    </a>
                                )}
                            </nav>
                        </div>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link
                                        href="/profile"
                                        aria-label="Buka profil"
                                        className="group hidden rounded-md text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79] sm:block"
                                    >
                                        <span className="block text-xs font-semibold text-[#111827] group-hover:text-[#2D4C79]">
                                            {user.nama || user.name}
                                        </span>
                                        <span className="block text-[10px] text-[#667085] capitalize">
                                            {user.role}
                                        </span>
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="inline-flex h-9 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#5D6673] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition shadow-sm"
                                    >
                                        Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="/login"
                                        className="inline-flex h-9 items-center justify-center rounded-md px-3.5 text-sm font-medium text-[#111827] hover:bg-[#F3F5F7] transition"
                                    >
                                        Masuk
                                    </a>
                                    <a
                                        href="/register"
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-[#2D4C79] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                    >
                                        Daftar
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">
                            Fasilitas Kampus
                        </h1>
                        <p className="mt-1 text-sm text-[#667085]">
                            Temukan fasilitas ruangan dan peralatan untuk kegiatan akademik dan organisasi.
                        </p>
                    </div>

                    {/* Filter Toolbar (Design Section 13) */}
                    <form
                        onSubmit={submit}
                        className="mb-8 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
                    >
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
                                    className="h-10 w-full rounded-md border border-[#D0D5DD] bg-white px-3 text-sm text-[#111827] placeholder-[#98A2B3] outline-none transition focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-[#111827]">
                                    Tipe
                                </label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    className="h-10 w-full rounded-md border border-[#D0D5DD] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
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
                                    className="h-10 w-full rounded-md border border-[#D0D5DD] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
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
                                    className="h-10 w-full rounded-md border border-[#D0D5DD] bg-white px-3 text-sm text-[#111827] placeholder-[#98A2B3] outline-none transition focus:border-[#2D4C79] focus:ring-2 focus:ring-[#2D4C79]/15"
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
                                    className="h-9 rounded-md border border-[#D0D5DD] bg-white px-3.5 text-xs font-semibold text-[#111827] hover:bg-[#F3F5F7] transition"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="h-9 rounded-md bg-[#2D4C79] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#243E63] active:bg-[#1C3150] transition"
                                >
                                    Terapkan Filter
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Facility List (Design Section 14) */}
                    {facilities.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#D0D5DD] bg-white p-12 text-center">
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
                                        className="flex flex-col justify-between rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] hover:border-[#D0D5DD] transition"
                                    >
                                        <div>
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

                                            <dl className="mt-3 space-y-1.5 text-xs text-[#667085]">
                                                <div className="flex justify-between">
                                                    <dt>Lokasi:</dt>
                                                    <dd className="font-medium text-[#111827]">
                                                        {fac.location}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt>Kapasitas:</dt>
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
                                                className="inline-flex h-9 w-full items-center justify-center rounded-md border border-[#D0D5DD] bg-white text-xs font-semibold text-[#2D4C79] hover:bg-[#E9EEF5] hover:border-[#2D4C79] transition"
                                            >
                                                Lihat Detail & Jadwal →
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
