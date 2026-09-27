import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  IBM_Plex_Mono,
  Libre_Baskerville,
  Manrope,
  Open_Sans,
  Playfair_Display,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const manrope = Manrope({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-cormorant", display: "swap" });
const libreBaskerville = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-libre", display: "swap" });
const playfairDisplay = Playfair_Display({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const spaceGrotesk = Space_Grotesk({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-space", display: "swap" });
const ibmPlexMono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-ibm-mono", display: "swap" });
const openSans = Open_Sans({ weight: "700", subsets: ["latin"], variable: "--font-open-sans", display: "swap" });

const fontVariables = [manrope, cormorant, libreBaskerville, playfairDisplay, spaceGrotesk, ibmPlexMono, openSans].map((font) => font.variable).join(" ");

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
      <body className={`${fontVariables} antialiased`}>{children}</body>
    </html>
  );
}
