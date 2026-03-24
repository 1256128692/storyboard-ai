import { useState, useRef } from "react";

interface CharacterCardProps {
  character: any;
  onUpdate: (id: number, data: any) => void;
  onRegenerate: (id: number) => void;
}

const characterEmoji: Record<string, string> = {
  PANDA: "🐼",
  POLAR_BEAR: "🐻‍❄️",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getImageUrl(url: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url}`;
}

export default function CharacterCard({ character, onUpdate, onRegenerate }: CharacterCardProps) {
  const [editing, setEditing] = useState(false);
  const [visualDescription, setVisualDescription] = useState(character.visualDescription ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(character.id, { visualDescription });
    setEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/api/characters/${character.id}/image`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdate(character.id, { referenceImageUrl: updated.referenceImageUrl });
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-5">
        {/* 角色图片 */}
        <div className="relative shrink-0">
          {character.referenceImageUrl ? (
            <img
              src={getImageUrl(character.referenceImageUrl)}
              alt={character.name}
              className="w-28 h-28 rounded-xl object-cover bg-gray-100"
            />
          ) : (
            <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-5xl">
              {characterEmoji[character.name] || "❓"}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white text-xs">上传中...</div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">
            {characterEmoji[character.name]} {character.name === "PANDA" ? "熊猫" : character.name === "POLAR_BEAR" ? "北极熊" : character.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1 bg-gray-50 rounded p-2">{character.personality}</p>

          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">🎨 视觉描述</p>
            {editing ? (
              <textarea
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:border-header"
                rows={3}
                placeholder="描述角色的外貌特征、穿着、表情等..."
              />
            ) : (
              <p className="text-sm text-gray-700 bg-blue-50 rounded p-2">{character.visualDescription}</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 mt-3 text-xs text-yellow-700">
            💡 修改视觉描述后，点击「🔄 AI生成图片」可更新角色形象
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-header text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-800 transition"
                >
                  💾 保存
                </button>
                <button
                  onClick={() => { setEditing(false); setVisualDescription(character.visualDescription ?? ""); }}
                  className="border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  取消
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="border border-header text-header text-sm px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
                >
                  ✏️ 编辑描述
                </button>
                <button
                  onClick={() => onRegenerate(character.id)}
                  className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
                >
                  🔄 AI生成图片
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition"
                >
                  📤 上传图片
                </button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
