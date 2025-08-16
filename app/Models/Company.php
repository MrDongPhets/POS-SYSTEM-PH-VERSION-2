<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'trial_ends_at' => 'date',
            'subscription_ends_at' => 'date',
            'approved_at' => 'datetime',
            'is_active' => 'boolean',
            'is_approved' => 'boolean',
            'max_stores' => 'integer',
            'max_users' => 'integer',
            'current_store_count' => 'integer',
            'current_user_count' => 'integer',
        ];
    }

    /**
     * Get the users for the company.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get the stores for the company.
     */
    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }

    /**
     * Get the system user who created this company.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(SystemUser::class, 'created_by');
    }

    /**
     * Get the system user who approved this company.
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(SystemUser::class, 'approved_by');
    }

    /**
     * Check if company is active.
     */
    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    /**
     * Check if company is approved.
     */
    public function isApproved(): bool
    {
        return (bool) $this->is_approved;
    }

    /**
     * Check if company subscription is active.
     */
    public function hasActiveSubscription(): bool
    {
        return $this->subscription_status === 'active';
    }

    /**
     * Check if company is in trial period.
     */
    public function isInTrial(): bool
    {
        return $this->subscription_plan === 'trial' && 
               $this->trial_ends_at && 
               $this->trial_ends_at->isFuture();
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

    /**
     * Scope to get pending approval companies.
     */
    public function scopePendingApproval($query)
    {
        return $query->where('is_approved', false);
    }
}