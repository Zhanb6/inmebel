<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\RequestAddition;
use App\Models\RequestModel;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RequestAdditionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, RequestAddition $requestAddition): bool
    {
        return $this->access($user, $requestAddition);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RequestAddition $requestAddition): bool
    {
        return $this->access($user, $requestAddition);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RequestAddition $requestAddition): bool
    {
        return $this->access($user, $requestAddition);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RequestAddition $requestAddition): bool
    {
        return $this->access($user, $requestAddition);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RequestAddition $requestAddition): bool
    {
        return $this->access($user, $requestAddition);
    }

    public function client_access(User $user, RequestAddition $requestAddition): bool
    {
        $requestModel = $requestAddition->request_model;
        return $requestModel->user_id == $user->id;
    }

    public function workshop_access(User $user, RequestAddition $requestAddition): bool
    {
        $requestModel = $requestAddition->request_model;
        $workshop = $user->workshop;
        return $requestModel->workshop_id == $workshop->id;
    }

    public function access(User $user, RequestAddition $requestAddition): bool
    {

        if ($user->hasRole(RoleEnum::CLIENT->value)){
            return  $this->client_access($user, $requestAddition);
        }

        if ($user->hasRole(RoleEnum::WORKSHOP->value)){
            return  $this->workshop_access($user, $requestAddition);
        }

        return false;
    }
}
