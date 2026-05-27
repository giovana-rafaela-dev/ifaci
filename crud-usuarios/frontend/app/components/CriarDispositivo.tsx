"use client";

import { useState } from "react";

interface Props {
  onCriado: () => void;
}

const URL_API = "http://localhost:5056/dispositivos";

export default function CriarDispositivo({ onCriado }: Props) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async () => {
    setErro("");
    setSucesso("");
    if (!nome || !tipo) { setErro("Preencha todos os campos."); return; }
    setCarregando(true);
    try {
      const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, tipo, ativo: true }),
      });
      if (!res.ok) { const data = await res.json(); setErro(data.mensagem || "Erro."); return; }
      setSucesso("Dispositivo criado com sucesso!");
      setNome("");
      setTipo("");
      onCriado();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">➕ Cadastrar Dispositivo</h2>
      {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">{erro}</div>}
      {sucesso && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm">{sucesso}</div>}
      <input type="text" placeholder="Nome do dispositivo" value={nome} onChange={(e) => setNome(e.target.value)} className="p-3 rounded-lg border-2 border-gray-200 focus:border-red-400 outline-none transition-colors" />
      <input type="text" placeholder="Tipo (ex: ESP32, Sensor, Atuador)" value={tipo} onChange={(e) => setTipo(e.target.value)} className="p-3 rounded-lg border-2 border-gray-200 focus:border-red-400 outline-none transition-colors" />
      <button onClick={handleSubmit} disabled={carregando} className="py-3 px-6 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-lg transition-colors cursor-pointer">
        {carregando ? "Criando..." : "Criar Dispositivo"}
      </button>
    </div>
  );
}