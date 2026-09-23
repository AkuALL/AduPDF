export type User = {
    id: number;
    name: string;
    nama?: string;
    email: string;
    role?: 'pengguna' | 'petugas' | 'admin';
    institutional_id?: string | null;
    identity_type?: 'nim' | 'nip' | 'no_pegawai' | null;
    whatsapp?: string | null;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
