import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HCS-U7 | The Most Advanced Authentication System",
  description: "Zero breaches since 2024. Quantum-safe, AI-resistant, celestial entropy powered authentication.",
  keywords: ["security", "authentication", "quantum-safe", "HCS-U7", "zero-trust"],
  authors: [{ name: "HCS-U7 Labs" }],
  openGraph: {
    title: "HCS-U7 | The Future of Security",
    description: "Zero breaches since 2024. The most advanced authentication system ever designed.",
    type: "website",
    url: "https://hcs-u7.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "HCS-U7 | Zero Breaches Since 2024",
    description: "The most advanced authentication system ever designed.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white min-h-screen">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
