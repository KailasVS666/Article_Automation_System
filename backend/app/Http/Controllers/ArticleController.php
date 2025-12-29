<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function store(Request $request)
    {
        // Validate incoming data from the scraper
        $validated = $request->validate([
            'title'   => 'required|string',
            'content' => 'required|string',
            'url'     => 'required|url|unique:articles,url',
        ]);

        // Create the record in MySQL
        $article = Article::create($validated);

        return response()->json([
            'message' => 'Article saved successfully!',
            'data'    => $article
        ], 201);
    }
}