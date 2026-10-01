<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'variant' => 'primary', // primary, secondary, ghost, destructive, secondary-destructive
    'size' => 'md', // sm, md, lg
    'as' => 'button', // button, a
    'href' => null,
    'type' => 'button',
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
    'variant' => 'primary', // primary, secondary, ghost, destructive, secondary-destructive
    'size' => 'md', // sm, md, lg
    'as' => 'button', // button, a
    'href' => null,
    'type' => 'button',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<?php
    $variantClasses = match($variant) {
        'secondary' => 'bg-white text-[#111827] border border-[#D0D5DD] hover:bg-[#F3F5F7] active:bg-[#EEF1F4]',
        'ghost' => 'bg-transparent text-[#667085] hover:bg-[#F3F5F7] hover:text-[#111827] active:bg-[#EEF1F4]',
        'destructive', 'danger' => 'bg-[#B42318] text-white border border-transparent hover:bg-[#912018] active:bg-[#7a1b14]',
        'secondary-destructive' => 'bg-white text-[#B42318] border border-[#F2B8B5] hover:bg-[#FDECEC] active:bg-[#fad4d4]',
        default => 'bg-[#2D4C79] text-white border border-transparent hover:bg-[#243E63] active:bg-[#1C3150]',
    };

    $sizeClasses = match($size) {
        'sm' => 'px-3 py-1.5 text-xs h-8',
        'lg' => 'px-5 py-2.5 text-base h-11',
        default => 'px-4 py-2 text-sm h-10',
    };

    $baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-[#2D4C79]/20 disabled:opacity-50 disabled:cursor-not-allowed select-none ' . $variantClasses . ' ' . $sizeClasses;
?>

<?php if($as === 'a' || $href): ?>
    <a href="<?php echo e($href); ?>" <?php echo e($attributes->merge(['class' => $baseClasses])); ?>>
        <?php echo e($slot); ?>

    </a>
<?php else: ?>
    <button type="<?php echo e($type); ?>" <?php echo e($attributes->merge(['class' => $baseClasses])); ?>>
        <?php echo e($slot); ?>

    </button>
<?php endif; ?>
<?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\resources\views/components/button.blade.php ENDPATH**/ ?>