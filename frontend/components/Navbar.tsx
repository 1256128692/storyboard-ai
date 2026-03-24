import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-header text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-wide">🎬 Storyboard AI</h1>
        <nav className="flex gap-6 text-sm">
          <Link href="/" className="hover:text-blue-200 transition">
            📊 工作台
          </Link>
          <Link href="/stories" className="hover:text-blue-200 transition">
            📖 故事列表
          </Link>
          <Link href="/characters" className="hover:text-blue-200 transition">
            🐼 角色管理
          </Link>
        </nav>
      </div>
    </header>
  );
}
