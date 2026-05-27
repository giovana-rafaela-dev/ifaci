"use client";

import { useState, useEffect, useCallback } from "react";
import { SensorData } from "@/types/usuario";
import Sidebar from "@/app/components/Sidebar";

const URL_SENSORES = "http://localhost:5056/sensores";

export default function DashboardPage() {
  const [dados, setDados] = useState<SensorData | null>(null);
  const [erro, setErro] = useState("");
  const [velocidadeInput, setVelocidadeInput] = useState("");
  const [msgComando, setMsgComando] = useState("");

  const buscarDados = useCallback(async () => {
    try {
      const res = await fetch(URL_SENSORES);
      const data = await res.json();
      setDados(data); setErro("");
    } catch { setErro("Sem conexão com o backend."); }
  }, []);

  useEffect(() => {
    buscarDados();
    const i = setInterval(buscarDados, 3000);
    return () => clearInterval(i);
  }, [buscarDados]);

  const controlarTrava = async (liberar: boolean) => {
    try {
      const res = await fetch(`${URL_SENSORES}/trava`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ liberarTrava: liberar }) });
      const data = await res.json();
      setMsgComando(data.mensagem); buscarDados();
    } catch { setMsgComando("Erro ao enviar comando."); }
  };

  const enviarVelocidade = async () => {
    const valor = parseFloat(velocidadeInput);
    if (isNaN(valor) || valor < 0 || valor > 100) { setMsgComando("Velocidade deve ser entre 0 e 100."); return; }
    try {
      const res = await fetch(`${URL_SENSORES}/velocidade`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projecaoVelocidade: valor }) });
      const data = await res.json();
      setMsgComando(data.mensagem); buscarDados();
    } catch { setMsgComando("Erro ao enviar comando."); }
  };

  const sensorCard = (label: string, value: string, color: string) => (
    <div style={{ background: "#13121f", border: "0.5px solid #1e1d2e", borderRadius: "12px", padding: "14px" }}>
      <p style={{ fontSize: "11px", color: "#6b6a80", margin: "0 0 6px 0", letterSpacing: "0.3px" }}>{label}</p>
      <p style={{ fontSize: "20px", fontWeight: 500, color, margin: 0 }}>{value}</p>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d0d14" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "12px 20px", borderBottom: "0.5px solid #1e1d2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#f1f0ff", margin: 0 }}>Dashboard</p>
            <p style={{ fontSize: "12px", color: "#6b6a80", margin: 0 }}>Atualiza a cada 3 segundos</p>
          </div>
          <span style={{ fontSize: "11px", background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "0.5px solid rgba(34,197,94,0.2)", padding: "3px 10px", borderRadius: "20px" }}>● Online</span>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {erro && <div style={{ background: "rgba(220,38,38,0.1)", border: "0.5px solid rgba(220,38,38,0.3)", color: "#f87171", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>⚠️ {erro}</div>}
          {msgComando && <div style={{ background: "rgba(124,58,237,0.1)", border: "0.5px solid rgba(124,58,237,0.3)", color: "#a78bfa", padding: "10px 14px", borderRadius: "10px", fontSize: "13px" }}>✓ {msgComando}</div>}

          {/* Sensores */}
          <div>
            <p style={{ fontSize: "11px", color: "#6b6a80", margin: "0 0 10px 0", letterSpacing: "0.5px" }}>LEITURA DE SENSORES</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" }}>
              {sensorCard("🌡 Temperatura", `${dados?.temperatura ?? "—"} °C`, "#f97316")}
              {sensorCard("💨 Pressão", `${dados?.pressao ?? "—"} kPa`, "#60a5fa")}
              {sensorCard("⚡ Velocidade", `${dados?.velocidade ?? "—"} rpm`, "#a78bfa")}
              {sensorCard("📡 Status ESP", dados?.statusEsp ? "✓ Ligado" : "✗ Off", dados?.statusEsp ? "#4ade80" : "#f87171")}
              {sensorCard("🔒 Trava", dados?.travaSeguranca ? "🔓 Liberada" : "🔒 Bloqueada", dados?.travaSeguranca ? "#4ade80" : "#f87171")}
              {sensorCard("🕐 Atualizado", dados ? new Date(dados.timestamp).toLocaleTimeString("pt-BR") : "—", "#6b6a80")}
            </div>
          </div>

          {/* Comandos */}
          <div>
            <p style={{ fontSize: "11px", color: "#6b6a80", margin: "0 0 10px 0", letterSpacing: "0.5px" }}>ENVIO DE COMANDOS</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

              <div style={{ background: "#13121f", border: "0.5px solid #1e1d2e", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#8b8aa0", margin: 0 }}>CONTROLE DA TRAVA</p>
                <p style={{ fontSize: "12px", color: "#6b6a80", margin: 0 }}>Status: <strong style={{ color: dados?.travaSeguranca ? "#4ade80" : "#f87171" }}>{dados?.travaSeguranca ? "Liberada" : "Bloqueada"}</strong></p>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => controlarTrava(true)} style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "0.5px solid rgba(34,197,94,0.2)", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>🔓 Liberar</button>
                  <button onClick={() => controlarTrava(false)} style={{ flex: 1, padding: "8px", borderRadius: "8px", background: "rgba(248,113,113,0.1)", color: "#f87171", border: "0.5px solid rgba(248,113,113,0.2)", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>🔒 Bloquear</button>
                </div>
              </div>

              <div style={{ background: "#13121f", border: "0.5px solid #1e1d2e", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#8b8aa0", margin: 0 }}>PROJEÇÃO DE VELOCIDADE</p>
                <p style={{ fontSize: "12px", color: "#6b6a80", margin: 0 }}>Atual: <strong style={{ color: "#a78bfa" }}>{dados?.velocidade} rpm</strong></p>
                <input type="number" min={0} max={100} placeholder="0 a 100 rpm" value={velocidadeInput} onChange={e => setVelocidadeInput(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "0.5px solid #2a2940", background: "#0d0d14", color: "#f1f0ff", fontSize: "13px", outline: "none" }} />
                <button onClick={enviarVelocidade} style={{ padding: "8px", borderRadius: "8px", background: "#7c3aed", color: "#f1f0ff", fontSize: "13px", fontWeight: 500, border: "none", cursor: "pointer" }}>Enviar</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}