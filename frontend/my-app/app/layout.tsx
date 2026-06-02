import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const titleFont = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-title",
});

const bodyFont = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "VaultIoT — Painel de Controle",
  description: "Gerenciamento centralizado de dispositivos e sensores IoT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${titleFont.variable} ${bodyFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
