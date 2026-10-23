import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAIL.06 — SAIL GAVHANE | Creator & Electrical Engineer",
  description:
    "Personal portfolio of Sail Gavhane — Creator, Electrical Engineer, Builder, Founder. I design, build and share ideas that solve real problems.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0d0d0f] text-white antialiased font-sans selection:bg-[#FF3028] selection:text-white">
        {children}
      </body>
    </html>
  );
}
