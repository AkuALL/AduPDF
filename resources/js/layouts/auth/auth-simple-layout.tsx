import { Head, Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div
            className="flex min-h-svh items-center justify-center bg-[#F7F8FA] px-4 py-8 text-[#111827] sm:px-6 lg:px-10 [--accent:#F3F5F7] [--accent-foreground:#111827] [--background:#FFFFFF] [--border:#E5E7EB] [--destructive:#B42318] [--foreground:#111827] [--input:#D0D5DD] [--muted:#F3F5F7] [--muted-foreground:#667085] [--primary:#2D4C79] [--primary-foreground:#FFFFFF] [--ring:#2D4C79] [&_input]:h-10 [&_input]:rounded-md [&_input]:bg-white [&_input:focus-visible]:border-[#2D4C79] [&_input:focus-visible]:ring-[#2D4C79]/20 [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#344054] [&_main_a]:text-[#2D4C79] [&_[data-slot=button]]:h-10 [&_[data-slot=button]]:rounded-md [&_[data-slot=button]]:font-semibold [&_[data-slot=button].border]:bg-white [&_[data-slot=button].border]:text-[#2D4C79]"
            style={{
                fontFamily:
                    'Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
        >
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
                />
            </Head>

            <div className="w-full max-w-md">
                <Link
                    href={home()}
                    className="mb-8 inline-flex items-center gap-3 text-[#111827]"
                >
                    <span className="flex size-10 items-center justify-center rounded-md bg-[#2D4C79] text-white">
                        <AppLogoIcon className="size-6 fill-current" />
                    </span>
                    <span>
                        <span className="block text-base font-bold">AduPDF</span>
                        <span className="block text-xs text-[#667085]">
                            Layanan fasilitas kampus
                        </span>
                    </span>
                </Link>

                <main className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:p-8">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-2xl font-semibold tracking-[-0.02em]">
                            {title}
                        </h1>
                        <p className="text-sm leading-6 text-[#667085]">
                            {description}
                        </p>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}
