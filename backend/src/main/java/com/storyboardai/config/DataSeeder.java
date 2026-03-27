package com.storyboardai.config;

import com.storyboardai.entity.Character;
import com.storyboardai.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CharacterRepository characterRepository;

    @Override
    public void run(String... args) {
        seedCharacter("PANDA",
                "话痨热情，偶尔犯傻，喜欢长篇大论解释显而易见的事情，乐观积极",
                "写实风格大熊猫，直立行走，贝雷帽，黑色外套，正常的熊猫人体态",
                null);

        seedCharacter("POLAR_BEAR",
                "高冷毒舌，短句回应，冷幽默，内心温暖，理性吐槽",
                "写实风格北极熊，直立行走，橘黄色紧身开衫（囚服风格），正常的北极熊人体态",
                null);
        
        seedCharacter("FOX",
                "聪明，狡猾，喜欢恶作剧",
                "穿着红色西装，戴着礼帽，手里拿着一根拐杖",
                null);
        
        seedCharacter("RABBIT",
                "活泼，可爱，喜欢胡萝卜",
                "穿着粉色连衣裙，戴着粉色蝴蝶结，手里拿着一根胡萝卜",
                null);
        
        seedCharacter("TIGER",
                "勇敢，强壮，有领导力",
                "穿着橙色和黑色条纹的衣服，戴着金色皇冠，手里拿着一把剑",
                null);
    }

    private void seedCharacter(String name, String personality, String visualDescription, String referenceImageUrl) {
        try {
            if (characterRepository.findByName(name).isEmpty()) {
                Character character = Character.builder()
                        .name(name)
                        .personality(personality)
                        .visualDescription(visualDescription)
                        .referenceImageUrl(referenceImageUrl)
                        .build();
                characterRepository.save(character);
            }
        } catch (Exception e) {
            // 忽略重复数据的错误，继续执行
        }
    }
}
