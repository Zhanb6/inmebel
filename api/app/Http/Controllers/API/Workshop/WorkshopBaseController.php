<?php

namespace App\Http\Controllers\API\Workshop;

use App\Http\Controllers\Controller;
use App\Models\Workshop;
use Illuminate\Support\Facades\Auth;

class WorkshopBaseController extends Controller
{
    public $workshop;

    public function __construct(){
        $this->workshop = Auth::user()->workshop;
    }
}
