<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/**
 * Phase 1: Store articles in the database [cite: 11]
 * Method: POST
 */
Route::post('/articles', [ArticleController::class, 'store']);

/**
 * Phase 2: Fetch articles for research and rewriting [cite: 15]
 * Method: GET
 */
Route::get('/articles', [ArticleController::class, 'index']);