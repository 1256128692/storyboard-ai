package com.storyboardai.controller;

import com.storyboardai.entity.NewsItem;
import com.storyboardai.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsItem>> getAllNews() {
        return ResponseEntity.ok(newsService.findAll());
    }

    @GetMapping("/latest")
    public ResponseEntity<List<NewsItem>> getLatestNews() {
        newsService.seedSampleNews();
        return ResponseEntity.ok(newsService.findLatest(5));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsItem> getNewsById(@PathVariable Long id) {
        return newsService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NewsItem> createNews(@RequestBody NewsItem newsItem) {
        return ResponseEntity.ok(newsService.save(newsItem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
