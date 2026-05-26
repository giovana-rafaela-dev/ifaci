// app/components/Header.tsx
export default function Header() {
  return (
    <header className="w-full bg-red-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">👤 Gerenciador de Usuários</h1>
        <span className="text-sm opacity-75">IFAC — Interfaces Industriais</span>
      </div>
    </header>
  );
}