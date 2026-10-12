<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\Response;

class WorkshopProductPolicy
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
    public function view(User $user, Product $workshopProduct): bool
    {
        return $this->workshopAccess($user, $workshopProduct);
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
    public function update(User $user, Product $workshopProduct): bool
    {
        return $this->workshopAccess($user, $workshopProduct);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Product $workshopProduct): bool
    {
        return $this->workshopAccess($user, $workshopProduct);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Product $workshopProduct): bool
    {
        return $this->workshopAccess($user, $workshopProduct);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Product $workshopProduct): bool
    {
        return $this->workshopAccess($user, $workshopProduct);
    }

    public function workshopAccess(User $user, Product $workshopProduct): bool
    {

        return $user->workshop?->id == $workshopProduct->workshop_id;
    }
}
