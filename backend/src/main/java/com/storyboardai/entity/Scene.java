package com.storyboardai.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "scenes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scene {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Column(nullable = false)
    private Integer sequence;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_prompt", columnDefinition = "TEXT")
    private String imagePrompt;

    @Column(name = "video_prompt", columnDefinition = "TEXT")
    private String videoPrompt;

    @Column(name = "is_first_frame")
    @Builder.Default
    private Boolean isFirstFrame = false;

    @Column(name = "is_last_frame")
    @Builder.Default
    private Boolean isLastFrame = false;

    @Column(name = "generated_image_url")
    private String generatedImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isFirstFrame == null) {
            isFirstFrame = false;
        }
        if (isLastFrame == null) {
            isLastFrame = false;
        }
    }
}
