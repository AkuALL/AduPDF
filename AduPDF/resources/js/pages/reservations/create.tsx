import UserPageLayout from '@/layouts/user-page-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarClock, CheckCircle2, Clock3, Info, MapPin, Send } from 'lucide-react';

type Props = {
    facility: { id: number; name: string; location: string };
    reservable: boolean;
    success: string | null;
};

export default function CreateReservation({ facility, reservable, success }: Props) {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const defaultStartTime = params?.get('start_time') ?? '';
    const defaultEndTime = params?.get('end_time') ?? '';

    return (
        <UserPageLayout active="facilities">
            <Head title="Ajukan Reservasi — AduPDF" />
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <Link href={`/facilities/${facility.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-[#17324D]"><ArrowLeft className="size-4" />Kembali ke detail fasilitas</Link>

                <div className="mt-5 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                    <aside className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#17324D] via-[#245578] to-[#167C77] p-6 text-white shadow-[0_28px_70px_-34px_rgba(15,23,42,0.8)] sm:p-8">
                        <div aria-hidden="true" className="absolute -right-16 -top-20 size-60 rounded-full border-[30px] border-white/5" />
                        <div className="relative">
                            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-inset ring-white/15"><CalendarClock className="size-6 text-teal-200" /></span>
                            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Reservasi fasilitas</p>
                            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">{facility.name}</h1>
                            <p className="mt-3 flex items-center gap-2 text-sm text-slate-200"><MapPin className="size-4 text-teal-300" />{facility.location}</p>

                            <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-sm text-slate-200">
                                <p className="flex items-start gap-3"><Clock3 className="mt-0.5 size-4 shrink-0 text-teal-300" /><span>Jam operasional <strong className="text-white">07.00–20.00 WIB</strong> dengan interval 30 menit.</span></p>
                                <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-300" /><span>Pengajuan akan masuk ke antrean persetujuan petugas.</span></p>
                            </div>
                        </div>
                    </aside>

                    <section className="ui-card p-6 sm:p-8">
                        <div><p className="ui-eyebrow">Form pengajuan</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-slate-900">Pilih waktu penggunaan</h2><p className="mt-2 text-sm leading-6 text-slate-500">Pastikan rentang waktu dan tujuan penggunaan sudah sesuai sebelum dikirim.</p></div>
                        {success && <div role="status" className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{success}</div>}
                        {!reservable && <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><Info className="mt-0.5 size-5 shrink-0" />Fasilitas ini sedang tidak dapat direservasi.</div>}

                        <Form action="/reservations" method="post" resetOnSuccess className="mt-7 space-y-5">
                            {({ errors, processing }) => (
                                <>
                                    <input type="hidden" name="facility_id" value={facility.id} />
                                    {errors.facility_id && <p role="alert" className="text-sm font-medium text-rose-700">{errors.facility_id}</p>}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div><label htmlFor="start_time" className="ui-label">Mulai (WIB)</label><input id="start_time" name="start_time" type="datetime-local" step="1800" defaultValue={defaultStartTime} required aria-invalid={!!errors.start_time} className="ui-input" />{errors.start_time && <p role="alert" className="mt-1.5 text-xs font-medium text-rose-700">{errors.start_time}</p>}</div>
                                        <div><label htmlFor="end_time" className="ui-label">Selesai (WIB)</label><input id="end_time" name="end_time" type="datetime-local" step="1800" defaultValue={defaultEndTime} required aria-invalid={!!errors.end_time} className="ui-input" />{errors.end_time && <p role="alert" className="mt-1.5 text-xs font-medium text-rose-700">{errors.end_time}</p>}</div>
                                    </div>
                                    <div><label htmlFor="tujuan" className="ui-label">Tujuan penggunaan</label><textarea id="tujuan" name="tujuan" required maxLength={5000} rows={5} aria-invalid={!!errors.tujuan} placeholder="Jelaskan kegiatan dan kebutuhan penggunaan fasilitas..." className="ui-input resize-none" />{errors.tujuan && <p role="alert" className="mt-1.5 text-xs font-medium text-rose-700">{errors.tujuan}</p>}</div>
                                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-md text-xs leading-5 text-slate-500">Dengan mengirim pengajuan, Anda menyetujui ketentuan penggunaan fasilitas kampus.</p><button type="submit" disabled={processing || !reservable} className="ui-button-primary shrink-0"><Send className="size-4" />{processing ? 'Mengirim...' : 'Kirim pengajuan'}</button></div>
                                </>
                            )}
                        </Form>
                    </section>
                </div>
            </main>
        </UserPageLayout>
    );
}
