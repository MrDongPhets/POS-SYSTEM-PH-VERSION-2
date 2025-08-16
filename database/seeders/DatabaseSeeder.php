<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Super Admin
        DB::table('system_users')->insert([
            'name' => 'Platform Super Admin',
            'email' => 'admin@possystem.com',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // System Settings
        $settings = [
            ['setting_key' => 'app_name', 'setting_value' => 'POS System Philippines', 'description' => 'Application name', 'is_public' => true],
            ['setting_key' => 'app_version', 'setting_value' => '1.0.0', 'description' => 'Application version', 'is_public' => true],
            ['setting_key' => 'maintenance_mode', 'setting_value' => '0', 'description' => 'System maintenance flag', 'is_public' => true],
            ['setting_key' => 'max_trial_days', 'setting_value' => '30', 'description' => 'Trial period in days', 'is_public' => false],
            ['setting_key' => 'default_currency', 'setting_value' => 'PHP', 'description' => 'Default currency', 'is_public' => true],
            ['setting_key' => 'support_email', 'setting_value' => 'support@possystem.com', 'description' => 'Support contact email', 'is_public' => true],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->insert([
                ...$setting,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Subscription Plans
        $plans = [
            [
                'plan_code' => 'trial',
                'plan_name' => 'Free Trial',
                'description' => '30-day free trial with full features',
                'monthly_price' => 0.00,
                'annual_price' => 0.00,
                'max_stores' => 1,
                'max_users' => 3,
                'max_products' => 100,
                'max_monthly_transactions' => 500,
                'storage_limit_gb' => 1,
                'features' => json_encode(['basic_pos', 'inventory', 'reports']),
                'sort_order' => 1,
            ],
            [
                'plan_code' => 'basic',
                'plan_name' => 'Basic Plan',
                'description' => 'Perfect for small businesses',
                'monthly_price' => 1999.00,
                'annual_price' => 19990.00,
                'max_stores' => 1,
                'max_users' => 5,
                'max_products' => 1000,
                'max_monthly_transactions' => 2000,
                'storage_limit_gb' => 2,
                'features' => json_encode(['basic_pos', 'inventory', 'reports', 'email_support']),
                'sort_order' => 2,
            ],
            [
                'plan_code' => 'premium',
                'plan_name' => 'Premium Plan',
                'description' => 'For growing businesses',
                'monthly_price' => 4999.00,
                'annual_price' => 49990.00,
                'max_stores' => 3,
                'max_users' => 15,
                'max_products' => 5000,
                'max_monthly_transactions' => 10000,
                'storage_limit_gb' => 10,
                'features' => json_encode(['advanced_pos', 'multi_store', 'advanced_reports', 'api_access', 'priority_support']),
                'sort_order' => 3,
            ],
            [
                'plan_code' => 'enterprise',
                'plan_name' => 'Enterprise Plan',
                'description' => 'For large businesses',
                'monthly_price' => 14999.00,
                'annual_price' => 149990.00,
                'max_stores' => 10,
                'max_users' => 50,
                'max_products' => 25000,
                'max_monthly_transactions' => 50000,
                'storage_limit_gb' => 50,
                'features' => json_encode(['enterprise_pos', 'unlimited_stores', 'custom_features', 'dedicated_support', 'white_label']),
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            DB::table('subscription_plans')->insert([
                ...$plan,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Sample Demo Company
        $companyId = DB::table('companies')->insertGetId([
            'company_code' => 'DEMO001',
            'company_name' => 'Demo Company',
            'email' => 'demo@company.com',
            'phone' => '+63-2-123-4567',
            'address' => 'Sample Address',
            'city' => 'Manila',
            'province' => 'Metro Manila',
            'postal_code' => '1000',
            'subscription_plan' => 'trial',
            'trial_ends_at' => now()->addDays(30)->toDateString(),
            'is_approved' => true,
            'created_by' => 1,
            'approved_by' => 1,
            'approved_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Sample Store for Demo Company
        $storeId = DB::table('stores')->insertGetId([
            'company_id' => $companyId,
            'store_code' => 'MAIN',
            'store_name' => 'Main Store',
            'address' => 'Sample Address, Sample City',
            'city' => 'Manila',
            'province' => 'Metro Manila',
            'postal_code' => '1000',
            'phone' => '+63-2-123-4567',
            'is_main_store' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Sample Company Admin
        DB::table('users')->insert([
            'company_id' => $companyId,
            'first_name' => 'Demo',
            'last_name' => 'Administrator',
            'email' => 'admin@demo.com',
            'password' => Hash::make('demo123'),
            'role' => 'company_admin',
            'can_override_prices' => true,
            'can_apply_discounts' => true,
            'can_process_returns' => true,
            'can_void_transactions' => true,
            'max_discount_percent' => 50.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "Database seeded successfully!\n";
        echo "Super Admin Login: admin@possystem.com / admin123\n";
        echo "Demo Company Admin: admin@demo.com / demo123\n";
    }
}