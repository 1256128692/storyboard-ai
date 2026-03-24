"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [stories, setStories] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    api.getStories().then(setStories).catch(console.error);
  }, []);

  const pendingStories = stories.filter((s) => s.status === "DRAFT");
  const recentCompleted = stories
    .filter((s) => s.status === "APPROVED")
    .slice(0, 3);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateStories();
      const updated = await api.getStories();
      setStories(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <p className="text-gray-500 mb-6">{today}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Pending Stories</h2>
          <p className="text-4xl font-bold text-header">{pendingStories.length}</p>
          <p className="text-sm text-gray-400 mt-1">stories awaiting approval</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Recent Completed</h2>
          <p className="text-4xl font-bold text-green-600">{recentCompleted.length}</p>
          <p className="text-sm text-gray-400 mt-1">approved storyboards</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-header text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Stories"}
        </button>
        <Link
          href="/stories"
          className="border border-header text-header px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
        >
          View All Stories
        </Link>
      </div>

      {recentCompleted.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Storyboards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCompleted.map((story) => (
              <Link
                key={story.id}
                href={`/storyboards/${story.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
              >
                <h4 className="font-medium text-gray-800 truncate">{story.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{story.status}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
