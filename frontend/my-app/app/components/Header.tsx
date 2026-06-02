import Link from "next/link"

interface HeaderProps {
  name: string
}

export default function Header({ name }: HeaderProps) {
  return (
    <header className="w-screen p-4 border-b-2 border-b-gray-300 flex items-center justify-around">
      <h1 className="text-2xl font-bold">{name}</h1>
      <nav className="flex gap-[2vw]">
        <Link href="/">Usuarios</Link>
        <Link href="/devices">Dispositivos</Link>
      </nav>
    </header>
  )
}
