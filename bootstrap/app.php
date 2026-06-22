<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        //api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Enregistrement des middlewares personnalises
        $middleware->alias([
            'is_admin'    => \App\Http\Middleware\IsAdmin::class,
            'is_approuve' => \App\Http\Middleware\IsApprouve::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();