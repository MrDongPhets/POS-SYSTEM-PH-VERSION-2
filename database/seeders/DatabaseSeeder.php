<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\SystemUser;
use App\Models\Company;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = SystemUser::create([
            'name' => 'Super Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'is_active' => true,
        ]);

        // Create a test company (pre-approved for testing)
        $testCompany = Company::create([
            'company_code' => 'TEST001',
            'company_name' => 'Test Restaurant',
            'email' => 'test@company.com',
            'phone' => '+639123456789',
            'address' => '123 Test Street',
            'city' => 'Manila',
            'province' => 'Metro Manila',
            'subscription_plan' => 'trial',
            'trial_ends_at' => now()->addDays(30),
            'max_stores' => 3,
            'max_users' => 10,
            'is_active' => true,
            'is_approved' => true, // Pre-approved for testing
            'created_by' => $superAdmin->id,
            'approved_by' => $superAdmin->id,
            'approved_at' => now(),
        ]);

        // Create company admin user
        User::create([
            'company_id' => $testCompany->id,
            'first_name' => 'Company',
            'last_name' => 'Admin',
            'email' => 'company@test.com',
            'password' => Hash::make('password'),
            'role' => 'company_admin',
            'can_override_prices' => true,
            'can_apply_discounts' => true,
            'can_process_returns' => true,
            'can_void_transactions' => true,
            'max_discount_percent' => 50.00,
            'is_active' => true,
        ]);

        // Update company user count
        $testCompany->increment('current_user_count');

        $this->command->info('Test data created:');
        $this->command->info('Super Admin: admin@test.com / password');
        $this->command->info('Company Admin: company@test.com / password');
    }
}