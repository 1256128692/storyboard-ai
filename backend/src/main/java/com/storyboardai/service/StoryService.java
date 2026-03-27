package com.storyboardai.service;

import com.storyboardai.entity.NewsItem;
import com.storyboardai.entity.Story;
import com.storyboardai.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoryService {

    private final StoryRepository storyRepository;
    private final MiniMaxService miniMaxService;

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
            String durationHint = extract(block, "时长：", "\n");

            if (title == null || title.isBlank()) continue;

            Story story = Story.builder()
                    .title(title.trim())
                    .summary(summary != null ? summary.trim() : "")
                    .tone(tone != null ? tone.trim().toUpperCase() : "IRONIC")
                    .durationHint(durationHint != null ? durationHint.trim() : "1-3分钟")
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

    /**
     * 使用AI生成创意故事（1-3分钟时长，有梗有深度）
     */
    @Transactional
    public List<Story> generateCreativeStoriesFromNews(List<HotNewsService.HotNewsResult> newsList) {
        List<Story> stories = new ArrayList<>();

        for (int i = 0; i < Math.min(3, newsList.size()); i++) {
            HotNewsService.HotNewsResult news = newsList.get(i % newsList.size());

            // 使用AI生成创意故事
            String aiPrompt = buildCreativeStoryPrompt(news);
            String aiResponse = miniMaxService.chat(aiPrompt);

            if (aiResponse != null && !aiResponse.isBlank()) {
                // 解析AI生成的故事
                Story story = parseAiGeneratedStory(aiResponse, news);
                if (story != null) {
                    stories.add(storyRepository.save(story));
                }
            } else {
                // 如果AI生成失败，使用备用方案
                Story fallbackStory = createFallbackStory(news, i);
                stories.add(storyRepository.save(fallbackStory));
            }
        }
        return stories;
    }

    private String buildCreativeStoryPrompt(HotNewsService.HotNewsResult news) {
        return """
            你是一个创意短视频故事策划专家，擅长创作熊猫和北极熊的搞笑反讽短故事。

            任务：根据以下热点新闻，创作一个1-3分钟的短视频故事脚本。

            热点新闻：
            标题：%s
            内容：%s
            来源：%s

            要求：
            1. 时长控制在1-3分钟，适合短视频平台
            2. 有创意有梗，不能太简单，要有深度和反转
            3. 熊猫和北极熊的角色要鲜明，一个认真一个吐槽
            4. 故事结构：开场（抓住注意力）+ 发展（层层递进）+ 高潮（反转/爆点）+ 结尾（升华或神转折）
            5. 要有金句/梗，让人看完想转发
            6. 故事内容长度控制在200字以内，简洁有力
            7. 包含隐喻，让故事更有深度

            请用以下格式输出：
            【故事】
            标题：[给故事起个吸引人的标题]
            梗概：[50字内的故事简介]
            基调：[IRONIC/ABSURD/DEADPAN/SARCASTIC]
            时长：[1-3分钟]
            分镜：
            1. [场景描述 + 对话/旁白 + 镜头语言]
            2. [场景描述 + 对话/旁白 + 镜头语言]
            3. [场景描述 + 对话/旁白 + 镜头语言]
            ...
            金句：[至少一句让人印象深刻的台词]
            """.formatted(
                news.getTitle() != null ? news.getTitle() : "",
                news.getContent() != null ? news.getContent() : "",
                news.getSource() != null ? news.getSource() : "热点"
        );
    }

    private Story parseAiGeneratedStory(String aiResponse, HotNewsService.HotNewsResult news) {
        try {
            String title = extract(aiResponse, "标题：", "\n");
            String summary = extract(aiResponse, "梗概：", "\n");
            String tone = extract(aiResponse, "基调：", "\n");
            String durationHint = extract(aiResponse, "时长：", "\n");

            // 提取分镜内容
            String storyboard = "";
            int storyboardIndex = aiResponse.indexOf("分镜：");
            if (storyboardIndex > 0) {
                int goldQuoteIndex = aiResponse.indexOf("金句：");
                if (goldQuoteIndex > storyboardIndex) {
                    storyboard = aiResponse.substring(storyboardIndex + 3, goldQuoteIndex).trim();
                } else {
                    storyboard = aiResponse.substring(storyboardIndex + 3).trim();
                }
            }

            if (title == null || title.isBlank()) {
                title = "熊猫北极熊神评热点新闻";
            }

            // 合并梗概和分镜作为完整summary
            String fullSummary = (summary != null ? summary + "\n\n" : "") +
                    (storyboard != null ? storyboard : "");

            return Story.builder()
                    .title(title.trim())
                    .summary(fullSummary.trim())
                    .tone(tone != null ? tone.trim().toUpperCase() : "IRONIC")
                    .durationHint(durationHint != null ? durationHint.trim() : "1-3分钟")
                    .status("DRAFT")
                    .build();
        } catch (Exception e) {
            log.error("解析AI生成故事失败: {}", e.getMessage());
            return createFallbackStory(news, 0);
        }
    }

    private Story createFallbackStory(HotNewsService.HotNewsResult news, int index) {
        String topic = news.getTitle() != null && news.getTitle().length() > 10
                ? news.getTitle().substring(0, 10) : news.getTitle();

        String[] templates = {
            "熊猫刷到「%s」当场破防，北极熊神点评一夜爆火",
            "北极熊偶遇热搜「%s」，熊猫非要插一脚，结果…",
            "新闻「%s」引发热议，熊猫北极熊这对冤家又杠上了",
        };

        String[] summaries = {
            """
            【开场】熊猫刷手机看到热搜「%s」，眼睛瞪圆
            【发展】熊猫激动地去找北极熊：快看快看！这个新闻太离谱了！
            【高潮】北极熊面无表情：就这？我早就知道了，格局小了。
            【反转】熊猫不服气开始长篇大论，北极熊一针见血吐槽
            【结尾】熊猫语塞，北极熊来了一句神评论，全网爆火

            金句：格局打开，世界比你想象的精彩！
            """,
            """
            【开场】北极熊在刷微博，看到「%s」热搜，冷笑一声
            【发展】熊猫凑过来非要一起讨论，两人观点完全相反
            【高潮】熊猫越说越激动，北极熊越听越无语
            【反转】最后发现新闻另有隐情，两人都沉默了

            金句：有时候真相比谣言更离谱。
            """,
            """
            【开场】熊猫和北极熊在聊天，提到最近的热点「%s」
            【发展】熊猫一本正经分析，北极熊全程拆台
            【高潮】熊猫突然灵光一闪，说出一个惊人观点
            【结尾】北极熊听完沉默三秒，然后笑喷了

            金句：认真的你就输了，但开心的你赢了！
            """,
        };

        String title = String.format(templates[index % templates.length], topic != null ? topic : "热点新闻");
        String summary = String.format(summaries[index % summaries.length],
                news.getTitle() != null ? news.getTitle() : "热点新闻");

        String[] tones = {"IRONIC", "ABSURD", "DEADPAN"};

        return Story.builder()
                .title(title)
                .summary(summary)
                .tone(tones[index % tones.length])
                .durationHint("1-3分钟")
                .status("DRAFT")
                .build();
    }

    /**
     * 保留旧方法但更新内容 - 使用新闻ID和随机数增加多样性
     */
    @Transactional
    public List<Story> generateStoriesFromNews(List<NewsItem> newsList) {
        List<Story> stories = new ArrayList<>();
        
        // 随机选择3条不同的新闻
        List<NewsItem> shuffled = new ArrayList<>(newsList);
        java.util.Collections.shuffle(shuffled);
        int count = Math.min(3, shuffled.size());

        for (int i = 0; i < count; i++) {
            NewsItem news = shuffled.get(i);
            // 使用新闻ID和随机数生成更多变化
            int seed = (int)(news.getId() != null ? news.getId() : i + 1);
            String title = generateStoryTitle(news.getTitle(), seed);
            String summary = generateStorySummary(news.getTitle(), news.getContent(), seed);
            String tone = new String[]{"IRONIC", "ABSURD", "DEADPAN", "SARCASTIC"}[seed % 4];

            Story story = Story.builder()
                    .title(title)
                    .summary(summary)
                    .tone(tone)
                    .durationHint("1-3分钟")
                    .status("DRAFT")
                    .sourceNewsId(news.getId())
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
        String topic = newsTitle != null && newsTitle.length() > 15
                ? newsTitle.substring(0, 15) : (newsTitle != null ? newsTitle : "新闻");
        return String.format(templates[index % templates.length],
                topic.replaceAll("[^\\u4e00-\\u9fa5a-zA-Z0-9]", ""), topic);
    }

    private String generateStorySummary(String newsTitle, String newsContent, int index) {
        String base = newsContent != null && !newsContent.isBlank() ? newsContent : (newsTitle != null ? newsTitle : "热点新闻");
        String[] summaries = {
            String.format("""
                熊猫兴奋地刷到新闻：'%s'，立刻去找北极熊分享。
                北极熊面无表情地说：'这有什么稀奇的，我早就知道了。'
                熊猫不服气，开始长篇大论分析，北极熊一针见血吐槽，场面一度失控…

                金句：认真你就输了，但开心最重要！
                时长提示：约2分钟
                """, newsTitle != null ? newsTitle : "热点"),
            String.format("""
                北极熊偶然看到新闻'%s'，冷笑一声。
                熊猫凑过来，非要一起讨论，结果两人观点完全相反。
                熊猫越说越激动，北极熊越听越无语，最后北极熊来了一句神吐槽，熊猫当场语塞…

                金句：格局小了，视野要打开！
                时长提示：约2分钟
                """, base.length() > 20 ? base.substring(0, 20) : base),
            String.format("""
                新闻'%s'登上热搜，熊猫激动地拉着北极熊要拍视频。
                北极熊一脸嫌弃，但还是配合出演。
                熊猫一本正经胡说八道，北极熊冷眼旁观疯狂拆台，镜头前的观众笑疯了…

                金句：专业团队，顶级配合！
                时长提示：约1-2分钟
                """, newsTitle != null ? newsTitle : "热点"),
        };
        return summaries[index % summaries.length];
    }
}
