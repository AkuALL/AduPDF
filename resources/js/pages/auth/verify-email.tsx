import { Form, Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AuthPageLayout from '@/layouts/auth-page-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthPageLayout>
            <Head title="Verifikasi Email — AduPDF" />
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-lg">
                <h1 className="text-xl font-bold text-slate-900">
                    Verifikasi Email
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Verifikasi email Anda sebelum mengajukan reservasi atau
                    laporan kerusakan.
                </p>
                {status === 'verification-link-sent' && (
                    <p role="status" className="mt-4 text-sm text-emerald-700">
                        Tautan verifikasi telah dikirim ke alamat email Anda.
                    </p>
                )}
                <Form
                    action="/email/verification-notification"
                    method="post"
                    className="mt-6 space-y-4"
                >
                    {({ processing }) => (
                        <>
                            <Button
                                disabled={processing}
                                className="w-full bg-[#2D4C79] text-white hover:bg-[#1e3454]"
                            >
                                Kirim ulang email verifikasi
                            </Button>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-sm text-slate-600 underline"
                            >
                                Keluar
                            </Link>
                        </>
                    )}
                </Form>
            </div>
        </AuthPageLayout>
    );
}
