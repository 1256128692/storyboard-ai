interface SceneCardProps {
  scene: any;
  index: number;
  total: number;
}

export default function SceneCard({ scene, index, total }: SceneCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${isFirst ? "border-l-4 border-l-green-400" : isLast ? "border-l-4 border-l-red-400" : ""}`}>
      <div className="mb-3">
        <h3 className="font-semibold text-gray-800">
          Scene {scene.order ?? index + 1}
          {isFirst && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">First Frame</span>}
          {isLast && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Last Frame</span>}
        </h3>
        <p className="text-gray-600 mt-1">{scene.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  );
}
