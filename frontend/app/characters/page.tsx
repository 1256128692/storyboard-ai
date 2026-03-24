"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CharacterCard from "@/components/CharacterCard";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newChar, setNewChar] = useState({ name: "", personality: "", visualDescription: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.getCharacters()
      .then((data) => { setCharacters(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = async (id: number, data: any) => {
    const updated = await api.updateCharacter(id, data);
    setCharacters((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleRegenerate = async (id: number) => {
    const updated = await api.generateCharacterImage(id);
    setCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const handleCreate = async () => {
    if (!newChar.name.trim()) return;
    setCreating(true);
    try {
      const created = await api.createCharacter(newChar);
      setCharacters((prev) => [...prev, created]);
      setNewChar({ name: "", personality: "", visualDescription: "" });
      setShowModal(false);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="text-gray-500">加载中...</div>;

  return (
    <div>
      {/* 页面引导 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800">
        <p className="font-semibold mb-1">🐼 角色管理</p>
        <p>管理熊猫和北极熊的形象。每个角色的外貌描述决定了后续所有分镜图中人物的外观，请谨慎修改。</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">角色设定</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-header text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-800 transition flex items-center gap-2"
        >
          ➕ 新增角色
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-800">
        <p><strong>💡 角色设定说明：</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-0.5">
          <li><strong>熊猫</strong>：话痨、热情、偶尔犯傻，喜欢长篇大论解释显而易见的事情</li>
          <li><strong>北极熊</strong>：高冷、吐槽、毒舌但内心温暖，短句回应为主</li>
        </ul>
        <p className="mt-2">服装细节：熊猫=贝雷帽+黑色外套；北极熊=橘黄色囚服风格开衫</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onUpdate={handleUpdate}
            onRegenerate={handleRegenerate}
          />
        ))}
      </div>

      {/* 新增角色弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">➕ 新增角色</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">角色名称（英文，用于系统标识）</label>
                <input
                  type="text"
                  value={newChar.name}
                  onChange={(e) => setNewChar({ ...newChar, name: e.target.value.toUpperCase().replace(/\s/g, "_") })}
                  placeholder="例如: PANDA_2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-header"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性格描述</label>
                <textarea
                  value={newChar.personality}
                  onChange={(e) => setNewChar({ ...newChar, personality: e.target.value })}
                  placeholder="例如: 话痨、热情、偶尔犯傻"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-header"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">视觉描述（用于AI生成图片）</label>
                <textarea
                  value={newChar.visualDescription}
                  onChange={(e) => setNewChar({ ...newChar, visualDescription: e.target.value })}
                  placeholder="描述角色外貌、服装、姿态等"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-header"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => { setShowModal(false); setNewChar({ name: "", personality: "", visualDescription: "" }); }}
                className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={!newChar.name.trim() || creating}
                className="bg-header text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
              >
                {creating ? "创建中..." : "创建角色"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
