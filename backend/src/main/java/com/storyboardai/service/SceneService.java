package com.storyboardai.service;

import com.storyboardai.entity.Scene;
import com.storyboardai.repository.SceneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SceneService {

    private final SceneRepository sceneRepository;

    public List<Scene> findAll() {
        return sceneRepository.findAll();
    }

    public Optional<Scene> findById(Long id) {
        return sceneRepository.findById(id);
    }

    public List<Scene> findByStoryId(Long storyId) {
        return sceneRepository.findByStoryIdOrderBySequenceAsc(storyId);
    }

    @Transactional
    public Scene save(Scene scene) {
        return sceneRepository.save(scene);
    }

    @Transactional
    public void deleteById(Long id) {
        sceneRepository.deleteById(id);
    }

    @Transactional
    public Scene updateGeneratedImageUrl(Long id, String imageUrl) {
        Scene scene = sceneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scene not found with id: " + id));
        scene.setGeneratedImageUrl(imageUrl);
        return sceneRepository.save(scene);
    }
}
