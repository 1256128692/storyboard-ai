export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api'
export const IMG_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8081'

export const api = {
  // News
  getNews: () => fetch(`${API_BASE}/news`).then(r => r.json()),
  getLatestNews: () => fetch(`${API_BASE}/news/latest`).then(r => r.json()),

  // Stories
  getStories: () => fetch(`${API_BASE}/stories`).then(r => r.json()),
  generateStories: () => fetch(`${API_BASE}/stories/generate-from-hot-news`, { method: 'POST' }).then(r => r.json()),
  getStory: (id: number) => fetch(`${API_BASE}/stories/${id}`).then(r => r.json()),
  updateStory: (id: number, data: any) => fetch(`${API_BASE}/stories/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  deleteStory: (id: number) => fetch(`${API_BASE}/stories/${id}`, { method: 'DELETE' }).then(r => r.ok ? {} : r.json()),

  // Scenes
  getScenes: (storyId: number) => fetch(`${API_BASE}/stories/${storyId}/scenes`).then(r => r.json()),
  generateScenes: (storyId: number) => fetch(`${API_BASE}/stories/${storyId}/scenes/generate`, { method: 'POST' }).then(r => r.json()),

  // Characters
  getCharacters: () => fetch(`${API_BASE}/characters`).then(r => r.json()),
  createCharacter: (data: any) => fetch(`${API_BASE}/characters`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  updateCharacter: (id: number, data: any) => fetch(`${API_BASE}/characters/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) }).then(r => r.json()),
  deleteCharacter: (id: number) => fetch(`${API_BASE}/characters/${id}`, { method: 'DELETE' }).then(() => true),
  generateCharacterImage: (id: number) => fetch(`${API_BASE}/characters/${id}/generate-image`, { method: 'POST' }).then(r => r.json()),
}

// Resolve image URL: relative paths get IMG_BASE prepended
export function resolveImageUrl(url: string | null): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${IMG_BASE}${url}`
}
