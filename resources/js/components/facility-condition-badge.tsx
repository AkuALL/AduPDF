type FacilityConditionBadgeProps = { condition: string };

const conditionPresentation: Record<
    string,
    { label: string; className: string }
> = {
    aktif: { label: 'Aktif', className: 'bg-emerald-100 text-emerald-800' },
    dalam_perbaikan: {
        label: 'Dalam Perbaikan',
        className: 'bg-amber-100 text-amber-800',
    },
    nonaktif: { label: 'Nonaktif', className: 'bg-slate-100 text-slate-600' },
};

export default function FacilityConditionBadge({
    condition,
}: FacilityConditionBadgeProps) {
    const presentation = conditionPresentation[condition] ?? {
        label: condition.replaceAll('_', ' '),
        className: 'bg-slate-100 text-slate-600',
    };

    return (
        <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${presentation.className}`}
        >
            {presentation.label}
        </span>
    );
}
