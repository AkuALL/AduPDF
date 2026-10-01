<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'title' => null,
    'header' => null,
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
    'header' => null,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars, $__key, $__value); ?>

<!DOCTYPE html>
<html lang="id" class="h-full bg-[#F7F8FA]">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title><?php echo e(isset($title) && !empty($title) ? $title . ' — AduPDF' : 'AduPDF — Sistem Reservasi & Pelaporan Fasilitas Kampus'); ?></title>

    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN Configured for AduPDF (Quiet Campus Utility) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '#2D4C79',
                            hover: '#243E63',
                            active: '#1C3150',
                            soft: '#E9EEF5',
                            'soft-hover': '#DCE4EE',
                            dark: '#1e3454',
                            light: '#41669d',
                        },
                        surface: {
                            DEFAULT: '#FFFFFF',
                            subtle: '#F3F5F7',
                            muted: '#EEF1F4',
                            inverse: '#1F2937',
                        },
                        semantic: {
                            success: '#16794A',
                            'success-soft': '#EAF7F0',
                            'success-border': '#B7E2CB',
                            warning: '#A15C00',
                            'warning-soft': '#FFF5E6',
                            'warning-border': '#F5D6A6',
                            info: '#2463A7',
                            'info-soft': '#EBF3FB',
                            'info-border': '#BFD6ED',
                            danger: '#B42318',
                            'danger-hover': '#912018',
                            'danger-soft': '#FDECEC',
                            'danger-border': '#F2B8B5',
                            repair: '#B54708',
                            'repair-soft': '#FFF0E8',
                            'repair-border': '#F5C6A7',
                            neutral: '#5D6673',
                            'neutral-soft': '#F0F2F4',
                            'neutral-border': '#D7DBE0',
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <style>
        body {
            font-family: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #F7F8FA;
            color: #111827;
        }
    </style>

    <?php echo $__env->yieldPushContent('styles'); ?>
</head>
<body class="min-h-full flex flex-col text-[#111827] bg-[#F7F8FA] antialiased">
    <!-- Shared Top Navigation Shell -->
    <?php echo $__env->make('layouts.navigation', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <!-- Optional Page Header / Breadcrumbs -->
    <?php if(isset($header) && !empty(trim((string)$header))): ?>
        <div class="bg-white border-b border-[#E5E7EB] py-5 shadow-2xs">
            <div class="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <?php echo e($header); ?>

            </div>
        </div>
    <?php endif; ?>

    <!-- Main Content Container -->
    <main class="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Global Flash Messages Notification Banner -->
        <?php if (isset($component)) { $__componentOriginal5b09c79149dfb771c232996af5f9dae4 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal5b09c79149dfb771c232996af5f9dae4 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.flash-messages','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('flash-messages'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal5b09c79149dfb771c232996af5f9dae4)): ?>
<?php $attributes = $__attributesOriginal5b09c79149dfb771c232996af5f9dae4; ?>
<?php unset($__attributesOriginal5b09c79149dfb771c232996af5f9dae4); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal5b09c79149dfb771c232996af5f9dae4)): ?>
<?php $component = $__componentOriginal5b09c79149dfb771c232996af5f9dae4; ?>
<?php unset($__componentOriginal5b09c79149dfb771c232996af5f9dae4); ?>
<?php endif; ?>

        <!-- Page Body Content -->
        <?php echo e($slot); ?>

    </main>

    <!-- Institutional Footer -->
    <footer class="bg-white border-t border-[#E5E7EB] py-6 mt-auto">
        <div class="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
            <div class="flex items-center gap-2">
                <span class="font-bold text-[#2D4C79]">AduPDF</span>
                <span>—</span>
                <span>Sistem Reservasi & Pelaporan Fasilitas Kampus</span>
            </div>
            <div>
                &copy; <?php echo e(date('Y')); ?> Tim Pengembang AduPDF. Hak Cipta Dilindungi.
            </div>
        </div>
    </footer>

    <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\AduPDF\resources\views/components/layouts/app.blade.php ENDPATH**/ ?>