import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

type User = {
    id: number;
    nama?: string;
    name?: string;
    email: string;
    role: 'petugas' | 'pengguna';
    verification_status: 'pending' | 'approved' | 'rejected';
    created_at: string | null;
};

type Props = {
    users: {
        data: User[];
        links?: { url: string | null; label: string; active: boolean }[];
    };
};

const roleLabels = { petugas: 'Petugas', pengguna: 'Pengguna' };
const statusLabels = {
    pending: 'Menunggu Verifikasi',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

export default function Index({ users }: Props) {
    return (
        <AdminLayout>
            <Head title="Kelola Akun" />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Daftar Akun</h1>
                        <p className="mt-1 text-xs text-slate-500">
                            Akun Petugas dan Pengguna.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/admin/users/pengguna/create"
                            className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-medium"
                        >
                            + Buat Pengguna
                        </Link>
                        <Link
                            href="/admin/users/petugas/create"
                            className="rounded-md bg-[#2D4C79] px-3 py-2 text-xs font-medium text-white"
                        >
                            + Buat Petugas
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Nama</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Peran</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Tanggal Daftar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-sm text-slate-500"
                                    >
                                        Belum ada akun Petugas atau Pengguna.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {user.nama ?? user.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {roleLabels[user.role]}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded-full border bg-slate-100 px-2.5 py-1 text-xs font-medium">
                                                {
                                                    statusLabels[
                                                        user.verification_status
                                                    ]
                                                }
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {user.created_at
                                                ? `${new Date(user.created_at).toLocaleString('id-ID')} WIB`
                                                : '-'}
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
                                        className={`rounded px-3 py-1 text-xs ${link.active ? 'bg-[#2D4C79] text-white' : 'bg-slate-100'}`}
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
