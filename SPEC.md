# storyboard-ai

> AI 故事 + 分镜工作站 | 熊猫 × 北极熊 搞笑反讽 IP

---

## 1. Project Overview

**Core Functionality**: An AI-powered story and storyboard generation platform for creating comedic short videos featuring two characters (a talkative panda and a sarcastic polar bear) that comment on current events with satirical humor.

**Target Users**: Content creators who want to produce AI-generated story videos efficiently without writing every story beat and storyboard manually.

**Workflow**:
```
[System] Daily hot news scan
    ↓
[AI] Generate 3-5 story concepts per day
    ↓
[User] Picks one story to develop
    ↓
[AI] Generate: story summary + storyboards + first/last frame images + image-to-video prompts
    ↓
[User] Creates video using their own video generation tools
```

---

## 2. Technical Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend | Spring Boot 3.x (Java 17+, Java programmer's familiar stack) |
| Database | MySQL 8.0 |
| AI Provider | MiniMax (text + image generation via hailuo) |
| Deployment | GitHub Codespaces (one-click preview) |

### Project Structure

```
storyboard-ai/
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── page.tsx       # Dashboard / Home
│   │   ├── stories/
│   │   │   └── page.tsx   # Story list + generation
│   │   ├── storyboards/
│   │   │   └── [id]/page.tsx  # Storyboard detail
│   │   └── characters/
│   │       └── page.tsx   # Character profile management
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/                # Spring Boot app
│   ├── src/main/java/
│   │   └── com/storyboardai/
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── entity/
│   │       └── config/
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── docs/                   # Documentation
├── SPEC.md
└── README.md
```

---

## 3. Functionality Specification

### 3.1 Hot News Scanner (Daily Auto-Run)

- Fetches trending news via Tavily API or RSS feeds
- Filters news suitable for satirical commentary (tech, society, politics, entertainment)
- Stores raw news in MySQL with timestamp
- Runs daily at configurable time (default: 08:00)

### 3.2 Story Generation

- **Input**: Latest hot news
- **Output**: 3-5 story concepts per day
- **Format per concept**:
  - Story title
  - Story summary (3-5 sentences)
  - Suggested tone (absurd, ironic, deadpan, etc.)
  - Estimated duration (short: <30s, medium: 30-60s)
- **Characters**: Panda (talkative) + Polar Bear (sarcastic, deadpan)
- **Style**: Realistic animals, comedic, satirical, current-event-focused
- **Model**: MiniMax text generation API

### 3.3 Character System

- **Panda**: Talkative, enthusiastic, tends to over-explain, optimistic
- **Polar Bear**: Deadpan, sarcastic, short responses, voice of reason
- **Character Image**: Realistic style, consistent appearance across all storyboards
- **Image Generation**: MiniMax `image-01` model
- **First/Last Frame**: Always generated for each story

### 3.4 Storyboard Generation

After user selects a story:

1. **Story Breakdown**: Split story into scenes/shots
2. **Per Scene Generate**:
   - Scene description (action, dialogue, camera angle)
   - Image prompt (for image-to-video model)
   - Video prompt (concise, action-focused)
3. **Consistent Characters**: Each scene maintains character appearance
4. **Output**: JSON structure with all prompts ready for copy

### 3.5 User Interface

#### Dashboard (Home)
- Today's hot news count
- Story concepts pending review
- Recent completed storyboards
- Quick-start: Generate new story

#### Story List Page
- Card grid of all generated stories
- Filter: date, status (draft, approved, archived)
- Click to expand: story summary + approve/reject buttons

#### Storyboard Detail Page
- Story overview at top
- Storyboard panel: scene-by-scene breakdown
  - Scene number
  - Description
  - Image preview (placeholder before generation)
  - Image prompt (copy button)
  - Video prompt (copy button)
- First frame / Last frame display
- Export all prompts as JSON

