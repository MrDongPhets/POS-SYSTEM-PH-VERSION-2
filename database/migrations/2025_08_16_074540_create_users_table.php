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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('set null');
            
            // Personal Information
            $table->string('employee_code', 50)->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email'); // Will be unique per company
            $table->string('phone', 50)->nullable();
            
            // Authentication
            $table->string('password');
            $table->string('role', 50); // company_admin, store_manager, shift_supervisor, cashier, staff
            
            // Permissions and Limits
            $table->boolean('can_override_prices')->default(false);
            $table->boolean('can_apply_discounts')->default(false);
            $table->boolean('can_process_returns')->default(false);
            $table->boolean('can_void_transactions')->default(false);
            $table->decimal('max_discount_percent', 5, 2)->default(0);
            $table->decimal('max_transaction_amount', 15, 2)->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->date('hire_date')->nullable();
            
            // Session Management
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('password_changed_at')->nullable();
            
            // Laravel Auth
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            
            $table->timestamps();
            
            // Add indexes directly in the create statement
            $table->index('company_id');
            $table->index('email');
            $table->index('role');
            $table->index('is_active');
            $table->index('store_id');
            $table->unique(['company_id', 'email'], 'unique_email_per_company');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};