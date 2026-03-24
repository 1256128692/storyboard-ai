"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [stories, setStories] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);

  const today = new Date().toLocaleDateString("zh-CN", {
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
      {/* 引导说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">👋 欢迎使用 Storyboard AI！</p>
        <p>
          这是一个熊猫 🐼 × 北极熊 🐻‍❄️ 搞笑IP创作助手。每天自动抓取热点新闻，AI生成故事思路，你审核后自动生成分镜图和视频提示词。
        </p>
      </div>

      <p className="text-gray-500 mb-6">{today}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">⏳ 待审核故事</h2>
          <p className="text-4xl font-bold text-header">{pendingStories.length}</p>
          <p className="text-sm text-gray-400 mt-1">AI新生成的故事，等待你的审核</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">✅ 已完成故事</h2>
          <p className="text-4xl font-bold text-green-600">{recentCompleted.length}</p>
          <p className="text-sm text-gray-400 mt-1">已审核通过，可以生成视频啦</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200 text-sm text-gray-600">
        <p className="font-semibold text-gray-700 mb-2">💡 工作流程说明</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>点击「<strong>生成故事</strong>」，AI会根据今日热点生成3-5个故事思路</li>
          <li>在故事列表中审核，点击「✅ 通过」选择一个故事</li>
          <li>进入故事详情，生成「🎬 分镜图」和「📝 视频提示词」</li>
          <li>复制提示词，去你的视频软件出视频吧！</li>
        </ol>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-header text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-2"
        >
          {generating ? "🤖 AI生成中..." : "🤖 生成故事"}
        </button>
        <Link
          href="/stories"
          className="border border-header text-header px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition flex items-center gap-2"
        >
          📖 查看所有故事
        </Link>
      </div>

      {recentCompleted.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🆕 最近完成的故事</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCompleted.map((story) => (
              <Link
                key={story.id}
                href={`/storyboards/${story.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
              >
                <h4 className="font-medium text-gray-800 truncate">{story.title}</h4>
                <p className="text-sm text-green-500 mt-1">✅ 已通过</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
