const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = {
  // News
  getNews: () => fetch(`${API_BASE}/news`).then(r => r.json()),
  getLatestNews: () => fetch(`${API_BASE}/news/latest`).then(r => r.json()),

  // Stories
  getStories: () => fetch(`${API_BASE}/stories`).then(r => r.json()),
  generateStories: () => fetch(`${API_BASE}/stories/generate`, { method: 'POST' }).then(r => r.json()),
  getStory: (id: number) => fetch(`${API_BASE}/stories/${id}`).then(r => r.json()),
  updateStory: (id: number, data: any) => fetch(`${API_BASE}/stories/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),

  // Scenes
  getScenes: (storyId: number) => fetch(`${API_BASE}/stories/${storyId}/scenes`).then(r => r.json()),
  generateScenes: (storyId: number) => fetch(`${API_BASE}/stories/${storyId}/scenes/generate`, { method: 'POST' }).then(r => r.json()),

  // Characters
  getCharacters: () => fetch(`${API_BASE}/characters`).then(r => r.json()),
  updateCharacter: (id: number, data: any) => fetch(`${API_BASE}/characters/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  generateCharacterImage: (id: number) => fetch(`${API_BASE}/characters/${id}/generate-image`, { method: 'POST' }).then(r => r.json()),
}
