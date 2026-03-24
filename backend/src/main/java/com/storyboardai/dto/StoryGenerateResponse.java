package com.storyboardai.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoryGenerateResponse {
    private Long storyId;
    private String title;
    private String summary;
    private String status;
    private String message;
}
