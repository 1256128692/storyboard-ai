"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function StoryboardPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const storyId = Number(id);
    Promise.all([api.getStory(storyId), api.getScenes(storyId)])
      .then(([s, sc]) => { setStory(s); setScenes(sc); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleGenerateAllImages = async () => {
    for (const scene of scenes) {
      // placeholder — wire to your backend as needed
      console.log("generate image for scene", scene.id);
    }
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!story) return <div className="text-gray-400">Story not found.</div>;

  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{story.title}</h1>
        <p className="text-gray-600">{story.description}</p>
        <div className="mt-3">
          <span className="inline-block bg-blue-100 text-header text-sm px-3 py-1 rounded-full font-medium">
            {story.status}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Scenes</h2>
        <button
          onClick={handleGenerateAllImages}
          className="bg-header text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
        >
          Generate All Images
        </button>
      </div>

      <div className="space-y-4">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${
              idx === 0 ? "border-l-4 border-l-green-400" : idx === scenes.length - 1 ? "border-l-4 border-l-red-400" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Scene {scene.order ?? idx + 1}
                  {idx === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">First Frame</span>}
                  {idx === scenes.length - 1 && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Last Frame</span>}
                </h3>
                <p className="text-gray-600 mt-1">{scene.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Image Prompt</p>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-gray-700 flex-1">{scene.imagePrompt}</p>
                  <button
                    onClick={() => copyToClipboard(scene.imagePrompt)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-600 px-2 py-1 rounded transition shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Video Prompt</p>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-gray-700 flex-1">{scene.videoPrompt}</p>
                  <button
                    onClick={() => copyToClipboard(scene.videoPrompt)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-600 px-2 py-1 rounded transition shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {scenes.length === 0 && (
          <p className="text-gray-400 text-center py-10">No scenes yet.</p>
        )}
      </div>
    </div>
  );
}
