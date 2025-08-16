<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('company_code', 50)->unique();
            $table->string('company_name');
            $table->string('email')->unique();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->default('Philippines');
            
            // Business Registration
            $table->string('business_registration_number', 100)->nullable();
            $table->string('tin', 50)->nullable(); // Tax Identification Number
            $table->string('business_permit_number', 100)->nullable();
            
            // Subscription
            $table->string('subscription_plan', 50)->default('trial');
            $table->string('subscription_status', 50)->default('active'); // active, suspended, expired, cancelled
            $table->date('trial_ends_at')->nullable();
            $table->date('subscription_ends_at')->nullable();
            
            // Limits
            $table->integer('max_stores')->default(1);
            $table->integer('max_users')->default(5);
            $table->integer('current_store_count')->default(0);
            $table->integer('current_user_count')->default(0);
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_approved')->default(false); // Requires admin approval
            $table->text('approval_notes')->nullable();
            
            // Laravel Auth
            $table->timestamp('email_verified_at')->nullable();
            
            // Audit
            $table->foreignId('created_by')->nullable()->constrained('system_users')->onDelete('set null');
            $table->foreignId('approved_by')->nullable()->constrained('system_users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            
            $table->timestamps();
            
            // Add indexes directly in the create statement
            $table->index('company_code');
            $table->index('email');
            $table->index('subscription_plan');
            $table->index('subscription_status');
            $table->index('is_active');
            $table->index('is_approved');
            $table->index(['subscription_status', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};