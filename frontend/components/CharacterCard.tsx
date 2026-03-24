import { useState } from "react";

interface CharacterCardProps {
  character: any;
  onUpdate: (id: number, data: any) => void;
  onRegenerate: (id: number) => void;
}

export default function CharacterCard({ character, onUpdate, onRegenerate }: CharacterCardProps) {
  const [editing, setEditing] = useState(false);
  const [visualDescription, setVisualDescription] = useState(character.visualDescription ?? "");

  const handleSave = () => {
    onUpdate(character.id, { visualDescription });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-5">
        {character.referenceImage ? (
          <img
            src={character.referenceImage}
            alt={character.name}
            className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm shrink-0">
            No Image
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">{character.name}</h2>
          <p className="text-sm text-gray-500 mt-0.5">{character.personality}</p>

          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Visual Description</p>
            {editing ? (
              <textarea
                value={visualDescription}
                onChange={(e) => setVisualDescription(e.target.value)}
                className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg p-2 resize-none focus:outline-none focus:border-header"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700">{character.visualDescription}</p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-header text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-800 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditing(false); setVisualDescription(character.visualDescription ?? ""); }}
                  className="border border-gray-300 text-gray-600 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="border border-header text-header text-sm px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
                >
                  Edit Description
                </button>
                <button
                  onClick={() => onRegenerate(character.id)}
                  className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-purple-700 transition"
                >
                  Regenerate Image
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
