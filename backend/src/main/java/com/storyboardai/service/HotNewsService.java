package com.storyboardai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotNewsService {

    @Value("${tavily.api-key}")
    private String apiKey;

    @Value("${tavily.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 搜索实时热点新闻
     * @param query 搜索关键词，如"热点新闻"或具体事件
     * @param maxResults 返回结果数量
     * @return 新闻列表
     */
    public List<HotNewsResult> searchHotNews(String query, int maxResults) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("query", query);
            body.put("max_results", maxResults);
            body.put("search_depth", "basic");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                baseUrl + "/search", entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                return parseTavilyResponse(responseBody);
            }
        } catch (Exception e) {
            log.error("搜索热点新闻失败: {}", e.getMessage());
        }
        return Collections.emptyList();
    }

    /**
     * 获取社会热点新闻
     */
    public List<HotNewsResult> searchSocialHotNews(int maxResults) {
        return searchHotNews("今日热点新闻 社会热点 微博热搜 抖音热搜 百度热搜", maxResults);
    }

    /**
     * 搜索特定主题的热点
     */
    public List<HotNewsResult> searchTopicHotNews(String topic, int maxResults) {
        return searchHotNews(topic + " 今日热点 热搜", maxResults);
    }

    @SuppressWarnings("unchecked")
    private List<HotNewsResult> parseTavilyResponse(Map<String, Object> responseBody) {
        List<HotNewsResult> results = new ArrayList<>();
        Object resultsObj = responseBody.get("results");
        if (resultsObj instanceof List) {
            List<Map<String, Object>> rawResults = (List<Map<String, Object>>) resultsObj;
            for (Map<String, Object> item : rawResults) {
                String title = (String) item.get("title");
                String url = (String) item.get("url");
                String content = (String) item.get("content");
                // 取前200字作为摘要
                if (content != null && content.length() > 200) {
                    content = content.substring(0, 200) + "...";
                }
                String source = "热点";
                Object sourceObj = item.get("source");
                if (sourceObj != null) {
                    source = sourceObj.toString();
                }
                results.add(new HotNewsResult(title, content, url, source));
            }
        }
        return results;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class HotNewsResult {
        private String title;
        private String content;
        private String url;
        private String source;
    }
}
