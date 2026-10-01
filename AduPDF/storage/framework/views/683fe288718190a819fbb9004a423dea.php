<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'title' => 'Belum ada data',
    'description' => null,
    'actionText' => null,
    'actionUrl' => null,
    'actionMethod' => 'GET',
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
    'title' => 'Belum ada data',
    'description' => null,
    'actionText' => null,
    'actionUrl' => null,
    'actionMethod' => 'GET',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<div <?php echo e($attributes->merge(['class' => 'bg-white rounded-lg border border-[#E5E7EB] p-8 sm:p-12 text-center'])); ?>>
    <div class="mx-auto w-12 h-12 rounded-full bg-[#F3F5F7] border border-[#E5E7EB] flex items-center justify-center text-[#667085] mb-4">
        <?php if(isset($icon)): ?>
            <?php echo e($icon); ?>

        <?php else: ?>
            <svg class="w-6 h-6 text-[#98A2B3]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
        <?php endif; ?>
    </div>

    <h3 class="text-base font-semibold text-[#111827] mb-1">
        <?php echo e($title); ?>

    </h3>

    <?php if($description || isset($slot) && trim($slot)): ?>
        <p class="text-sm text-[#667085] max-w-md mx-auto mb-6 leading-relaxed">
            <?php echo e($description ?? $slot); ?>

        </p>
    <?php endif; ?>

    <?php if($actionText && $actionUrl): ?>
        <div>
            <?php if(strtoupper($actionMethod) === 'GET'): ?>
                <a
                    href="<?php echo e($actionUrl); ?>"
                    class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#2D4C79] hover:bg-[#243E63] active:bg-[#1C3150] rounded-md transition shadow-xs"
                >
                    <?php echo e($actionText); ?>

                </a>
            <?php else: ?>
                <form action="<?php echo e($actionUrl); ?>" method="POST" class="inline">
                    <?php echo csrf_field(); ?>
                    <?php if(!in_array(strtoupper($actionMethod), ['POST', 'GET'])): ?>
                        <?php echo method_field($actionMethod); ?>
                    <?php endif; ?>
                    <button
                        type="submit"
                        class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#2D4C79] hover:bg-[#243E63] active:bg-[#1C3150] rounded-md transition shadow-xs"
                    >
                        <?php echo e($actionText); ?>

                    </button>
                </form>
            <?php endif; ?>
        </div>
    <?php elseif(isset($action)): ?>
        <div class="mt-4">
            <?php echo e($action); ?>

        </div>
    <?php endif; ?>
</div>
<?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\AduPDF\resources\views/components/empty-state.blade.php ENDPATH**/ ?>