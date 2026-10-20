
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // Teacher approval status:
            // null     = Normal Student
            // pending  = Waiting for Admin Approval
            // approved = Approved Teacher
            // rejected = Rejected Teacher Request
            // revoked  = Teacher Access Revoked

            $table->string('teacher_status', 20)
                ->nullable()
                ->after('is_teacher');

            // Admin role flag.
            // All existing users remain non-admin.
            $table->boolean('is_admin')
                ->default(false)
                ->after('teacher_status');

        });

        /*
         * Preserve existing teachers.
         *
         * All users who already have is_teacher = 1
         * will be marked as approved.
         *
         * Their IDs, courses, questions, quiz attempts,
         * and other existing data remain unchanged.
         *
         * IMPORTANT:
         * Verify existing teacher identities before
         * running this migration.
         */

        DB::table('users')
            ->where('is_teacher', 1)
            ->update([
                'teacher_status' => 'approved',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn([
                'teacher_status',
                'is_admin',
            ]);

        });
    }
};
