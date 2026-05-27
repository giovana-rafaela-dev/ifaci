"use client";

import { useState } from "react";
import { Usuario } from "@/types/usuario";

interface Props {
  usuarios: Usuario[];
  onAtualizar: () => void;
}

const URL_API = "http://localhost:5056/usuarios";

export default function ListarUsuarios({ usuarios, onAtualizar }: Props) {
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [senhaEdit, setSenhaEdit] = useState("");
  const [erro, setErro] = useState("");

  const abrirModal = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setNomeEdit(usuario.nome);
    setEmailEdit(usuario.email);
    setSenhaEdit(usuario.senha);
    setErro("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
  };

  const handleEditar = async () => {
    if (!usuarioEditando) return;
    if (!nomeEdit || !emailEdit || !senhaEdit) {
      setErro("Preencha todos os campos.");
      return;
    }
    try {
      const res = await fetch(`${URL_API}/${usuarioEditando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nomeEdit, email: emailEdit, senha: senhaEdit }),
      });
      if (!res.ok) { setErro("Erro ao atualizar usuário."); return; }
      fecharModal();
      onAtualizar();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    }
  };

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${nome}"?`)) return;
    try {
      await fetch(`${URL_API}/${id}`, { method: "DELETE" });
      onAtualizar();
    } catch {
      alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-gray-100 dark:border-slate-700">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-lg">
            📋
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Usuários</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{usuarios.length} registros</p>
          </div>
        </div>
      </div>

      {usuarios.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl opacity-20 mb-3">👤</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum usuário cadastrado ainda.</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Crie um novo usuário para começar</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-5 flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">#{usuario.id} • {usuario.nome}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{usuario.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => abrirModal(usuario)} className="px-3 py-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg cursor-pointer transition-colors">✏️</button>
                <button onClick={() => handleDeletar(usuario.id, usuario.nome)} className="px-3 py-2 bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg cursor-pointer transition-colors">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && usuarioEditando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-5 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 pb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                ✏️
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Editar: {usuarioEditando.nome}</h2>
            </div>
            {erro && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm font-medium">
                {erro}
              </div>
            )}
            <input type="text" placeholder="Novo Nome" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} className="px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-sm" />
            <input type="email" placeholder="Novo Email" value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} className="px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-sm" />
            <input type="password" placeholder="Nova Senha" value={senhaEdit} onChange={(e) => setSenhaEdit(e.target.value)} className="px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium text-sm" />
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
              <button onClick={fecharModal} className="px-6 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-semibold rounded-lg cursor-pointer transition-colors">Cancelar</button>
              <button onClick={handleEditar} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-lg cursor-pointer transition-all shadow-lg hover:shadow-xl">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}