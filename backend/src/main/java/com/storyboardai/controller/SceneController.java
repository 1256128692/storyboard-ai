package com.storyboardai.controller;

import com.storyboardai.entity.Scene;
import com.storyboardai.service.SceneService;
import com.storyboardai.service.MiniMaxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/scenes")
@RequiredArgsConstructor
public class SceneController {

    private final SceneService sceneService;
    private final MiniMaxService miniMaxService;

    @GetMapping
    public ResponseEntity<List<Scene>> getAllScenes() {
        return ResponseEntity.ok(sceneService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scene> getSceneById(@PathVariable Long id) {
        return sceneService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/story/{storyId}")
    public ResponseEntity<List<Scene>> getScenesByStory(@PathVariable Long storyId) {
        return ResponseEntity.ok(sceneService.findByStoryId(storyId));
    }

    @PostMapping
    public ResponseEntity<Scene> createScene(@RequestBody Scene scene) {
        return ResponseEntity.ok(sceneService.save(scene));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scene> updateScene(@PathVariable Long id, @RequestBody Scene scene) {
        Optional<Scene> existing = sceneService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        scene.setId(id);
        return ResponseEntity.ok(sceneService.save(scene));
    }

    @PostMapping("/{id}/generate-image")
    public ResponseEntity<Scene> generateImage(@PathVariable Long id) {
        Optional<Scene> existing = sceneService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Scene scene = existing.get();
        String imageUrl = miniMaxService.generateImage(scene.getImagePrompt());
        if (imageUrl != null) {
            Scene updated = sceneService.updateGeneratedImageUrl(id, imageUrl);
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.internalServerError().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScene(@PathVariable Long id) {
        sceneService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
