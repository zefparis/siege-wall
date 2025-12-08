import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "🏰 HCS-U7 Siege Wall | Live Attack Defense",
  description: "Real-time attack defense demonstration for HCS-U7 quantum-safe authentication system. Watch as AI attackers fail to breach our defenses.",
  keywords: ["HCS-U7", "security", "authentication", "quantum-safe", "CAPTCHA alternative"],
  authors: [{ name: "IA Solution" }],
  openGraph: {
    title: "🏰 HCS-U7 Siege Wall",
    description: "Watch AI attackers fail in real-time",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.variable} ${orbitron.variable} antialiased bg-[#0a0a0f] text-white font-mono`}>
        {children}
      </body>
    </html>
  );
}
