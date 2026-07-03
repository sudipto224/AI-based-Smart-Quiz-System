

<?php $__env->startSection('title', 'My Courses'); ?>

<?php $__env->startSection('content'); ?>
<div class="container mx-auto">
    <div class="flex justify-between items-center mb-4">
        <h1 style="font-size:24px; font-weight:bold;">📚 My Courses</h1>
        <a href="<?php echo e(route('teacher.courses.create')); ?>" style="display:inline-block; background-color:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">+ Create New Course</a>
    </div>

    <?php if(session('success')): ?>
        <div style="background-color:#d1fae5; color:#065f46; padding:12px; border-radius:8px; margin-bottom:16px;">
            <?php echo e(session('success')); ?>

        </div>
    <?php endif; ?>

    <?php if($courses->isEmpty()): ?>
        <p style="color:#6b7280;">No courses found. Click "Create New Course" to add one.</p>
    <?php else: ?>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <?php $__currentLoopData = $courses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $course): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div style="border:1px solid #e5e7eb; padding:16px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="font-size:18px; font-weight:600;"><?php echo e($course->name); ?></h2>
                <p style="color:#4b5563;"><?php echo e($course->description); ?></p>
                <p style="font-size:14px; color:#6b7280;">⏱️ <?php echo e($course->time_per_question); ?> sec per question</p>
                <div style="margin-top:8px; display:flex; gap:8px;">
                    <a href="<?php echo e(route('teacher.courses.edit', $course)); ?>" style="color:#2563eb; text-decoration:underline;">Edit</a>
                    <form action="<?php echo e(route('teacher.courses.destroy', $course)); ?>" method="POST" style="display:inline;">
                        <?php echo csrf_field(); ?> <?php echo method_field('DELETE'); ?>
                        <button type="submit" style="color:#dc2626; text-decoration:underline; background:none; border:none; cursor:pointer;" onclick="return confirm('Delete this course?')">Delete</button>
                    </form>
                    <a href="<?php echo e(route('teacher.questions', $course->id)); ?>" style="color:#16a34a; text-decoration:underline;">Questions</a>
                </div>
            </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
    <?php endif; ?>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\ai-based-smart-quiz\resources\views/teacher/courses/index.blade.php ENDPATH**/ ?>