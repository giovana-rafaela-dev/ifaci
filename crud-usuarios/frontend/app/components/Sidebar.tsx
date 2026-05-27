"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const path = usePathname();

  const navItems = [
    { icon: "ti-layout-dashboard", route: "/dashboard", label: "Dashboard" },
    { icon: "ti-users", route: "/", label: "Usuários" },
    { icon: "ti-cpu", route: "/dispositivos", label: "Dispositivos" },
  ];

  return (
    <div style={{ width: "48px", background: "#0a0914", borderRight: "0.5px solid #1e1d2e", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 0", gap: "8px", minHeight: "100vh" }}>
      {navItems.map((item) => (
        <button
          key={item.route}
          onClick={() => router.push(item.route)}
          title={item.label}
          style={{ width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", background: path === item.route ? "rgba(124,58,237,0.2)" : "transparent" }}
        >
          <i className={`ti ${item.icon}`} style={{ fontSize: "18px", color: path === item.route ? "#a78bfa" : "#3d3c52" }} />
        </button>
      ))}

      <div style={{ flex: 1 }} />

      <button
        onClick={() => { localStorage.removeItem("usuarioLogado"); router.push("/login"); }}
        title="Sair"
        style={{ width: "34px", height: "34px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "none", background: "transparent" }}
      >
        <i className="ti ti-logout" style={{ fontSize: "18px", color: "#3d3c52" }} />
      </button>
    </div>
  );
}