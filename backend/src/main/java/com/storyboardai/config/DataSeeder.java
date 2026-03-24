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
                "A lovable but slightly dim-witted panda who stumbles through life with genuine enthusiasm. Prone to long pauses and obvious observations.",
                "A round, fluffy giant panda with distinctive black eye patches, sitting awkwardly while eating bamboo, simple white background, cartoon style",
                null);

        seedCharacter("POLAR_BEAR",
                "A deadpan, world-weary polar bear who delivers dry commentary on the absurdity of existence. Sarcastic but secretly caring.",
                "An elegant white polar bear standing upright like a person, wearing a tiny scarf, looking mildly unimpressed, simple white background, cartoon style",
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
