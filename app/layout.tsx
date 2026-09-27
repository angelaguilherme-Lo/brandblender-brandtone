import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandBlender — BrandTone",
  description: "Turn brand strategy into an effective color, typography and interface system.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
