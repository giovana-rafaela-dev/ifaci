"use client";

import { useState, useEffect, useCallback } from "react";
import { Usuario } from "@/types/usuario";
import Sidebar from "@/app/components/Sidebar";

const URL_API = "http://localhost:5056/usuarios";

export default function Home() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [nomeEdit, setNomeEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [senhaEdit, setSenhaEdit] = useState("");

  const buscar = useCallback(async () => {
    try {
      const res = await fetch(URL_API);
      const data = await res.json();
      setUsuarios(data);
    } catch { setErro("Sem conexão com o backend."); }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const handleCriar = async () => {
    if (!nome || !email || !senha) { setErro("Preencha todos os campos."); return; }
    await fetch(URL_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, email, senha }) });
    setNome(""); setEmail(""); setSenha(""); setErro("");
    buscar();
  };

  const abrirModal = (u: Usuario) => {
    setEditando(u); setNomeEdit(u.nome); setEmailEdit(u.email); setSenhaEdit(u.senha);
    setModalAberto(true);
  };

  const handleEditar = async () => {
    if (!editando) return;
    await fetch(`${URL_API}/${editando.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome: nomeEdit, email: emailEdit, senha: senhaEdit }) });
    setModalAberto(false); buscar();
  };

  const handleDeletar = async (id: number, nome: string) => {
    if (!confirm(`Deletar "${nome}"?`)) return;
    await fetch(`${URL_API}/${id}`, { method: "DELETE" });
    buscar();
  };

  const getInitials = (nome: string) => nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d14" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Topbar */}
        <div style={{ padding: "12px 20px", borderBottom: "0.5px solid #1e1d2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>Usuários</p>
            <p style={{ fontSize: "12px", color: "#6b6a80", margin: 0 }}>{usuarios.length} cadastrado(s)</p>
          </div>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {erro && <div style={{ background: "rgba(220,38,38,0.1)", border: "0.5px solid rgba(220,38,38,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>{erro}</div>}

          {/* Formulário */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" style={{ flex: 1, minWidth: "140px", padding: "8px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#13121f", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" style={{ flex: 1, minWidth: "140px", padding: "8px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#13121f", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <input value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" type="password" style={{ flex: 1, minWidth: "120px", padding: "8px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#13121f", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <button onClick={handleCriar} style={{ padding: "8px 18px", borderRadius: "8px", background: "#7c3aed", color: "#f1f0ff", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>+ Criar</button>
          </div>

          {/* Lista */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {usuarios.length === 0 ? (
              <p style={{ color: "#3d3c52", textAlign: "center", padding: "40px 0", fontSize: "13px" }}>Nenhum usuário cadastrado ainda.</p>
            ) : usuarios.map(u => (
              <div key={u.id} style={{ background: "#13121f", border: "0.5px solid #1e1d2e", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, color: "#a78bfa", flexShrink: 0 }}>
                  {getInitials(u.nome)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>{u.nome}</p>
                  <p style={{ fontSize: "11px", color: "#6b6a80", margin: 0 }}>{u.email}</p>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => abrirModal(u)} style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(96,165,250,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-edit" style={{ fontSize: "13px", color: "#60a5fa" }} />
                  </button>
                  <button onClick={() => handleDeletar(u.id, u.nome)} style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(248,113,113,0.1)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-trash" style={{ fontSize: "13px", color: "#f87171" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal editar */}
      {modalAberto && editando && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#13121f", border: "0.5px solid #2a2940", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>Editar usuário</p>
            <input value={nomeEdit} onChange={e => setNomeEdit(e.target.value)} placeholder="Nome" style={{ padding: "9px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#0d0d14", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <input value={emailEdit} onChange={e => setEmailEdit(e.target.value)} placeholder="Email" style={{ padding: "9px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#0d0d14", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
            <input value={senhaEdit} onChange={e => setSenhaEdit(e.target.value)} placeholder="Senha" type="password" style={{ padding: "9px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#0d0d14", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
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