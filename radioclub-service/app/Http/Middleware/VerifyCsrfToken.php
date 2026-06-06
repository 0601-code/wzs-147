<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        //
    ];
}
