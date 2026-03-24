package com.storyboardai.controller;

import com.storyboardai.entity.NewsItem;
import com.storyboardai.entity.Story;
import com.storyboardai.service.MiniMaxService;
import com.storyboardai.service.NewsService;
import com.storyboardai.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;
    private final NewsService newsService;
    private final MiniMaxService miniMaxService;

    @GetMapping
    public ResponseEntity<List<Story>> getAllStories() {
        return ResponseEntity.ok(storyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getStoryById(@PathVariable Long id) {
        return storyService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Story>> getStoriesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(storyService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Story> createStory(@RequestBody Story story) {
        return ResponseEntity.ok(storyService.save(story));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Story> updateStory(@PathVariable Long id, @RequestBody Story story) {
        Optional<Story> existing = storyService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        story.setId(id);
        return ResponseEntity.ok(storyService.save(story));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Story> updateStoryStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(storyService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        storyService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateStories() {
        try {
            newsService.seedSampleNews();
            List<NewsItem> newsList = newsService.findLatest(5);
            List<Story> generated = storyService.generateStoriesFromNews(newsList);
            return ResponseEntity.ok(generated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
