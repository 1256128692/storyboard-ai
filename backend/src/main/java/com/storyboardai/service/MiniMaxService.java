package com.storyboardai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MiniMaxService {

    @Value("${minimax.api-key}")
    private String apiKey;

    @Value("${minimax.image-model}")
    private String imageModel;

    @Value("${minimax.image-base-url}")
    private String imageBaseUrl;

    private static final String TEXT_BASE_URL = "https://api.minimax.chat/v1";

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateImage(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", imageModel);
        body.put("prompt", prompt);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(imageBaseUrl, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> responseBody = response.getBody();
            Object dataObj = responseBody.get("data");
            if (dataObj instanceof Map) {
                Map<String, Object> data = (Map<String, Object>) dataObj;
                Object urls = data.get("image_urls");
                if (urls instanceof List && !((List<?>) urls).isEmpty()) {
                    return (String) ((List<?>) urls).get(0);
                }
            }
        }
        return null;
    }

    public String chat(String prompt) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "MiniMax-Text-01");

        Map<String, String> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", "你是一个创意故事策划专家，擅长创作熊猫和北极熊的搞笑反讽短故事。");

        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);

        body.put("messages", new Object[]{systemMsg, userMsg});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(
            TEXT_BASE_URL + "/text/chatcompletion_v2", entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> rb = response.getBody();
            Object choices = rb.get("choices");
            if (choices instanceof List && !((List<?>) choices).isEmpty()) {
                Object choice = ((List<?>) choices).get(0);
                if (choice instanceof Map) {
                    Object msg = ((Map<?, ?>) choice).get("messages");
                    if (msg instanceof List && !((List<?>) msg).isEmpty()) {
                        Map<?, ?> m = (Map<?, ?>) ((List<?>) msg).get(0);
                        return (String) m.get("content");
                    }
                }
            }
        }
        return null;
    }
}
