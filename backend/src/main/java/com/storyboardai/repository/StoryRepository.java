package com.storyboardai.repository;

import com.storyboardai.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByStatus(String status);
    List<Story> findBySourceNewsId(Long sourceNewsId);
}
