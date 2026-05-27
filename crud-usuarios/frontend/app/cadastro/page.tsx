"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    setErro("");
    setSucesso("");
    if (!nome || !email || !senha) { setErro("Preencha todos os campos."); return; }
    setCarregando(true);
    try {
      const res = await fetch("http://localhost:5056/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErro(data.mensagem || "Erro ao cadastrar.");
        return;
      }
      setSucesso("Conta criada! Redirecionando...");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main style={{ background: "#0d0d14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "26px" }}>⚙️</span>
          </div>
          <p style={{ fontSize: "22px", fontWeight: "500", color: "#f1f0ff", letterSpacing: "-0.3px" }}>IFAC</p>
          <p style={{ fontSize: "12px", color: "#6b6a80", textAlign: "center" }}>Criar nova conta</p>
        </div>

        <div style={{ height: "0.5px", background: "#1e1d2e" }} />

        {erro && (
          <div style={{ background: "rgba(220,38,38,0.1)", border: "0.5px solid rgba(220,38,38,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>
            {erro}
          </div>
        )}
        {sucesso && (
          <div style={{ background: "rgba(124,58,237,0.1)", border: "0.5px solid rgba(124,58,237,0.3)", color: "#a78bfa", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>
            {sucesso}
          </div>
        )}

        {/* Nome */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "500", color: "#8b8aa0", letterSpacing: "0.3px" }}>NOME COMPLETO</label>
          <input
            type="text"
            placeholder="Giovana Rafaela"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ padding: "10px 13px", borderRadius: "10px", border: "0.5px solid #2a2940", background: "#13121f", fontSize: "14px", color: "#f1f0ff", outline: "none" }}
          />
        </div>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "500", color: "#8b8aa0", letterSpacing: "0.3px" }}>EMAIL</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px 13px", borderRadius: "10px", border: "0.5px solid #2a2940", background: "#13121f", fontSize: "14px", color: "#f1f0ff", outline: "none" }}
          />
        </div>

        {/* Senha */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "12px", fontWeight: "500", color: "#8b8aa0", letterSpacing: "0.3px" }}>SENHA</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCadastro()}
            style={{ padding: "10px 13px", borderRadius: "10px", border: "0.5px solid #2a2940", background: "#13121f", fontSize: "14px", color: "#f1f0ff", outline: "none" }}
          />
        </div>

        <button
          onClick={handleCadastro}
          disabled={carregando}
          style={{ padding: "11px", borderRadius: "10px", background: carregando ? "#4c1d95" : "#7c3aed", color: "#f1f0ff", fontSize: "14px", fontWeight: "500", border: "none", cursor: "pointer" }}
        >
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>

        <p
          onClick={() => router.push("/login")}
          style={{ fontSize: "12px", color: "#7c3aed", textAlign: "center", cursor: "pointer" }}
        >
          Já tem conta? Entrar →
        </p>
      </div>
    </main>
  );
}