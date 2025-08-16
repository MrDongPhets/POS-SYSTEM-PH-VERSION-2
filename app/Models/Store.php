<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'company_id',
        'store_code',
        'store_name',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'phone',
        'email',
        'manager_name',
        'opening_time',
        'closing_time',
        'operating_days',
        'is_active',
        'is_main_store',
        'store_settings',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
        'operating_days' => 'array',
        'store_settings' => 'array',
        'is_active' => 'boolean',
        'is_main_store' => 'boolean',
    ];

    /**
     * Company that owns this store.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Users assigned to this store.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Check if store is active.
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Check if this is the main store.
     */
    public function isMainStore(): bool
    {
        return $this->is_main_store;
    }

    /**
     * Scope to get only active stores.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get stores for a specific company.
     */
    public function scopeForCompany($query, int $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Get full address as string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->province,
            $this->postal_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }
}