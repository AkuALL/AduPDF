<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'type' => 'info',
    'title' => null,
    'message' => null,
    'dismissible' => true,
    'icon' => true,
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
    'type' => 'info',
    'title' => null,
    'message' => null,
    'dismissible' => true,
    'icon' => true,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<?php
    $normalizedType = match(strtolower($type)) {
        'success', 'berhasil' => 'success',
        'warning', 'peringatan' => 'warning',
        'danger', 'error', 'gagal' => 'danger',
        default => 'info',
    };

    $config = match($normalizedType) {
        'success' => [
            'wrapper' => 'bg-[#EAF7F0] border-[#B7E2CB] text-[#16794A]',
            'iconColor' => 'text-[#16794A]',
            'defaultTitle' => 'Berhasil',
        ],
        'warning' => [
            'wrapper' => 'bg-[#FFF5E6] border-[#F5D6A6] text-[#A15C00]',
            'iconColor' => 'text-[#A15C00]',
            'defaultTitle' => 'Perhatian',
        ],
        'danger' => [
            'wrapper' => 'bg-[#FDECEC] border-[#F2B8B5] text-[#B42318]',
            'iconColor' => 'text-[#B42318]',
            'defaultTitle' => 'Terjadi Kesalahan',
        ],
        'info' => [
            'wrapper' => 'bg-[#EBF3FB] border-[#BFD6ED] text-[#2463A7]',
            'iconColor' => 'text-[#2463A7]',
            'defaultTitle' => 'Informasi',
        ],
    };
?>

<div
    x-data="{ show: true }"
    x-show="show"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    role="alert"
    <?php echo e($attributes->merge(['class' => 'relative flex items-start gap-3 p-4 rounded-lg border text-sm transition-all duration-200 ' . $config['wrapper']])); ?>

    data-alert-type="<?php echo e($normalizedType); ?>"
>
    <?php if($icon): ?>
        <div class="shrink-0 mt-0.5 <?php echo e($config['iconColor']); ?>">
            <?php if($normalizedType === 'success'): ?>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            <?php elseif($normalizedType === 'warning'): ?>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            <?php elseif($normalizedType === 'danger'): ?>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            <?php else: ?>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <div class="flex-1 pr-6">
        <?php if($title): ?>
            <h4 class="font-semibold text-sm mb-1"><?php echo e($title); ?></h4>
        <?php endif; ?>
        <div class="leading-relaxed">
            <?php if($message): ?>
                <?php echo e($message); ?>

            <?php else: ?>
                <?php echo e($slot); ?>

            <?php endif; ?>
        </div>
    </div>

    <?php if($dismissible): ?>
        <button
            type="button"
            onclick="this.closest('[role=\'alert\']').remove()"
            @click="show = false"
            class="absolute top-3 right-3 p-1 rounded hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition focus:outline-none"
            aria-label="Tutup notifikasi"
        >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    <?php endif; ?>
</div>
<?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\AduPDF\resources\views/components/alert.blade.php ENDPATH**/ ?>