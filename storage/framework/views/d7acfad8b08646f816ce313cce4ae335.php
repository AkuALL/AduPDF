<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'id' => 'confirm-modal',
    'title' => 'Konfirmasi Tindakan',
    'resource' => null,
    'consequence' => null,
    'confirmText' => 'Lanjutkan',
    'cancelText' => 'Batal',
    'variant' => 'destructive', // destructive or primary
    'action' => '#',
    'method' => 'POST',
]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter(([
    'id' => 'confirm-modal',
    'title' => 'Konfirmasi Tindakan',
    'resource' => null,
    'consequence' => null,
    'confirmText' => 'Lanjutkan',
    'cancelText' => 'Batal',
    'variant' => 'destructive', // destructive or primary
    'action' => '#',
    'method' => 'POST',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<div
    id="<?php echo e($id); ?>"
    class="fixed inset-0 z-50 hidden overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity"
    role="dialog"
    aria-modal="true"
    aria-labelledby="<?php echo e($id); ?>-title"
>
    <div class="relative bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] text-left transform transition-all">
        <div class="flex items-start gap-4">
            <div class="<?php echo \Illuminate\Support\Arr::toCssClasses([
                'shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                'bg-[#FDECEC] text-[#B42318]' => $variant === 'destructive',
                'bg-[#E9EEF5] text-[#2D4C79]' => $variant !== 'destructive',
            ]); ?>">
                <?php if($variant === 'destructive'): ?>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                <?php else: ?>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                <?php endif; ?>
            </div>

            <div class="flex-1">
                <h3 id="<?php echo e($id); ?>-title" class="text-base font-semibold text-[#111827]">
                    <?php echo e($title); ?>

                </h3>

                <?php if($resource): ?>
                    <p class="text-sm font-medium text-[#2D4C79] mt-1 bg-[#E9EEF5] px-2.5 py-1 rounded inline-block">
                        <?php echo e($resource); ?>

                    </p>
                <?php endif; ?>

                <div class="text-sm text-[#667085] mt-2 leading-relaxed">
                    <?php if($consequence): ?>
                        <p><?php echo e($consequence); ?></p>
                    <?php endif; ?>
                    <?php echo e($slot); ?>

                </div>
            </div>
        </div>

        <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-[#E5E7EB]">
            <button
                type="button"
                onclick="document.getElementById('<?php echo e($id); ?>').classList.add('hidden')"
                class="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-[#111827] bg-white border border-[#D0D5DD] hover:bg-[#F3F5F7] rounded-md transition"
            >
                <?php echo e($cancelText); ?>

            </button>

            <form action="<?php echo e($action); ?>" method="POST" class="inline w-full sm:w-auto">
                <?php echo csrf_field(); ?>
                <?php if(!in_array(strtoupper($method), ['POST', 'GET'])): ?>
                    <?php echo method_field($method); ?>
                <?php endif; ?>
                <button
                    type="submit"
                    class="<?php echo \Illuminate\Support\Arr::toCssClasses([
                        'w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-md transition text-white',
                        'bg-[#B42318] hover:bg-[#912018] active:bg-[#7a1b14]' => $variant === 'destructive',
                        'bg-[#2D4C79] hover:bg-[#243E63] active:bg-[#1C3150]' => $variant !== 'destructive',
                    ]); ?>"
                >
                    <?php echo e($confirmText); ?>

                </button>
            </form>
        </div>
    </div>
</div>
<?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\resources\views/components/modal-confirm.blade.php ENDPATH**/ ?>