<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('store_code', 50);
            $table->string('store_name');
            
            // Location
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->string('country', 100)->default('Philippines');
            
            // Contact
            $table->string('phone', 50)->nullable();
            $table->string('email')->nullable();
            
            // Business Details
            $table->string('manager_name')->nullable();
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->json('operating_days')->nullable(); // ["monday", "tuesday", ...]
            
            // Settings
            $table->boolean('is_active')->default(true);
            $table->boolean('is_main_store')->default(false);
            $table->json('store_settings')->nullable(); // Store-specific settings
            
            $table->timestamps();
            
            // Add indexes directly in the create statement
            $table->index('company_id');
            $table->index('is_active');
            $table->index('is_main_store');
            $table->unique(['company_id', 'store_code'], 'unique_store_code_per_company');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};