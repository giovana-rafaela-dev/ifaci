"use client";

import { useState, useEffect, useCallback } from "react";
import { Dispositivo } from "@/types/usuario";
import Sidebar from "@/app/components/Sidebar";

const URL_API = "http://localhost:5056/dispositivos";

export default function DispositivosPage() {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Dispositivo | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [tipoEdit, setTipoEdit] = useState("");

  const buscar = useCallback(async () => {
    try {
      const res = await fetch(URL_API);
      const data = await res.json();
      setDispositivos(data);
    } catch { setErro("Sem conexão com o backend."); }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const handleCriar = async () => {
    if (!nome || !tipo) { setErro("Preencha todos os campos."); return; }
    await fetch(URL_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, tipo, ativo: true }) });
    setNome(""); setTipo(""); setErro(""); buscar();
  };

  const abrirModal = (d: Dispositivo) => {
    setEditando(d); setNomeEdit(d.nome); setTipoEdit(d.tipo); setModalAberto(true);
  };

  const handleEditar = async () => {
    if (!editando) return;
    await fetch(`${URL_API}/${editando.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: nomeEdit, tipo: tipoEdit, ativo: editando.ativo }) });
    setModalAberto(false); buscar();
  };

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Deletar "${nome}"?`)) return;
    await fetch(`${URL_API}/${id}`, { method: "DELETE" });
    buscar();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d14" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "12px 20px", borderBottom: "0.5px solid #1e1d2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>Dispositivos</p>
            <p style={{ fontSize: "12px", color: "#6b6a80", margin: 0 }}>{dispositivos.length} cadastrado(s)</p>
          </div>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {erro && <div style={{ background: "rgba(220,38,38,0.1)", border: "0.5px solid rgba(220,38,38,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>{erro}</div>}

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do dispositivo" style={{ flex: 1, minWidth: "160px", padding: "8px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#13121f", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <input value={tipo} onChange={e => setTipo(e.target.value)} placeholder="Tipo (ESP32, Sensor...)" style={{ flex: 1, minWidth: "160px", padding: "8px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#13121f", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <button onClick={handleCriar} style={{ padding: "8px 18px", borderRadius: "8px", background: "#7c3aed", color: "#f1f0ff", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>+ Criar</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {dispositivos.length === 0 ? (
              <p style={{ color: "#3d3c52", textAlign: "center", padding: "40px 0", fontSize: "13px" }}>Nenhum dispositivo cadastrado ainda.</p>
            ) : dispositivos.map(d => (
              <div key={d.id} style={{ background: "#13121f", border: "0.5px solid #1e1d2e", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(251,146,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-cpu" style={{ fontSize: "16px", color: "#fb923c" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>{d.nome}</p>
                  <p style={{ fontSize: "11px", color: "#6b6a80", margin: 0 }}>{d.tipo}</p>
                </div>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: d.ativo ? "#4ade80" : "#f87171", flexShrink: 0 }} />
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => abrirModal(d)} style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(96,165,250,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-edit" style={{ fontSize: "13px", color: "#60a5fa" }} />
                  </button>
                  <button onClick={() => handleDeletar(d.id, d.nome)} style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(248,113,113,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-trash" style={{ fontSize: "13px", color: "#f87171" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalAberto && editando && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#13121f", border: "0.5px solid #2a2940", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>Editar dispositivo</p>
            <input value={nomeEdit} onChange={e => setNomeEdit(e.target.value)} placeholder="Nome" style={{ padding: "9px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#0d0d14", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <input value={tipoEdit} onChange={e => setTipoEdit(e.target.value)} placeholder="Tipo" style={{ padding: "9px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#0d0d14", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setModalAberto(false)} style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", border: "0.5px solid #2a2940", color: "#8b8aa0", fontSize: "13px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleEditar} style={{ padding: "8px 16px", borderRadius: "8px", background: "#7c3aed", color: "#f1f0ff", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer" }}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}