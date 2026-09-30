import { Head, Link, router } from '@inertiajs/react';
import { Loader2, Trash2, UserX } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    role: 'petugas' | 'pengguna';
    institutional_id?: string | null;
    identity_type?: 'nim' | 'nip' | 'no_pegawai' | null;
    whatsapp?: string | null;
    created_at: string | null;
};

type Props = {
    users: {
        data: User[];
        links?: { url: string | null; label: string; active: boolean }[];
    };
};

const roleLabels: Record<string, string> = { petugas: 'Petugas', pengguna: 'Pengguna' };
const identityLabels: Record<string, string> = {
    nim: 'NIM',
    nip: 'NIP',
    no_pegawai: 'No. Pegawai',
};

export default function Index({ users }: Props) {
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    function confirmDelete() {
        if (!userToDelete) return;
        router.delete(`/admin/users/${userToDelete.id}`, {
            preserveScroll: true,
            onStart: () => setIsDeleting(true),
            onFinish: () => {
                setIsDeleting(false);
                setUserToDelete(null);
            },
        });
    }

    return (
        <AdminLayout>
            <Head title="Kelola Akun Pengguna & Petugas — AduPDF" />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Kelola Akun</h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Daftar seluruh akun Petugas dan Pengguna aktif.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/users/pengguna/create"
                            className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 transition"
                        >
                            + Buat Pengguna
                        </Link>
                        <Link
                            href="/admin/users/petugas/create"
                            className="rounded-md bg-[#2D4C79] px-3 py-2 text-xs font-medium text-white hover:bg-[#1e3454] transition"
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
                                <th className="px-6 py-3">Identitas Institusional</th>
                                <th className="px-6 py-3">Tanggal Dibuat</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-sm text-slate-500"
                                    >
                                        Belum ada akun Petugas atau Pengguna terdaftar.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50 transition"
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
                                                        : 'bg-emerald-100 text-emerald-800'
                                                }`}
                                            >
                                                {roleLabels[user.role] ?? user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {user.institutional_id ? (
                                                <div>
                                                    <span className="font-semibold text-slate-800">
                                                        {identityLabels[user.identity_type ?? ''] ?? user.identity_type}:
                                                    </span>{' '}
                                                    <span className="text-slate-600">{user.institutional_id}</span>
                                                    {user.whatsapp && (
                                                        <div className="text-[11px] text-slate-500 mt-0.5">
                                                            WA: {user.whatsapp}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="italic text-slate-400">Belum diisi</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {user.created_at
                                                ? `${new Date(user.created_at).toLocaleString('id-ID')} WIB`
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setUserToDelete(user)}
                                                className="inline-flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Hapus
                                            </button>
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
                                            link.active ? 'bg-[#2D4C79] text-white' : 'bg-slate-100 hover:bg-slate-200'
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
                open={userToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setUserToDelete(null);
                    }
                }}
            >
                <DialogContent className="max-w-md border-slate-200 bg-white p-6 shadow-xl sm:rounded-2xl">
                    <DialogHeader className="flex flex-col items-center sm:items-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
                            <UserX className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900">
                            Nonaktifkan Akun
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-600">
                            Apakah Anda yakin ingin menonaktifkan akun ini? Pengguna tidak akan dapat masuk kembali ke sistem, namun seluruh riwayat data transaksi dan aktivitas tetap tersimpan dengan aman.
                        </DialogDescription>
                    </DialogHeader>

                    {userToDelete && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Nama Lengkap:</span>
                                <span className="font-semibold text-slate-900">
                                    {userToDelete.nama ?? userToDelete.name ?? '-'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500">Email:</span>
                                <span className="font-mono text-slate-700">{userToDelete.email}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Peran:</span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                        userToDelete.role === 'petugas'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                >
                                    {roleLabels[userToDelete.role] ?? userToDelete.role}
                                </span>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-4 gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUserToDelete(null)}
                            disabled={isDeleting}
                            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-sm transition"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    Menonaktifkan...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-1.5 h-4 w-4" />
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
