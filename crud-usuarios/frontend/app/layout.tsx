import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IFAC — Supervisão Industrial",
  description: "Sistema de supervisão industrial",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      </head>
      <body style={{ margin: 0, background: "#0d0d14", fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}