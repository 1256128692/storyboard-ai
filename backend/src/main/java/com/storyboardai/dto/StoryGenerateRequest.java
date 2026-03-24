package com.storyboardai.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryGenerateRequest {
    private Long sourceNewsId;
    private String tone;
    private String durationHint;
}
