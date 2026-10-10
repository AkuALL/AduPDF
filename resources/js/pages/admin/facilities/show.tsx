import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminBackLink from '@/components/admin-back-link';
import ConfirmationDialog, {
    type ConfirmationRequest,
} from '@/components/confirmation-dialog';
import FacilityConditionBadge from '@/components/facility-condition-badge';
import AdminLayout from '@/layouts/admin-layout';

type RelatedFacility = { id: number; name: string; type: string; location?: string; condition: string };
type Facility = { id: number; name: string; type: string; location: string; capacity: number; description: string | null; condition: string; reservations_count: number; child_tools_count: number; parent_facility: RelatedFacility | null; child_tools: RelatedFacility[] };
export default function FacilityShow({ facility }: { facility: Facility }) {
    const isRoom = ['ruang_kelas', 'aula', 'laboratorium'].includes(facility.type);
    const [confirmation, setConfirmation] = useState<ConfirmationRequest | null>(null);
    function patch(action: 'activate' | 'deactivate') {
        const deactivate = action === 'deactivate';
        setConfirmation({
            title: deactivate ? 'Nonaktifkan Fasilitas' : 'Aktifkan Kembali Fasilitas',
            description: deactivate
                ? 'Nonaktifkan fasilitas ' + facility.name + '? Reservasi menunggu akan ditolak dan reservasi disetujui yang belum selesai akan dibatalkan.'
                : 'Aktifkan kembali fasilitas ' + facility.name + '? Fasilitas akan tersedia untuk reservasi baru.',
            confirmLabel: deactivate ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan',
            destructive: deactivate,
            onConfirm: () => router.patch('/admin/facilities/' + facility.id + '/' + action),
        });
    }
    return <AdminLayout><Head title={`${facility.name} — Detail Fasilitas`} /><div className="w-full space-y-6"><div className="flex items-center justify-between"><AdminBackLink href="/admin/facilities">Kembali ke Daftar Fasilitas</AdminBackLink><div className="flex gap-2"><Link href={`/admin/facilities/${facility.id}/edit`} className="rounded-md bg-[#2D4C79] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer">Edit Fasilitas</Link>{facility.condition === 'aktif' && <button onClick={() => patch('deactivate')} className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white">Nonaktifkan</button>}{facility.condition === 'nonaktif' && <button onClick={() => patch('activate')} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Aktifkan Kembali</button>}</div></div><div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row"><div><span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-[#2D4C79]">{facility.type.replaceAll('_', ' ')}</span><h1 className="mt-2 text-2xl font-bold">{facility.name}</h1></div><div className="h-fit"><FacilityConditionBadge condition={facility.condition} /></div></div><div className="grid gap-6 border-b border-slate-200 py-6 text-sm sm:grid-cols-3"><Info label="Lokasi" value={facility.location} /><Info label="Kapasitas Maksimal" value={`${facility.capacity} Orang`} /><Info label="Total Riwayat Reservasi" value={`${facility.reservations_count} Reservasi`} /></div><section className="border-b border-slate-200 py-6"><h2 className="mb-2 text-xs font-bold uppercase tracking-wider">Deskripsi Fasilitas</h2><p className="text-sm leading-relaxed text-slate-600">{facility.description ?? 'Tidak ada deskripsi tambahan untuk fasilitas ini.'}</p></section>{facility.type === 'alat' && <section className="border-b border-slate-200 py-6"><h2 className="mb-3 text-xs font-bold uppercase tracking-wider">Ruangan Induk</h2>{facility.parent_facility ? <Link href={`/admin/facilities/${facility.parent_facility.id}`} className="block rounded-lg border border-slate-200 bg-slate-50 p-4 font-bold text-[#2D4C79] cursor-pointer">{facility.parent_facility.name}<span className="ml-2 text-xs font-normal text-slate-500">{facility.parent_facility.type.replaceAll('_', ' ')} • {facility.parent_facility.location}</span></Link> : <p className="text-xs font-semibold text-rose-600">Peringatan: Alat ini belum terikat dengan ruangan induk mana pun.</p>}</section>}{isRoom && <section className="border-b border-slate-200 py-6"><div className="mb-3"><h2 className="text-xs font-bold uppercase tracking-wider">Peralatan yang Terdaftar di Ruangan Ini ({facility.child_tools_count})</h2></div>{facility.child_tools.length === 0 ? <p className="text-xs italic text-slate-500">Belum ada peralatan terdaftar di ruangan ini.</p> : <div className="divide-y rounded-lg border border-slate-200">{facility.child_tools.map((tool) => <Link key={tool.id} href={`/admin/facilities/${tool.id}`} className="flex justify-between p-3 text-sm font-semibold text-[#2D4C79] cursor-pointer"><span>{tool.name}</span><FacilityConditionBadge condition={tool.condition} /></Link>)}</div>}</section>}</div></div><ConfirmationDialog confirmation={confirmation} onOpenChange={(open) => { if (!open) setConfirmation(null); }} /></AdminLayout>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><span className="text-xs font-medium text-slate-500">{label}</span><div className="mt-1 font-bold">{value}</div></div>; }
