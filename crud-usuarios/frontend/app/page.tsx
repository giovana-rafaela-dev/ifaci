// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/app/components/Header";
import CriarUsuario from "@/app/components/CriarUsuario";
import ListarUsuarios from "@/app/components/ListarUsuarios";
import { Usuario } from "@/types/usuario";

const URL_API = "http://localhost:5056/usuarios";

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(false);

  const buscarUsuarios = useCallback(async () => {
    setCarregando(true);
    setErroConexao(false);
    try {
      const res = await fetch(URL_API);
      if (!res.ok) throw new Error();
      const data: Usuario[] = await res.json();
      setUsuarios(data);
    } catch {
      setErroConexao(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarUsuarios();
  }, [buscarUsuarios]);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center gap-8 p-8">
        {erroConexao && (
          <div className="w-full max-w-2xl bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-xl text-sm">
            ⚠️ Não foi possível conectar ao backend. Verifique se o servidor C# está rodando em{" "}
            <strong>http://localhost:5056</strong>.
          </div>
        )}

        <CriarUsuario onUsuarioCriado={buscarUsuarios} />

        {carregando ? (
          <p className="text-gray-500">Carregando usuários...</p>
        ) : (
          <ListarUsuarios usuarios={usuarios} onAtualizar={buscarUsuarios} />
        )}
      </div>
    </main>
  );
}