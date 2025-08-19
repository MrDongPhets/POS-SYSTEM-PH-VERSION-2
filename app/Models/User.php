<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
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
        'last_login_at',
        'password_changed_at',
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
            'password' => 'hashed',
            'last_login_at' => 'datetime',
            'password_changed_at' => 'datetime',
            'hire_date' => 'date',
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
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'company_id' => $this->company_id,
            'store_id' => $this->store_id,
            'role' => $this->role,
            'permissions' => [
                'can_override_prices' => $this->can_override_prices,
                'can_apply_discounts' => $this->can_apply_discounts,
                'can_process_returns' => $this->can_process_returns,
                'can_void_transactions' => $this->can_void_transactions,
            ]
        ];
    }

    /**
     * Relationships
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    // public function transactions()
    // {
    //     return $this->hasMany(Transaction::class, 'cashier_id');
    // }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeByStore($query, $storeId)
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Check if user has permission
     */
    public function hasPermission($permission)
    {
        return $this->$permission ?? false;
    }

    /**
     * Check if user is admin
     */
    public function isCompanyAdmin()
    {
        return $this->role === 'company_admin';
    }

    public function isStoreManager()
    {
        return $this->role === 'store_manager';
    }

    public function isCashier()
    {
        return $this->role === 'cashier';
    }
}