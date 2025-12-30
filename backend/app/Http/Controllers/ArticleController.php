<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Phase 2: Fetch only the 5 oldest articles for research
     */
    public function index()
    {
        // Order by ID ascending (oldest first) and take only 5
        return Article::all();
    }

    /**
     * Phase 1: Store scraped articles in MySQL
     */
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