package com.storyboardai.service;

import com.storyboardai.entity.NewsItem;
import com.storyboardai.entity.Story;
import com.storyboardai.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;

    public List<Story> findAll() {
        return storyRepository.findAll();
    }

    public Optional<Story> findById(Long id) {
        return storyRepository.findById(id);
    }

    public List<Story> findByStatus(String status) {
        return storyRepository.findByStatus(status);
    }

    @Transactional
    public Story save(Story story) {
        return storyRepository.save(story);
    }

    @Transactional
    public void deleteById(Long id) {
        storyRepository.deleteById(id);
    }

    @Transactional
    public Story updateStatus(Long id, String status) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Story not found with id: " + id));
        story.setStatus(status);
        return storyRepository.save(story);
    }

    @Transactional
    public List<Story> parseAndSaveStories(String aiResponse) {
        List<Story> stories = new ArrayList<>();
        String[] blocks = aiResponse.split("【故事");

        for (int i = 1; i < blocks.length; i++) {
            String block = blocks[i];
            String title = extract(block, "标题：", "\n");
            String summary = extract(block, "梗概：", "\n");
            String tone = extract(block, "基调：", "\n");

            if (title == null || title.isBlank()) continue;

            Story story = Story.builder()
                    .title(title.trim())
                    .summary(summary != null ? summary.trim() : "")
                    .tone(tone != null ? tone.trim().toUpperCase() : "IRONIC")
                    .status("DRAFT")
                    .build();
            stories.add(storyRepository.save(story));
        }
        return stories;
    }

    private String extract(String block, String prefix, String suffix) {
        int start = block.indexOf(prefix);
        if (start < 0) return null;
        start += prefix.length();
        int end = block.indexOf(suffix, start);
        if (end < 0) end = block.length();
        return block.substring(start, end).trim();
    }

    @Transactional
    public List<Story> generateStoriesFromNews(List<NewsItem> newsList) {
        List<Story> stories = new ArrayList<>();
        String[] tones = {"IRONIC", "ABSURD", "DEADPAN", "SARCASTIC"};

        for (int i = 0; i < Math.min(3, newsList.size()); i++) {
            NewsItem news = newsList.get(i % newsList.size());
            String title = generateStoryTitle(news.getTitle(), i);
            String summary = generateStorySummary(news.getTitle(), news.getContent(), i);
            String tone = tones[i % tones.length];

            Story story = Story.builder()
                    .title(title)
                    .summary(summary)
                    .tone(tone)
                    .status("DRAFT")
                    .build();
            stories.add(storyRepository.save(story));
        }
        return stories;
    }

    private String generateStoryTitle(String newsTitle, int index) {
        String[] templates = {
            "熊猫和北极熊聊%s：%s",
            "当熊猫遇上%s，北极熊这样说…",
            "熊猫北极熊%s神点评%s",
            "北极熊吐槽%s，熊猫竟然这么说…",
        };
        String topic = newsTitle.length() > 15 ? newsTitle.substring(0, 15) : newsTitle;
        return String.format(templates[index % templates.length], topic.replaceAll("[^\\u4e00-\\u9fa5a-zA-Z0-9]", ""), topic);
    }

    private String generateStorySummary(String newsTitle, String newsContent, int index) {
        String base = newsContent != null && !newsContent.isBlank() ? newsContent : newsTitle;
        String[] summaries = {
            String.format("熊猫兴奋地刷到新闻：'%s'，立刻去找北极熊分享。北极熊面无表情地说：'这有什么稀奇的，我早知道了。'熊猫不服气，开始长篇大论分析，北极熊一针见血吐槽，场面一度失控…",
                newsTitle),
            String.format("北极熊偶然看到新闻'%s'，冷笑一声。熊猫凑过来，非要一起讨论，结果两人观点完全相反。熊猫越说越激动，北极熊越听越无语，最后北极熊来了一句神吐槽，熊猫当场语塞…",
                base.length() > 20 ? base.substring(0, 20) : base),
            String.format("新闻'%s'登上热搜，熊猫激动地拉着北极熊要拍视频。北极熊一脸嫌弃，但还是配合出演。熊猫一本正经胡说八道，北极熊冷眼旁观疯狂拆台，镜头前的观众笑疯了…",
                newsTitle),
        };
        return summaries[index % summaries.length];
    }
}
