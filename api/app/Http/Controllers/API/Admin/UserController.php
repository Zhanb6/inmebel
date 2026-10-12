<?php

namespace App\Http\Controllers\API\Admin;

use App\Enums\PaginationMetaEnum;
use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Cart\CartShowResource;
use App\Http\Resources\Order\OrderIndexResource;
use App\Http\Resources\Product\ProductIndexResource;
use App\Http\Resources\RequestModel\RequestModelResource;
use App\Http\Resources\User\UserAdminIndexResource;
use App\Http\Resources\User\UserAdminShowResource;
use App\Http\Resources\User\UserClientInfoShowResource;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use App\Models\UserClientData;
use App\Rules\PhoneRule;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'perPage'=>'nullable|integer|min:1|max:100',
            'search'=>'nullable|string',
            'role'=>'nullable|string|in:'.RoleEnum::toValidation(),
            'workshop_accepted'=>'nullable|boolean',
        ]);

        $query = User::query();
        $query->latest();

        //filters
        $query->when($request->search, function ($query,$data) {
           $query->where('name', 'ilike', '%' . $data . '%');
           $query->orWhere('id', 'ilike', '%' . $data . '%');
           $query->orWhere('phone', 'ilike', '%' . $data . '%');
        });

        $query->when($request->role, function ($query,$data) {
            $query->whereHas('roles', function ($query) use ($data) {
                $query->where('name', $data);
            });
        });

        $query->when($request->workshop_accepted !== null, function ($query,$data) use ($request) {
            $query->whereHas('workshop', function ($query) use ($request, $data) {
                if ($request->workshop_accepted){
                    $query->whereNotNull('accepted_at');
                } else{
                    $query->whereNull('accepted_at');
                }

            });
        });


        $count = $query->clone()->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return UserAdminIndexResource::collection($data)->additional([
            'count'=>$count,
        ]);
    }

    public function show(Request $request, User $user)
    {
        return new UserAdminIndexResource($user);
    }

    public function acceptWorkshop(User $user)
    {
        if (!$user->workshop){
            throw ValidationException::withMessages([
                'id' => 'У пользователя нету цеха',
            ]);
        }

        if ($user->workshop?->accepted_at){
            throw ValidationException::withMessages([
                'id' => 'Цех уже принят',
            ]);
        }
        $user->workshop()?->update([
            'accepted_at'=>now()
        ]);

        return new UserAdminIndexResource($user->fresh());
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'=>'required|string',
            'phone'=> ['required','string','unique:users,phone,'.$user->id, new PhoneRule()],
        ]);

        $user->update($validated);

        return new UserAdminIndexResource($user->fresh());
    }

    public function workshopUpdate(Request $request, User $user)
    {
        if (!$user->workshop){
            throw ValidationException::withMessages([
                'id' => 'У пользователя нету цеха',
            ]);
        }

        $request->validate([
            'name' => 'required|string',
            'iin' => 'required',
            'address' => 'required|string',
            'images'=>'nullable|array|min:1',
            'images.*'=>'required|image|mimes:jpeg,png,jpg|max:4048',
            'description'=>'nullable|string',
            'bic'=>'required|string',
            'bank'=>'required|string',
            'director_name'=>'required|string',
            'iic'=>'required|string',
            'bc'=>'required|integer|digits:2',
            'city'=>'required|string',
        ]);
        $user->workshop->update($request->all());

        if ($request->images){
            $this->workshop->clearMediaCollection();
            foreach ($request->images as $image){
                $this->workshop
                    ->addMedia($image)
                    ->toMediaCollection();
            }
        }

        return new UserAdminIndexResource($user->fresh());
    }

    public function clientDataUpdate(Request $request, User $user)
    {
        if (!$user->hasRole(RoleEnum::CLIENT->value)){
            throw ValidationException::withMessages([
                'id' => 'У пользователя другая роль',
            ]);
        }
        $request->validate([
            'iin'=>'required|string',
            'address'=>'required|string',
        ]);

        UserClientData::updateOrCreate([
            'user_id' => $user->id,
        ],$request->all());


        return new UserAdminIndexResource($user->fresh());
    }

    public function acceptSeller(User $user)
    {
        $user->seller_data?->update([
            'accepted_at'=>now()
        ]);

        return new UserAdminIndexResource($user);
    }

    public function orders(Request $request, User $user)
    {
        $query =  $user->orders()->getQuery();
        if ($user->hasRole(RoleEnum::WORKSHOP->value)){
            $query =  $user->workshop->orders()->getQuery();
        }

        //filter
        $query->filter($request->all());

        $count = $query->clone()->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return OrderIndexResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function requests(Request $request, User $user)
    {
        $query =  $user->requests()->getQuery();
        if ($user->hasRole(RoleEnum::WORKSHOP->value)){
            $query =  $user->workshop->requests()->getQuery();
        }

        //filter
        $query->filter($request->all());

        $count = $query->clone()->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return RequestModelResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function productsLiked(Request $request,User $user)
    {

        $query = Product::query()
            ->withAvg('reviews', 'star')
            ->withCount('reviews')
            ->withCount('reviews_with_comment')
            ->whereHas('likes',function ($query) use ($user) {
                $query->where('user_id',$user->id);
            })
            ->latest();

        //filters
        $query->filter($request->all());

        $count = $query->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return ProductIndexResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function products(Request $request, User $user)
    {

        if (!$user->hasRole(RoleEnum::WORKSHOP->value)){

            throw ValidationException::withMessages([
                'id' => ['Продукты могут быть только у цехов'],
            ]);
        }

        $query =  $user->workshop->products()->getQuery();

        $query->orderByDesc('created_at')
            ->orderByDesc('id');

        $query->filter($request->all());

        $count = $query->count();
        $data = $query->paginate($request->perPage ?? PaginationMetaEnum::PER_PAGE_DEFAULT->value);

        return ProductIndexResource::collection($data)->additional([
            'count' => $count,
        ]);
    }

    public function cart(Request $request,User $user)
    {
        $cart = Cart::firstWhere('user_id',$user->id);

        return $cart ? new CartShowResource($cart) : response()->json(['data'=>null]);
    }
}
