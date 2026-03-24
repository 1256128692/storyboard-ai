package com.storyboardai.repository;

import com.storyboardai.entity.Scene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SceneRepository extends JpaRepository<Scene, Long> {
    List<Scene> findByStoryIdOrderBySequenceAsc(Long storyId);
}
