<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Phase 2: Fetch articles from the database 
     */
    public function index()
    {
        // Returns all articles (including the 5 oldest you just scraped) [cite: 12, 15]
        return response()->json(Article::all());
    }

    /**
     * Phase 1: Store scraped articles in MySQL [cite: 11, 12]
     */
    public function store(Request $request)
    {
        // Validate incoming data from the scraper
        $validated = $request->validate([
            'title'   => 'required|string',
            'content' => 'required|string',
            'url'     => 'required|url|unique:articles,url',
        ]);

        // Create the record in MySQL [cite: 11]
        $article = Article::create($validated);

        return response()->json([
            'message' => 'Article saved successfully!',
            'data'    => $article
        ], 201);
    }
}