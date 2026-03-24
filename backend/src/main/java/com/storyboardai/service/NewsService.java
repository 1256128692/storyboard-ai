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

    public List<NewsItem> findLatest(int limit) {
        List<NewsItem> all = newsItemRepository.findAll();
        int size = all.size();
        if (size <= limit) return all;
        return all.subList(size - Math.min(limit, size), size);
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

    @Transactional
    public void seedSampleNews() {
        if (!newsItemRepository.findAll().isEmpty()) return;
        createNewsItem("AI制药新突破：某biotech利用AlphaFold3将药物研发周期缩短60%",
            "AI在蛋白质结构预测领域的突破正在重塑制药行业格局...",
            "https://example.com/news/1", "生物制药前沿", LocalDateTime.now().minusDays(1));
        createNewsItem("国家药监局发布新规：生物制品生产质量管理进一步细化",
            "新版GMP附录对生物制品生产提出更高要求...",
            "https://example.com/news/2", "政策法规", LocalDateTime.now().minusDays(2));
        createNewsItem("ChatGPT进入临床决策：医院AI助手真的靠谱吗？",
            "多家三甲医院开始试点AI辅助诊断系统...",
            "https://example.com/news/3", "医疗AI", LocalDateTime.now().minusDays(3));
        createNewsItem("某创新药企完成10亿元融资，AI+药物研发成为资本新宠",
            "生物制药赛道持续火热，AI制药公司估值水涨船高...",
            "https://example.com/news/4", "行业动态", LocalDateTime.now().minusDays(4));
        createNewsItem("数据泄露频发：药企如何筑牢网络安全防线",
            "某跨国药企遭勒索软件攻击，临床数据安全引发关注...",
            "https://example.com/news/5", "网络安全", LocalDateTime.now().minusDays(5));
    }
}
