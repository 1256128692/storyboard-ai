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

    /**
     * 清空所有新闻并重新播种多样化的热点话题
     */
    @Transactional
    public void seedSampleNews() {
        // 先删除旧数据，避免残留医药新闻
        newsItemRepository.deleteAll();
        
        // 多样化的社会热点话题
        createNewsItem("张雪峰老师因心脏病突发去世，年仅42岁",
            "知名教育博主张雪峰突然离世，引发网友深切哀悼。他曾以幽默风趣的方式解读高考志愿填报，帮助无数学生找到方向。",
            "https://weibo.com/hot/1", "社会热点", LocalDateTime.now().minusHours(2));
        
        createNewsItem("某明星婚变登上热搜，婚姻与事业的平衡引发讨论",
            "一线明星突然宣布离婚消息震惊娱乐圈，两人微博互删引发各种猜测。",
            "https://weibo.com/hot/2", "娱乐头条", LocalDateTime.now().minusHours(4));
        
        createNewsItem("年轻人开始爱上菜市场，城市烟火气回归",
            "继Citywalk之后，年轻人最新打卡地点竟是菜市场。卖菜摊主表示：以前都是大爷大妈，现在年轻人越来越多了。",
            "https://weibo.com/hot/3", "生活百态", LocalDateTime.now().minusHours(6));
        
        createNewsItem("电动车迎来新规，这些行为将被罚款",
            "交管部门发布电动车管理新规，规定了一系列违规行为及处罚标准，不少市民表示支持。",
            "https://weibo.com/hot/4", "政策法规", LocalDateTime.now().minusHours(8));
        
        createNewsItem("大学生就业难，研究生招生规模创历史新高",
            "今年应届毕业生就业形势严峻，考研报名人数再创新高。教育专家呼吁调整人才培养结构。",
            "https://weibo.com/hot/5", "教育就业", LocalDateTime.now().minusHours(10));
        
        createNewsItem("某网红餐厅被曝食品安全问题，官方介入调查",
            "拥有百万粉丝的网红餐厅被曝光后厨卫生问题，市场监管局已介入调查，责令停业整改。",
            "https://weibo.com/hot/6", "消费维权", LocalDateTime.now().minusHours(12));
        
        createNewsItem("AI生成内容泛滥，平台开始强制标注",
            "各大互联网平台陆续推出AI内容识别和标注功能，帮助用户辨别真人创作与AI生成内容。",
            "https://weibo.com/hot/7", "科技前沿", LocalDateTime.now().minusHours(14));
        
        createNewsItem("春节假期延长至10天？网友热议假期安排",
            "人大代表建议延长春节假期至10天，引发网友激烈讨论，支持者和反对者各执己见。",
            "https://weibo.com/hot/8", "民生关注", LocalDateTime.now().minusHours(16));
    }
}
