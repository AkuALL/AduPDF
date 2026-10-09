type User = {
    id: number;
    name: string;
    nama?: string;
    email: string;
    role?: 'pengguna' | 'petugas' | 'admin';
    institutional_id?: string | null;
    identity_type?: 'nim' | 'nip' | 'no_pegawai' | null;
    whatsapp?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
