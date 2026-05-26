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
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">📋 Lista de Usuários</h2>

      {usuarios.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Nenhum usuário cadastrado ainda.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-800">#{usuario.id} — {usuario.nome}</h3>
              <p className="text-sm text-gray-600">📧 {usuario.email}</p>
              <p className="text-sm text-gray-600">🔑 {usuario.senha}</p>
              <div className="flex justify-end gap-3 mt-1">
                <button onClick={() => abrirModal(usuario)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg cursor-pointer">✏️ Editar</button>
                <button onClick={() => handleDeletar(usuario.id, usuario.nome)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg cursor-pointer">🗑️ Deletar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && usuarioEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800">✏️ Editar: {usuarioEditando.nome}</h2>
            {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">{erro}</div>}
            <input type="text" placeholder="Novo Nome" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} className="p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 outline-none" />
            <input type="email" placeholder="Novo Email" value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} className="p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 outline-none" />
            <input type="password" placeholder="Nova Senha" value={senhaEdit} onChange={(e) => setSenhaEdit(e.target.value)} className="p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 outline-none" />
            <div className="flex gap-3 justify-end">
              <button onClick={handleEditar} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg cursor-pointer">Confirmar</button>
              <button onClick={fecharModal} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg cursor-pointer">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}