#### Character Profile Page
- Character cards: Panda + Polar Bear
- Name, personality, visual description
- Reference images (uploaded or AI-generated)
- Edit character description → triggers new reference image generation

---

## 4. Data Model

### Story
```
id: Long (PK)
title: String
summary: String
tone: String (ABSURD, IRONIC, DEADPAN, etc.)
duration_hint: String (SHORT, MEDIUM)
source_news_id: Long (FK, nullable)
status: Enum (DRAFT, APPROVED, ARCHIVED)
created_at: DateTime
updated_at: DateTime
```

### Scene
```
id: Long (PK)
story_id: Long (FK)
sequence: Int (1, 2, 3...)
description: String
image_prompt: String
video_prompt: String
first_frame: Boolean (default false)
last_frame: Boolean (default false)
generated_image_url: String (nullable)
created_at: DateTime
```

### Character
```
id: Long (PK)
name: String (Panda | PolarBear)
personality: String
visual_description: String (text for image generation)
reference_image_url: String
created_at: DateTime
updated_at: DateTime
```

### NewsItem
```
id: Long (PK)
title: String
content: String
source_url: String
source_name: String
published_at: DateTime
fetched_at: DateTime
```

---

## 5. API Design

### Backend REST Endpoints

```
GET    /api/news              - List recent news items
GET    /api/news/latest       - Get latest news for story gen

GET    /api/stories           - List stories (with pagination)
POST   /api/stories/generate  - Trigger story generation from news
GET    /api/stories/{id}     - Get story detail
PUT    /api/stories/{id}      - Update story (approve, archive)

GET    /api/stories/{id}/scenes     - Get scenes for a story
POST   /api/stories/{id}/scenes/generate  - Generate scenes + images

GET    /api/characters        - List characters
PUT    /api/characters/{id}   - Update character profile
POST   /api/characters/{id}/generate-image - Regenerate reference image
```

### Frontend → Backend

- Next.js calls backend via `http://localhost:8080/api/...` in dev
- In production, backend exposes same endpoints

---

## 6. MiniMax Integration

### Image Generation
- Model: `image-01` (confirmed working)
- Endpoint: `POST https://api.minimax.chat/v1/image_generation`
- Character reference images: Generated once, stored in DB
- Storyboard scene images: Generated on-demand per scene

### Text Generation
- Model: MiniMax text completion (or compatible chat endpoint)
- Used for: story concept generation, scene breakdowns, video prompts

### Rate Limits
- Respect MiniMax API quotas
- Queue generation requests if needed

---

## 7. Deployment

### GitHub Codespaces
- One-click setup: `.devcontainer/` config
- Pre-configured: Node.js 18+, Java 17+, MySQL (or embedded H2 for dev)
- Port forwarding: 3000 (Next.js), 8080 (Spring Boot)

### Docker (Future)
- `Dockerfile` for frontend
- `Dockerfile` for backend
- `docker-compose.yml` with MySQL

---

## 8. TODO (Phase 1 - MVP)

- [ ] Initialize monorepo structure
- [ ] Set up Spring Boot backend with MySQL
- [ ] Implement Character entity + API (seed data: Panda + Polar Bear)
- [ ] Implement NewsItem entity + API
- [ ] Implement Story entity + API
- [ ] Implement Scene entity + API
- [ ] MiniMax text API integration for story generation
- [ ] MiniMax image API integration for character reference images
- [ ] Set up Next.js frontend
- [ ] Dashboard page
- [ ] Story list + generation page
- [ ] Storyboard detail page
- [ ] Character profile page
- [ ] Hot news scraper (Tavily)
- [ ] .devcontainer for GitHub Codespaces
- [ ] README + documentation

---

## 9. Open Questions (Deferred)

- Video model integrations (user handles this externally)
- User authentication (not needed for MVP, public project)
- Storyboard image storage (S3? Local? OSS?) — default to local for MVP
- Multi-language support (future)
