package com.storyboardai.service;

import com.storyboardai.entity.Story;
import com.storyboardai.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;

    public List<Story> findAll() {
        return storyRepository.findAll();
    }

    public Optional<Story> findById(Long id) {
        return storyRepository.findById(id);
    }

    public List<Story> findByStatus(String status) {
        return storyRepository.findByStatus(status);
    }

    @Transactional
    public Story save(Story story) {
        return storyRepository.save(story);
    }

    @Transactional
    public void deleteById(Long id) {
        storyRepository.deleteById(id);
    }

    @Transactional
    public Story updateStatus(Long id, String status) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found with id: " + id));
        story.setStatus(status);
        return storyRepository.save(story);
    }
}
