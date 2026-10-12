<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens,HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
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
        ];
    }

    protected function username()
    {
        return 'phone'; // или username, iin и т.д.
    }



    public function seller_data()
    {
        return $this->hasOne(UserSellerData::class,'user_id')->latestOfMany();
    }

    public function client_data()
    {
        return $this->hasOne(UserClientData::class,'user_id')->latestOfMany();
    }

    public function orders()
    {
        return $this->hasMany(Order::class,'user_id');
    }

    public function workshops()
    {
        return $this->belongsToMany(Workshop::class,'user_workshop');
    }

    public function workshop()
    {
        return $this->hasOneThrough(
            Workshop::class,
            UserWorkshop::class,   // модель pivot-таблицы
            'user_id',             // foreign key в pivot (на User)
            'id',                  // foreign key в Workshop
            'id',                  // local key в User
            'workshop_id'          // local key в pivot
        );
    }

    public function requests()
    {
        return $this->hasMany(RequestModel::class , 'user_id');
    }

    public function likes()
    {
        return $this->hasMany(ModelHasLike::class,'user_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class,'user_id');
    }

}
