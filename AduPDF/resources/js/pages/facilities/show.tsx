import { Head, Link } from '@inertiajs/react';

type ChildTool = {
    id: number;
    name: string;
    type: string;
    condition: string;
};

type Facility = {
    id: number;
    name: string;
    type: string;
    location: string;
    capacity: number;
    description: string | null;
    condition: string;
    parent_facility: { id: number; name: string } | null;
    child_tools: ChildTool[];
};

type Props = {
    facility: Facility;
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

export default function FacilityShow({ facility }: Props) {
    return (
        <>
            <Head title={facility.name} />
            <main className="min-h-screen bg-[#F7F8FA] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link href="/facilities" className="text-sm font-medium text-[#2D4C79] hover:underline">← Kembali ke fasilitas</Link>
                    <article className="mt-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <p className="text-sm font-semibold text-[#2D4C79]">{typeLabels[facility.type]}</p>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">{facility.name}</h1>
                            </div>
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{conditionLabels[facility.condition]}</span>
                        </div>

                        <dl className="mt-8 grid gap-5 border-y border-slate-200 py-5 sm:grid-cols-3">
                            <div><dt className="text-sm text-slate-500">Lokasi</dt><dd className="mt-1 font-medium">{facility.location}</dd></div>
                            <div><dt className="text-sm text-slate-500">Kapasitas</dt><dd className="mt-1 font-medium">{facility.capacity} orang</dd></div>
                            {facility.parent_facility && <div><dt className="text-sm text-slate-500">Ruangan induk</dt><dd className="mt-1 font-medium"><Link href={`/facilities/${facility.parent_facility.id}`} className="text-[#2D4C79] hover:underline">{facility.parent_facility.name}</Link></dd></div>}
                        </dl>

                        <section className="mt-8">
                            <h2 className="text-lg font-semibold">Deskripsi</h2>
                            <p className="mt-2 leading-7 text-slate-700">{facility.description || 'Belum ada deskripsi fasilitas.'}</p>
                        </section>

                        {facility.child_tools.length > 0 && (
                            <section className="mt-8">
                                <h2 className="text-lg font-semibold">Peralatan di ruangan</h2>
                                <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200">
                                    {facility.child_tools.map((tool) => (
                                        <li key={tool.id} className="flex items-center justify-between gap-4 px-4 py-3">
                                            <Link href={`/facilities/${tool.id}`} className="font-medium text-[#2D4C79] hover:underline">{tool.name}</Link>
                                            <span className="text-sm text-slate-600">{conditionLabels[tool.condition]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </article>
                </div>
            </main>
        </>
    );
}
