"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StoryboardPage() {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const storyId = Number(id);
    Promise.all([api.getStory(storyId), api.getScenes(storyId)])
      .then(([s, sc]) => { setStory(s); setScenes(sc); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerateAllImages = async () => {
    // TODO: 调用后端API生成所有场景图片
    for (const scene of scenes) {
      console.log("generate image for scene", scene.id);
    }
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;
  if (!story) return <div className="text-gray-400">故事不存在</div>;

  const statusLabels: Record<string, string> = {
    DRAFT: "待审核",
    APPROVED: "已通过",
    ARCHIVED: "已归档",
  };

  return (
    <div>
      {/* 页面引导 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">🎬 故事分镜详情</p>
        <p>这里展示故事的所有分镜。每个分镜包含「🎨 图片提示词」和「🎬 视频提示词」。复制提示词后，去你的视频生成工具制作视频吧！</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">📖 {story.title}</h1>
            <p className="text-gray-600">{story.summary || story.description}</p>
          </div>
          <Link
            href="/stories"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline shrink-0"
          >
            ← 返回故事列表
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="inline-block bg-blue-100 text-header text-sm px-3 py-1 rounded-full font-medium">
            {statusLabels[story.status] || story.status}
          </span>
          <span className="text-sm text-gray-400">
            共 {scenes.length} 个分镜
          </span>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
        <p><strong>💡 使用说明：</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
          <li><strong>🎨 图片提示词</strong>：复制后用于生成图片（可用 Midjourney、Hailuo 等工具）</li>
          <li><strong>🎬 视频提示词</strong>：复制后用于图片转视频（可用 Hailuo、即梦等工具）</li>
          <li><strong>首帧/尾帧</strong>：绿色左边框=首帧，红色左边框=尾帧，每条故事都有</li>
        </ul>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">🎞️ 分镜列表</h2>
        <button
          onClick={handleGenerateAllImages}
          className="bg-header text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
        >
          🔄 批量生成图片（开发中）
        </button>
      </div>

      <div className="space-y-4">
        {scenes.map((scene, idx) => (
          <div
            key={scene.id}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${
              idx === 0 ? "border-l-4 border-l-green-500" : idx === scenes.length - 1 ? "border-l-4 border-l-red-500" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  🎬 第 {scene.sequence || idx + 1} 场
                  {idx === 0 && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">首帧</span>}
                  {idx === scenes.length - 1 && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">尾帧</span>}
                </h3>
                <p className="text-gray-600 mt-2 bg-gray-50 rounded p-2 text-sm">{scene.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 mb-1">🎨 图片提示词</p>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{scene.imagePrompt || "（暂无提示词）"}</p>
                  <button
                    onClick={() => scene.imagePrompt && copyToClipboard(scene.imagePrompt, `img-${scene.id}`)}
                    className={`text-xs px-2 py-1 rounded transition shrink-0 ${
                      copied === `img-${scene.id}`
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                    }`}
                  >
                    {copied === `img-${scene.id}` ? "✅ 已复制" : "📋 复制"}
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                <p className="text-xs font-semibold text-purple-600 mb-1">🎬 视频提示词</p>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{scene.videoPrompt || "（暂无提示词）"}</p>
                  <button
                    onClick={() => scene.videoPrompt && copyToClipboard(scene.videoPrompt, `vid-${scene.id}`)}
                    className={`text-xs px-2 py-1 rounded transition shrink-0 ${
                      copied === `vid-${scene.id}`
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                    }`}
                  >
                    {copied === `vid-${scene.id}` ? "✅ 已复制" : "📋 复制"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {scenes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-400 text-lg mb-2">还没有分镜</p>
            <p className="text-gray-400 text-sm">请先在故事列表中审核通过一个故事</p>
            <Link href="/stories" className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
              去故事列表 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
