<?php $__env->startSection('content'); ?>
<div class="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
    <div class="bg-[#2D4C79] text-white p-6 text-center">
        <h1 class="text-2xl font-bold">Masuk ke AduPDF</h1>
        <p class="text-xs text-slate-200 mt-1">Sistem Reservasi & Pelaporan Fasilitas Kampus</p>
    </div>

    <div class="p-6">
        <?php if(session('status')): ?>
            <div class="mb-4 bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-emerald-800 text-sm">
                <?php echo e(session('status')); ?>

            </div>
        <?php endif; ?>

        <?php if($errors->any()): ?>
            <div class="mb-4 bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-rose-800 text-sm">
                <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div><?php echo e($error); ?></div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="<?php echo e(route('login')); ?>" class="space-y-4">
            <?php echo csrf_field(); ?>

            <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Alamat Email</label>
                <input id="email" type="email" name="email" value="<?php echo e(old('email')); ?>" required autofocus
                       class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4C79] focus:border-transparent text-sm <?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> border-rose-500 <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>"
                       placeholder="nama@kampus.ac.id">
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Kata Sandi</label>
                <div class="relative">
                    <input id="password" type="password" name="password" required
                           class="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D4C79] focus:border-transparent text-sm <?php $__errorArgs = ['password'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> border-rose-500 <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?>"
                           placeholder="••••••••">
                    <button type="button" onclick="togglePassword('password', this)" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none" title="Lihat/Sembunyikan kata sandi" aria-label="Lihat kata sandi">
                        <svg class="h-5 w-5 eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <svg class="h-5 w-5 eye-off-icon hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex items-center justify-between text-sm">
                <label class="flex items-center text-slate-600">
                    <input type="checkbox" name="remember" class="rounded border-slate-300 text-[#2D4C79] focus:ring-[#2D4C79]">
                    <span class="ml-2 text-xs">Ingat saya</span>
                </label>
            </div>

            <div>
                <button type="submit"
                        class="w-full bg-[#2D4C79] hover:bg-[#1e3454] text-white font-medium py-2.5 px-4 rounded-md transition duration-150 ease-in-out shadow-sm text-sm">
                    Masuk
                </button>
            </div>
        </form>

        <div class="mt-6 pt-6 border-t border-slate-200 text-center text-xs text-slate-600">
            Belum memiliki akun Pengguna?
            <a href="<?php echo e(route('register')); ?>" class="text-[#2D4C79] font-semibold hover:underline ml-1">
                Daftar sekarang
            </a>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.auth', ['title' => 'Masuk — AduPDF'], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\Informatics\SEMESTER 5\PPK\TUBES PPK\AduPDF\AduPDF\resources\views/auth/login.blade.php ENDPATH**/ ?>