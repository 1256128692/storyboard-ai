import Link from "next/link";

interface StoryCardProps {
  story: any;
  expanded: boolean;
  alternate: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const statusLabels: Record<string, string> = {
  DRAFT: "待审核",
  APPROVED: "已通过",
  ARCHIVED: "已归档",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

const toneLabels: Record<string, string> = {
  ABSURD: "荒诞",
  IRONIC: "反讽",
  DEADPAN: "冷幽默",
  SARCASTIC: "讽刺",
};

export default function StoryCard({ story, expanded, alternate, onToggle, onApprove, onArchive, onDelete }: StoryCardProps) {
  return (
    <div
      className={`rounded-xl border transition cursor-pointer ${
        alternate ? "bg-gray-50 border-gray-100" : "bg-white border-gray-100"
      } hover:shadow-md`}
      onClick={onToggle}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-800">{story.title}</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[story.status] || "bg-gray-100 text-gray-500"}`}>
            {statusLabels[story.status] || story.status}
          </span>
          {story.tone && (
            <span className="text-xs text-gray-400">
              {toneLabels[story.tone] || story.tone}
            </span>
          )}
        </div>
        <span className="text-gray-400">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
            💡 <strong>故事梗概：</strong>{story.summary || story.description}
          </div>
          <div className="flex gap-3">
            {story.status === "DRAFT" && (
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(); }}
                className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition"
              >
                ✅ 通过审核
              </button>
            )}
            {story.status !== "ARCHIVED" && (
              <button
                onClick={(e) => { e.stopPropagation(); onArchive(); }}
                className="border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                📁 归档
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="border border-red-300 text-red-600 text-sm px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
            >
              🗑️ 删除
            </button>
            <Link
              href={`/storyboards/${story.id}`}
              className="border border-blue-300 text-blue-600 text-sm px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
              onClick={(e) => e.stopPropagation()}
            >
              🎬 查看分镜 →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
