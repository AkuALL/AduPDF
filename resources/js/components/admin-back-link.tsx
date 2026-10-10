import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

type Props = { href: string; children: React.ReactNode };

export default function AdminBackLink({ href, children }: Props) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs font-semibold text-[#344054] shadow-sm transition hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D4C79]/20"
        >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            {children}
        </Link>
    );
}
