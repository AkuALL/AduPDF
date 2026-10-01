<?php if (isset($component)) { $__componentOriginal7ef94aa801410a663a471c55b223c943 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal7ef94aa801410a663a471c55b223c943 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.modal-confirm','data' => ['id' => 'modal-test','title' => 'Hapus Reservasi','resource' => 'Lab Komputer','consequence' => 'Tindakan ini tidak dapat diurungkan.','action' => '/test']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('modal-confirm'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['id' => 'modal-test','title' => 'Hapus Reservasi','resource' => 'Lab Komputer','consequence' => 'Tindakan ini tidak dapat diurungkan.','action' => '/test']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal7ef94aa801410a663a471c55b223c943)): ?>
<?php $attributes = $__attributesOriginal7ef94aa801410a663a471c55b223c943; ?>
<?php unset($__attributesOriginal7ef94aa801410a663a471c55b223c943); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal7ef94aa801410a663a471c55b223c943)): ?>
<?php $component = $__componentOriginal7ef94aa801410a663a471c55b223c943; ?>
<?php unset($__componentOriginal7ef94aa801410a663a471c55b223c943); ?>
<?php endif; ?><?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\AduPDF\storage\framework\views/d9d1ae41fe0a4cacc138fcdfe48f3e8b.blade.php ENDPATH**/ ?>