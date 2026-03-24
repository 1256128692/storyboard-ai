package com.storyboardai.controller;

import com.storyboardai.entity.Character;
import com.storyboardai.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;

    @GetMapping
    public ResponseEntity<List<Character>> getAllCharacters() {
        return ResponseEntity.ok(characterService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Character> getCharacterById(@PathVariable Long id) {
        return characterService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Character> getCharacterByName(@PathVariable String name) {
        return characterService.findByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Character> createCharacter(@RequestBody Character character) {
        return ResponseEntity.ok(characterService.save(character));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Character> updateCharacter(@PathVariable Long id, @RequestBody Character character) {
        Optional<Character> existing = characterService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Character saved = existing.get();
        if (character.getPersonality() != null) saved.setPersonality(character.getPersonality());
        if (character.getVisualDescription() != null) saved.setVisualDescription(character.getVisualDescription());
        if (character.getReferenceImageUrl() != null) saved.setReferenceImageUrl(character.getReferenceImageUrl());
        return ResponseEntity.ok(characterService.save(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharacter(@PathVariable Long id) {
        characterService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<Character> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Character> existing = characterService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            String ext = switch (file.getContentType()) {
                case "image/png" -> "png";
                case "image/jpeg", "image/jpg" -> "jpg";
                default -> "png";
            };
            String filename = id + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + ext;
            Path staticPath = Paths.get("src/main/resources/static/images");
            Files.createDirectories(staticPath);
            Path filePath = staticPath.resolve(filename);
            try (OutputStream os = Files.newOutputStream(filePath)) {
                os.write(file.getBytes());
            }
            String imageUrl = "/images/" + filename;
            Character saved = existing.get();
            saved.setReferenceImageUrl(imageUrl);
            return ResponseEntity.ok(characterService.save(saved));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
