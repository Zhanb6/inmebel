<?php

namespace App\Policies;

use App\Models\RequestStatusHistory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RequestStatusHistoryPolicy
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
    public function view(User $user, RequestStatusHistory $requestStatusHistory): bool
    {
        return $this->access($user, $requestStatusHistory);
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
    public function update(User $user, RequestStatusHistory $requestStatusHistory): bool
    {
        return $this->access($user, $requestStatusHistory);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RequestStatusHistory $requestStatusHistory): bool
    {
        return $this->access($user, $requestStatusHistory);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RequestStatusHistory $requestStatusHistory): bool
    {
        return $this->access($user, $requestStatusHistory);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RequestStatusHistory $requestStatusHistory): bool
    {
        return $this->access($user, $requestStatusHistory);
    }

    protected function access(User $user, RequestStatusHistory $requestStatusHistory)
    {

        return check_access_without_abort('view',$requestStatusHistory->request_model);
    }
}
