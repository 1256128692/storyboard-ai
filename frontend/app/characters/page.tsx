"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CharacterCard from "@/components/CharacterCard";

export default function CharactersPage() {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Characters</h1>
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
    </div>
  );
}
