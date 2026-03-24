package com.storyboardai.service;

import com.storyboardai.entity.NewsItem;
import com.storyboardai.repository.NewsItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NewsService {

    private final NewsItemRepository newsItemRepository;

    public List<NewsItem> findAll() {
        return newsItemRepository.findAll();
    }

    public Optional<NewsItem> findById(Long id) {
        return newsItemRepository.findById(id);
    }

    @Transactional
    public NewsItem save(NewsItem newsItem) {
        return newsItemRepository.save(newsItem);
    }

    @Transactional
    public void deleteById(Long id) {
        newsItemRepository.deleteById(id);
    }

    @Transactional
    public NewsItem createNewsItem(String title, String content, String sourceUrl, String sourceName, LocalDateTime publishedAt) {
        NewsItem item = NewsItem.builder()
                .title(title)
                .content(content)
                .sourceUrl(sourceUrl)
                .sourceName(sourceName)
                .publishedAt(publishedAt)
                .build();
        return newsItemRepository.save(item);
    }
}
