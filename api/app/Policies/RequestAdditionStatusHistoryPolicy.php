<?php

namespace App\Policies;

use App\Models\RequestAdditionStatusHistory;
use App\Models\RequestStatusHistory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RequestAdditionStatusHistoryPolicy
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
    public function view(User $user, RequestAdditionStatusHistory $requestAdditionStatusHistory): bool
    {

        return $this->access($user, $requestAdditionStatusHistory);
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
    public function update(User $user, RequestAdditionStatusHistory $requestAdditionStatusHistory): bool
    {
        return $this->access($user, $requestAdditionStatusHistory);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RequestAdditionStatusHistory $requestAdditionStatusHistory): bool
    {
        return $this->access($user, $requestAdditionStatusHistory);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, RequestAdditionStatusHistory $requestAdditionStatusHistory): bool
    {
        return $this->access($user, $requestAdditionStatusHistory);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RequestAdditionStatusHistory $requestAdditionStatusHistory): bool
    {
        return $this->access($user, $requestAdditionStatusHistory);
    }

    protected function access(User $user, RequestAdditionStatusHistory $requestAdditionStatusHistory)
    {

        return check_access_without_abort('view',$requestAdditionStatusHistory->request_addition);
    }
}
