import { Form, Head, Link, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        status?: string;
    };
};

export default function Profile({
    status,
}: {
    mustVerifyEmail?: boolean;
    status?: string;
}) {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth.user;
    const hasIdentity = Boolean(user.institutional_id && user.identity_type);
    const inputErrorClass = 'mt-1 !text-[#B42318] dark:!text-[#B42318]';

    return (
        <div
            className="min-h-screen bg-[#F7F8FA] font-sans text-[#111827] antialiased [--accent:#F3F5F7] [--accent-foreground:#111827] [--background:#FFFFFF] [--border:#E5E7EB] [--destructive:#B42318] [--foreground:#111827] [--input:#D0D5DD] [--muted:#F3F5F7] [--muted-foreground:#667085] [--primary:#2D4C79] [--primary-foreground:#FFFFFF] [--ring:#2D4C79]"
            style={{ colorScheme: 'light' }}
        >
            <Head title="Profil Pengguna — AduPDF" />

            <h1 className="sr-only">Pengaturan Profil</h1>

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
                                className="pb-4 pt-4 font-medium text-[#667085] transition hover:text-[#2D4C79]"
                            >
                                Fasilitas
                            </Link>
                            {user.role === 'pengguna' && (
                                <Link
                                    href="/reservations"
                                    className="pb-4 pt-4 font-medium text-[#667085] transition hover:text-[#2D4C79]"
                                >
                                    Reservasi Saya
                                </Link>
                            )}
                            {user.role === 'petugas' && (
                                <Link
                                    href="/petugas/reservations"
                                    className="pb-4 pt-4 font-medium text-[#667085] transition hover:text-[#2D4C79]"
                                >
                                    Panel Petugas
                                </Link>
                            )}
                            {user.role === 'admin' && (
                                <Link
                                    href="/admin/facilities"
                                    className="pb-4 pt-4 font-medium text-[#667085] transition hover:text-[#2D4C79]"
                                >
                                    Kelola Fasilitas
                                </Link>
                            )}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
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
                            className="inline-flex h-9 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#5D6673] shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                        >
                            Keluar
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
              <section className="space-y-6 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-8">
                {/* Warning message from Reservation Identity Guard */}
                {flash?.warning && (
                    <div
                        role="alert"
                        className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm"
                    >
                        <div className="font-semibold text-amber-800">Lengkapi Profil</div>
                        <div className="mt-1">{flash.warning}</div>
                    </div>
                )}

                {/* Identity Completeness Indicator */}
                <div
                    className={`rounded-lg border p-4 text-sm ${
                        hasIdentity
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                            : 'border-amber-200 bg-amber-50/60 text-amber-900'
                    }`}
                >
                    <div className="flex items-center gap-2 font-medium">
                        <span className="text-base">{hasIdentity ? '✓' : 'ℹ'}</span>
                        <span>
                            Status Identitas:{' '}
                            <strong>{hasIdentity ? 'Lengkap' : 'Belum Lengkap'}</strong>
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                        {hasIdentity
                            ? 'Identitas kampus Anda sudah lengkap.'
                            : 'Isi NIM, NIP, atau No. Pegawai sebelum mengajukan reservasi.'}
                    </p>
                </div>

                <Heading
                    variant="small"
                    title="Informasi Profil"
                    description="Perbarui data diri, identitas kampus, dan nomor WhatsApp."
                />

                <Form
                    action="/profile"
                    method="patch"
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Nama Lengkap */}
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <Input
                                    id="nama"
                                    className="mt-1 block w-full"
                                    defaultValue={user.nama ?? user.name}
                                    name="nama"
                                    required
                                    autoComplete="name"
                                    placeholder="Nama Lengkap"
                                />
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.nama || errors.name}
                                />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={user.email}
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="nama@kampus.ac.id"
                                />
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.email}
                                />
                            </div>

                            {/* Jenis Identitas Institusional */}
                            <div className="grid gap-2">
                                <Label htmlFor="identity_type">Jenis Identitas Kampus</Label>
                                <select
                                    id="identity_type"
                                    name="identity_type"
                                    defaultValue={(user.identity_type as string) ?? ''}
                                    className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">-- Pilih Jenis Identitas --</option>
                                    <option value="nim">NIM (Mahasiswa)</option>
                                    <option value="nip">NIP (Dosen / Tenaga Pendidik)</option>
                                    <option value="no_pegawai">No. Pegawai (Tenaga Kependidikan atau Staf)</option>
                                </select>
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.identity_type}
                                />
                            </div>

                            {/* Nomor Identitas Institusional */}
                            <div className="grid gap-2">
                                <Label htmlFor="institutional_id">Nomor Identitas Kampus</Label>
                                <Input
                                    id="institutional_id"
                                    className="mt-1 block w-full"
                                    defaultValue={(user.institutional_id as string) ?? ''}
                                    name="institutional_id"
                                    placeholder="Contoh: 24060121140001 (NIM) atau 198501012010121001 (NIP)"
                                />
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.institutional_id}
                                />
                            </div>

                            {/* Nomor WhatsApp */}
                            <div className="grid gap-2">
                                <Label htmlFor="whatsapp">Nomor WhatsApp Aktif</Label>
                                <Input
                                    id="whatsapp"
                                    type="tel"
                                    className="mt-1 block w-full"
                                    defaultValue={(user.whatsapp as string) ?? ''}
                                    name="whatsapp"
                                    placeholder="Contoh: 081234567890"
                                />
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.whatsapp}
                                />
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <Heading
                                    variant="small"
                                    title="Ubah Kata Sandi"
                                    description="Isi jika ingin menggunakan kata sandi baru."
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata Sandi Baru</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                />
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi Baru</Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                />
                                <InputError
                                    className={inputErrorClass}
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Status Sukses Update */}
                            {status === 'profile-updated' && (
                                <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                                    Profil berhasil disimpan.
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className="bg-[#2D4C79] text-white hover:bg-[#1e3454]"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

              </section>
              <section className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-8">
                  <DeleteUser />
              </section>
            </main>
        </div>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
