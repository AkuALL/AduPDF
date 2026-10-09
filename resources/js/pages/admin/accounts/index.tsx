import { Head, Link, router } from '@inertiajs/react';
import { Loader2, UserCheck, UserX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { approve as approveAccount } from '@/actions/App/Http/Controllers/Admin/AccountManagementController';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin-layout';

type User = {
    id: number;
    nama?: string;
    name?: string;
    email: string;
    role: 'petugas' | 'pengguna' | 'admin';
    institutional_id?: string | null;
    identity_type?: 'nim' | 'nip' | 'no_pegawai' | null;
    whatsapp?: string | null;
    created_at: string | null;
    deleted_at: string | null;
    approved_at: string | null;
    email_verified_at: string | null;
};

type Props = {
    users: {
        data: User[];
        links?: { url: string | null; label: string; active: boolean }[];
    };
};

const roleLabels: Record<string, string> = {
    admin: 'Admin',
    petugas: 'Petugas',
    pengguna: 'Pengguna',
};
const identityLabels: Record<string, string> = {
    nim: 'NIM',
    nip: 'NIP',
    no_pegawai: 'No. Pegawai',
};

export default function Index({ users }: Props) {
    const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    function confirmDeactivation() {
        if (!userToDeactivate) return;
        router.patch(
            `/admin/users/${userToDeactivate.id}/deactivate`,
            {},
            {
                preserveScroll: true,
                onStart: () => setIsProcessing(true),
                onFinish: () => {
                    setIsProcessing(false);
                    setUserToDeactivate(null);
                },
            },
        );
    }

    function activate(user: User) {
        router.patch(
            `/admin/users/${user.id}/activate`,
            {},
            { preserveScroll: true },
        );
    }

    function approve(user: User) {
        if (!window.confirm(`Setujui akun Pengguna ${user.nama ?? user.name}?`))
            return;

        router.patch(approveAccount(user.id).url, {}, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Kelola Akun — AduPDF" />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Kelola Akun
                        </h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Daftar akun nonaktif dan aktif selain akun Admin
                            yang sedang digunakan.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/users/pengguna/create"
                            className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                        >
                            + Buat Pengguna
                        </Link>
                        <Link
                            href="/admin/users/petugas/create"
                            className="rounded-md bg-[#2D4C79] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#1e3454]"
                        >
                            + Buat Petugas
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Nama Lengkap</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Peran</th>
                                <th className="px-6 py-3">
                                    Identitas Institusional
                                </th>
                                <th className="px-6 py-3">Tanggal Dibuat</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-sm text-slate-500"
                                    >
                                        Belum ada akun lain yang terdaftar.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {user.nama ?? user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    user.role === 'petugas'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : user.role === 'admin'
                                                          ? 'bg-purple-100 text-purple-800'
                                                          : 'bg-emerald-100 text-emerald-800'
                                                }`}
                                            >
                                                {roleLabels[user.role] ??
                                                    user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {user.institutional_id ? (
                                                <div>
                                                    <span className="font-semibold text-slate-800">
                                                        {identityLabels[
                                                            user.identity_type ??
                                                                ''
                                                        ] ?? user.identity_type}
                                                        :
                                                    </span>{' '}
                                                    <span className="text-slate-600">
                                                        {user.institutional_id}
                                                    </span>
                                                    {user.whatsapp && (
                                                        <div className="mt-0.5 text-[11px] text-slate-500">
                                                            WA: {user.whatsapp}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">
                                                    Belum diisi
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {user.created_at
                                                ? `${new Date(user.created_at).toLocaleString('id-ID')} WIB`
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${user.deleted_at ? 'bg-slate-100 text-slate-600' : user.approved_at ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}
                                                >
                                                    {user.deleted_at
                                                        ? 'Nonaktif'
                                                        : user.approved_at
                                                          ? 'Aktif'
                                                          : 'Menunggu Persetujuan'}
                                                </span>
                                                {!user.deleted_at &&
                                                    user.role === 'pengguna' &&
                                                    !user.email_verified_at && (
                                                        <div className="text-[11px] text-amber-700">
                                                            Email belum
                                                            diverifikasi
                                                        </div>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.deleted_at ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        activate(user)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                                >
                                                    <UserCheck className="h-3.5 w-3.5" />
                                                    Aktifkan Kembali
                                                </button>
                                            ) : (
                                                <div className="flex flex-wrap justify-end gap-2">
                                                    {user.role === 'pengguna' &&
                                                        !user.approved_at && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    approve(
                                                                        user,
                                                                    )
                                                                }
                                                                className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                                                            >
                                                                <UserCheck className="h-3.5 w-3.5" />
                                                                Setujui
                                                            </button>
                                                        )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setUserToDeactivate(
                                                                user,
                                                            )
                                                        }
                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                                                    >
                                                        <UserX className="h-3.5 w-3.5" />
                                                        Nonaktifkan
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {users.links && (
                    <div className="flex gap-1 border-t border-slate-200 p-4">
                        {users.links.map(
                            (link) =>
                                link.url && (
                                    <Link
                                        key={link.label}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded px-3 py-1 text-xs ${
                                            link.active
                                                ? 'bg-[#2D4C79] text-white'
                                                : 'bg-slate-100 hover:bg-slate-200'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ),
                        )}
                    </div>
                )}
            </div>

            {/* Interactive Confirmation Dialog */}
            <Dialog
                open={userToDeactivate !== null}
                onOpenChange={(open) => {
                    if (!open && !isProcessing) {
                        setUserToDeactivate(null);
                    }
                }}
            >
                <DialogContent className="max-w-md border-slate-200 bg-white p-6 shadow-xl sm:rounded-2xl">
                    <DialogHeader className="flex flex-col items-center sm:items-start">
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <UserX className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Nonaktifkan Akun
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-600">
                            Akun ini tidak dapat digunakan untuk masuk selama
                            nonaktif. Reservasi menunggu yang belum selesai akan
                            ditolak, sedangkan reservasi disetujui yang belum
                            selesai akan dibatalkan dengan alasan akun
                            dinonaktifkan oleh Admin. Histori reservasi dan
                            laporan tetap tersimpan dan Admin dapat mengaktifkan
                            akun kembali.
                        </DialogDescription>
                    </DialogHeader>

                    {userToDeactivate && (
                        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">
                                    Nama Lengkap:
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {userToDeactivate.nama ??
                                        userToDeactivate.name ??
                                        '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Email:</span>
                                <span className="font-mono text-slate-700">
                                    {userToDeactivate.email}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Peran:</span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                        userToDeactivate.role === 'petugas'
                                            ? 'bg-blue-100 text-blue-800'
                                            : userToDeactivate.role === 'admin'
                                              ? 'bg-purple-100 text-purple-800'
                                              : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                >
                                    {roleLabels[userToDeactivate.role] ??
                                        userToDeactivate.role}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4 gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUserToDeactivate(null)}
                            disabled={isProcessing}
                            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDeactivation}
                            disabled={isProcessing}
                            className="rounded-lg bg-rose-600 font-medium text-white shadow-sm transition hover:bg-rose-700"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    Menonaktifkan...
                                </>
                            ) : (
                                <>
                                    <UserX className="mr-1.5 h-4 w-4" />
                                    Ya, Nonaktifkan Akun
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
