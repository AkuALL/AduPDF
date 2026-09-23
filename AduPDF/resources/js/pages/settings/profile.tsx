import { Form, Head, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
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

    return (
        <>
            <Head title="Profil Pengguna — AduPDF" />

            <h1 className="sr-only">Pengaturan Profil</h1>

            <div className="space-y-6">
                {/* Warning message from Reservation Identity Guard */}
                {flash?.warning && (
                    <div
                        role="alert"
                        className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm"
                    >
                        <div className="font-semibold text-amber-800">Perhatian: Identitas Wajib</div>
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
                            Status Identitas Institusional:{' '}
                            <strong>{hasIdentity ? 'Lengkap' : 'Belum Lengkap'}</strong>
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                        {hasIdentity
                            ? 'Profil Anda telah memiliki identitas institusional yang valid untuk mengajukan reservasi fasilitas kampus.'
                            : 'Anda wajib mengisi salah satu identitas (NIM, NIP, atau No. Pegawai) sebelum dapat membuat reservasi fasilitas (BR-22).'}
                    </p>
                </div>

                <Heading
                    variant="small"
                    title="Informasi Profil & Identitas"
                    description="Perbarui informasi profil, identitas institusional (NIM/NIP/No. Pegawai), serta nomor kontak WhatsApp Anda."
                />

                <Form
                    {...ProfileController.update.form()}
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
                                    className="mt-1"
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
                                    className="mt-1"
                                    message={errors.email}
                                />
                            </div>

                            {/* Jenis Identitas Institusional */}
                            <div className="grid gap-2">
                                <Label htmlFor="identity_type">Jenis Identitas Institusional</Label>
                                <select
                                    id="identity_type"
                                    name="identity_type"
                                    defaultValue={(user.identity_type as string) ?? ''}
                                    className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">-- Pilih Jenis Identitas --</option>
                                    <option value="nim">NIM (Mahasiswa)</option>
                                    <option value="nip">NIP (Dosen / Tenaga Pendidik)</option>
                                    <option value="no_pegawai">No. Pegawai (Tenaga Kependidikan / Staf)</option>
                                </select>
                                <InputError
                                    className="mt-1"
                                    message={errors.identity_type}
                                />
                            </div>

                            {/* Nomor Identitas Institusional */}
                            <div className="grid gap-2">
                                <Label htmlFor="institutional_id">Nomor Identitas Institusional</Label>
                                <Input
                                    id="institutional_id"
                                    className="mt-1 block w-full"
                                    defaultValue={(user.institutional_id as string) ?? ''}
                                    name="institutional_id"
                                    placeholder="Contoh: 24060121140001 (NIM) atau 198501012010121001 (NIP)"
                                />
                                <InputError
                                    className="mt-1"
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
                                    className="mt-1"
                                    message={errors.whatsapp}
                                />
                            </div>

                            {/* Status Sukses Update */}
                            {status === 'profile-updated' && (
                                <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                                    Profil dan identitas berhasil diperbarui.
                                </div>
                            )}

                            <div className="flex items-center gap-4 pt-2">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className="bg-[#2D4C79] hover:bg-[#1e3454]"
                                >
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
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
