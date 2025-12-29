<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    // Allows these fields to be filled by the scraper
    protected $fillable = ['title', 'content', 'url']; 
}