"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    setErro("");
    if (!email || !senha) { setErro("Preencha email e senha."); return; }
    try {
      const res = await fetch("http://localhost:5056/usuarios");
      const usuarios = await res.json();
      const encontrado = usuarios.find(
        (u: { email: string; senha: string }) => u.email === email && u.senha === senha
      );
      if (encontrado) {
        localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
        router.push("/dashboard");
      } else {
        setErro("Email ou senha incorretos.");
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
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
          <p style={{ fontSize: "12px", color: "#6b6a80", textAlign: "center" }}>Sistema de Supervisão Industrial</p>
        </div>

        <div style={{ height: "0.5px", background: "#1e1d2e" }} />

        {erro && (
          <div style={{ background: "rgba(220,38,38,0.1)", border: "0.5px solid rgba(220,38,38,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>
            {erro}
          </div>
        )}

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
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ padding: "10px 13px", borderRadius: "10px", border: "0.5px solid #2a2940", background: "#13121f", fontSize: "14px", color: "#f1f0ff", outline: "none" }}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{ padding: "11px", borderRadius: "10px", background: "#7c3aed", color: "#f1f0ff", fontSize: "14px", fontWeight: "500", border: "none", cursor: "pointer" }}
        >
          Entrar
        </button>

        <p
          onClick={() => router.push("/cadastro")}
          style={{ fontSize: "12px", color: "#7c3aed", textAlign: "center", cursor: "pointer" }}
        >
          Sem conta? Criar agora →
        </p>
      </div>
    </main>
  );
}