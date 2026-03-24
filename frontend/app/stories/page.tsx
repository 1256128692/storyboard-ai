"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StoryCard from "@/components/StoryCard";

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    api.getStories().then((data) => { setStories(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateStories();
      const data = await api.getStories();
      setStories(data);
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id: number) => {
    await api.updateStory(id, { status: "APPROVED" });
    const data = await api.getStories();
    setStories(data);
  };

  const handleArchive = async (id: number) => {
    await api.updateStory(id, { status: "ARCHIVED" });
    const data = await api.getStories();
    setStories(data);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stories</h1>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-header text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate from News"}
        </button>
      </div>

      <div className="space-y-3">
        {stories.map((story, idx) => (
          <StoryCard
            key={story.id}
            story={story}
            expanded={expandedId === story.id}
            alternate={idx % 2 === 1}
            onToggle={() => setExpandedId(expandedId === story.id ? null : story.id)}
            onApprove={() => handleApprove(story.id)}
            onArchive={() => handleArchive(story.id)}
          />
        ))}
        {stories.length === 0 && (
          <p className="text-gray-400 text-center py-10">No stories yet.</p>
        )}
      </div>
    </div>
  );
}
