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
    }

    private void seedCharacter(String name, String personality, String visualDescription, String referenceImageUrl) {
        if (characterRepository.findByName(name).isEmpty()) {
            Character character = Character.builder()
                    .name(name)
                    .personality(personality)
                    .visualDescription(visualDescription)
                    .referenceImageUrl(referenceImageUrl)
                    .build();
            characterRepository.save(character);
        }
    }
}
