interface StoryCardProps {
  story: any;
  expanded: boolean;
  alternate: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onArchive: () => void;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function StoryCard({ story, expanded, alternate, onToggle, onApprove, onArchive }: StoryCardProps) {
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
            {story.status}
          </span>
        </div>
        <span className="text-gray-400">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <p className="text-gray-600 text-sm">{story.description}</p>
          <div className="flex gap-3">
            {story.status === "DRAFT" && (
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(); }}
                className="bg-green-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>
            )}
            {story.status !== "ARCHIVED" && (
              <button
                onClick={(e) => { e.stopPropagation(); onArchive(); }}
                className="border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
