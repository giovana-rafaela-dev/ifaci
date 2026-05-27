"use client";

import { useState } from "react";
import { Dispositivo } from "@/types/usuario";

interface Props {
  dispositivos: Dispositivo[];
  onAtualizar: () => void;
}

const URL_API = "http://localhost:5056/dispositivos";

export default function ListarDispositivos({ dispositivos, onAtualizar }: Props) {
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Dispositivo | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [tipoEdit, setTipoEdit] = useState("");

  const abrirModal = (d: Dispositivo) => {
    setEditando(d);
    setNomeEdit(d.nome);
    setTipoEdit(d.tipo);
    setModalAberto(true);
  };

  const handleEditar = async () => {
    if (!editando) return;
    await fetch(`${URL_API}/${editando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: nomeEdit, tipo: tipoEdit, ativo: editando.ativo }),
    });
    setModalAberto(false);
    onAtualizar();
  };

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Deletar o dispositivo "${nome}"?`)) return;
    await fetch(`${URL_API}/${id}`, { method: "DELETE" });
    onAtualizar();
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">📡 Lista de Dispositivos</h2>
      {dispositivos.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Nenhum dispositivo cadastrado ainda.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {dispositivos.map((d) => (
            <div key={d.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">#{d.id} — {d.nome}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {d.ativo ? "✅ Ativo" : "❌ Inativo"}
                </span>
              </div>
              <p className="text-sm text-gray-600">🔧 Tipo: <strong>{d.tipo}</strong></p>
              <div className="flex justify-end gap-3 mt-1">
                <button onClick={() => abrirModal(d)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg cursor-pointer">✏️ Editar</button>
                <button onClick={() => handleDeletar(d.id, d.nome)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg cursor-pointer">🗑️ Deletar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAberto && editando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold">✏️ Editar: {editando.nome}</h2>
            <input type="text" value={nomeEdit} onChange={(e) => setNomeEdit(e.target.value)} placeholder="Nome" className="p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 outline-none" />
            <input type="text" value={tipoEdit} onChange={(e) => setTipoEdit(e.target.value)} placeholder="Tipo" className="p-3 rounded-lg border-2 border-gray-200 focus:border-blue-400 outline-none" />
            <div className="flex gap-3 justify-end">
              <button onClick={handleEditar} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg cursor-pointer">Confirmar</button>
              <button onClick={() => setModalAberto(false)} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg cursor-pointer">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}