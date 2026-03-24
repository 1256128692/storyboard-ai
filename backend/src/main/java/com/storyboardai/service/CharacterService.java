package com.storyboardai.service;

import com.storyboardai.entity.Character;
import com.storyboardai.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CharacterService {

    private final CharacterRepository characterRepository;

    public List<Character> findAll() {
        return characterRepository.findAll();
    }

    public Optional<Character> findById(Long id) {
        return characterRepository.findById(id);
    }

    public Optional<Character> findByName(String name) {
        return characterRepository.findByName(name);
    }

    @Transactional
    public Character save(Character character) {
        return characterRepository.save(character);
    }

    @Transactional
    public void deleteById(Long id) {
        characterRepository.deleteById(id);
    }
}
