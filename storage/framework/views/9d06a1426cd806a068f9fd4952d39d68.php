<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'title' => null,
    'subtitle' => null,
    'headerActions' => null,
    'footer' => null,
    'padding' => true,
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
    'title' => null,
    'subtitle' => null,
    'headerActions' => null,
    'footer' => null,
    'padding' => true,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<div <?php echo e($attributes->merge(['class' => 'bg-white rounded-lg border border-[#E5E7EB] shadow-xs overflow-hidden'])); ?>>
    <?php if($title || $subtitle || isset($header) || isset($headerActions)): ?>
        <div class="px-5 py-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <?php if(isset($header)): ?>
                <?php echo e($header); ?>

            <?php else: ?>
                <div>
                    <?php if($title): ?>
                        <h3 class="text-base font-semibold text-[#111827]"><?php echo e($title); ?></h3>
                    <?php endif; ?>
                    <?php if($subtitle): ?>
                        <p class="text-xs text-[#667085] mt-0.5"><?php echo e($subtitle); ?></p>
                    <?php endif; ?>
                </div>
                <?php if(isset($headerActions)): ?>
                    <div class="flex items-center gap-2">
                        <?php echo e($headerActions); ?>

                    </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="<?php echo \Illuminate\Support\Arr::toCssClasses(['p-5' => $padding]); ?>">
        <?php echo e($slot); ?>

    </div>

    <?php if($footer || isset($footerSlot)): ?>
        <div class="px-5 py-3.5 bg-[#F7F8FA] border-t border-[#E5E7EB] text-xs text-[#667085]">
            <?php echo e($footer ?? $footerSlot); ?>

        </div>
    <?php endif; ?>
</div>
<?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\resources\views/components/card.blade.php ENDPATH**/ ?>