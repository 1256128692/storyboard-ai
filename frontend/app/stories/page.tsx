"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import StoryCard from "@/components/StoryCard";

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [message, setMessage] = useState<{type: "success"|"error"|"info", text: string} | null>(null);

  useEffect(() => {
    api.getStories().then((data) => { setStories(data); setLoading(false); }).catch(() => { setLoading(false); });
  }, []);

  const showMsg = (type: "success"|"error"|"info", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    setMessage({ type: "info", text: "🤖 正在根据今日热点生成故事，请稍等..." });
    try {
      const result = await api.generateStories();
      if (result && result.stories && result.stories.length > 0) {
        const updated = await api.getStories();
        setStories(updated);
        showMsg("success", `✅ 生成成功！生成了 ${result.stories.length} 个故事，快去看看吧！`);
      } else {
        showMsg("error", "⚠️ 生成未返回结果，请检查后端日志");
      }
    } catch (e: any) {
      console.error(e);
      showMsg("error", `❌ 生成失败：${e?.message || "未知错误"}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.updateStory(id, { status: "APPROVED" });
      const data = await api.getStories();
      setStories(data);
      showMsg("success", "✅ 故事已通过审核！可以进入分镜生成阶段了");
    } catch (e) {
      showMsg("error", "❌ 操作失败");
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await api.updateStory(id, { status: "ARCHIVED" });
      const data = await api.getStories();
      setStories(data);
      showMsg("info", "📁 故事已归档");
    } catch (e) {
      showMsg("error", "❌ 操作失败");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个故事吗？此操作不可恢复。")) {
      try {
        await api.deleteStory(id);
        // 直接从本地状态中移除故事，不需要重新获取所有故事
        setStories(prevStories => prevStories.filter(story => story.id !== id));
        showMsg("success", "🗑️ 故事已删除");
      } catch (e) {
        showMsg("error", "❌ 删除失败");
      }
    }
  };

  const draftCount = stories.filter((s) => s.status === "DRAFT").length;

  if (loading) return <div className="text-gray-500 p-8">加载中...</div>;

  return (
    <div>
      {/* 顶部提示条 */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium max-w-sm ${
          message.type === "success" ? "bg-green-600" : message.type === "error" ? "bg-red-600" : "bg-blue-600"
        }`}>
          {message.text}
        </div>
      )}

      {/* 页面引导 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">📖 故事列表</p>
        <p>这里展示AI生成的所有故事。点击卡片展开查看故事梗概，审核通过后会生成正式分镜。</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">故事管理</h1>
          <p className="text-sm text-gray-500 mt-1">
            共 {stories.length} 个故事 · {draftCount} 个待审核
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-header text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-800 transition disabled:opacity-60 flex items-center gap-2 shadow-md"
        >
          {generating ? (
            <>
              <span className="animate-spin">⏳</span> AI生成中，请稍等...
            </>
          ) : (
            <>
              🤖 从热点新闻生成故事
            </>
          )}
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
        <p><strong>💡 提示：</strong>点击「通过审核」后，故事会进入分镜生成阶段。归档的故事不会丢失，可以随时恢复。</p>
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
            onDelete={() => handleDelete(story.id)}
          />
        ))}
        {stories.length === 0 && !generating && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-gray-400 text-lg mb-2">还没有故事</p>
            <p className="text-gray-400 text-sm">点击上方「🤖 从热点新闻生成故事」开始创作吧！</p>
          </div>
        )}
        {generating && stories.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-blue-100">
            <p className="text-5xl mb-4 animate-spin">🤖</p>
            <p className="text-blue-600 text-lg">AI正在创作中...</p>
            <p className="text-gray-400 text-sm mt-1">正在根据今日热点构思故事，请稍等几秒</p>
          </div>
        )}
      </div>
    </div>
  );
}
