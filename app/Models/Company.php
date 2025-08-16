<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'company_code',
        'company_name',
        'email',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'business_registration_number',
        'tin',
        'business_permit_number',
        'subscription_plan',
        'subscription_status',
        'trial_ends_at',
        'subscription_ends_at',
        'max_stores',
        'max_users',
        'current_store_count',
        'current_user_count',
        'is_active',
        'is_approved',
        'approval_notes',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'trial_ends_at' => 'date',
        'subscription_ends_at' => 'date',
        'approved_at' => 'datetime',
        'is_active' => 'boolean',
        'is_approved' => 'boolean',
        'current_store_count' => 'integer',
        'current_user_count' => 'integer',
        'max_stores' => 'integer',
        'max_users' => 'integer',
    ];

    /**
     * Users belonging to this company.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Stores belonging to this company.
     */
    public function stores()
    {
        return $this->hasMany(Store::class);
    }

    /**
     * System user who created this company.
     */
    public function createdBy()
    {
        return $this->belongsTo(SystemUser::class, 'created_by');
    }

    /**
     * System user who approved this company.
     */
    public function approvedBy()
    {
        return $this->belongsTo(SystemUser::class, 'approved_by');
    }

    /**
     * Subscription plan details.
     */
    public function subscriptionPlan()
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan', 'plan_code');
    }

    /**
     * Check if company is active.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Check if company is approved.
     */
    public function isApproved(): bool
    {
        return $this->is_approved;
    }

    /**
     * Check if company is on trial.
     */
    public function isOnTrial(): bool
    {
        return $this->subscription_plan === 'trial' 
            && $this->trial_ends_at 
            && $this->trial_ends_at->isFuture();
    }

    /**
     * Check if subscription is active.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->subscription_status === 'active' && 
               ($this->subscription_ends_at === null || $this->subscription_ends_at->isFuture());
    }

    /**
     * Get main store.
     */
    public function mainStore()
    {
        return $this->stores()->where('is_main_store', true)->first();
    }

    /**
     * Check if can add more stores.
     */
    public function canAddStore(): bool
    {
        return $this->current_store_count < $this->max_stores;
    }

    /**
     * Check if can add more users.
     */
    public function canAddUser(): bool
    {
        return $this->current_user_count < $this->max_users;
    }

    /**
     * Scope to get only active companies.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only approved companies.
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }
}