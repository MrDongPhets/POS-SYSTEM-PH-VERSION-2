<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_id',
        'store_id',
        'employee_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'can_override_prices',
        'can_apply_discounts',
        'can_process_returns',
        'can_void_transactions',
        'max_discount_percent',
        'max_transaction_amount',
        'is_active',
        'hire_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
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
            'last_login_at' => 'datetime',
            'password_changed_at' => 'datetime',
            'hire_date' => 'date',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'can_override_prices' => 'boolean',
            'can_apply_discounts' => 'boolean',
            'can_process_returns' => 'boolean',
            'can_void_transactions' => 'boolean',
            'max_discount_percent' => 'decimal:2',
            'max_transaction_amount' => 'decimal:2',
        ];
    }

    /**
     * Get the company that owns the user.
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get the store that the user belongs to.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is company admin.
     */
    public function isCompanyAdmin(): bool
    {
        return $this->role === 'company_admin';
    }

    /**
     * Check if user is active.
     */
    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Scope to get only active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get users by role.
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }
}