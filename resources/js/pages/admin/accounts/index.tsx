import { Head, Link, router } from '@inertiajs/react';
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
    function handleDelete(user: User) {
        const displayName = user.nama || user.name || user.email;
        if (
            window.confirm(
                `Apakah Anda yakin ingin menonaktifkan akun "${displayName}"? Akun yang dihapus (soft-delete) tidak akan dapat masuk kembali, namun seluruh riwayat data transaksi tetap tersimpan di sistem.`
            )
        ) {
            router.delete(`/admin/users/${user.id}`);
        }
    }

    return (
        <AdminLayout>
            <Head title="Kelola Akun Pengguna & Petugas — AduPDF" />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Kelola Akun</h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Daftar seluruh akun Petugas dan Pengguna aktif. Admin dapat membuat akun Petugas/Pengguna serta menonaktifkan akun (soft-delete).
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
                                                onClick={() => handleDelete(user)}
                                                className="rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition"
                                            >
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
        </AdminLayout>
    );
}
