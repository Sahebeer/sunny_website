import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/tokens.css";
import "./globals.css";
import { site } from "@/content/site";

const bodyFont = localFont({
  src: [
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/dm-sans/files/dm-sans-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});
const editorialFont = localFont({
  src: [
    { path: "../../node_modules/@fontsource/fraunces/files/fraunces-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/fraunces/files/fraunces-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});
const detailFont = localFont({
  src: [
    { path: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-ibm-mono",
  display: "swap",
});
const atelierFont = localFont({
  src: [
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-manrope",
  display: "swap",
});
const telemetryFont = localFont({
  src: [
    { path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${editorialFont.variable} ${detailFont.variable} ${atelierFont.variable} ${telemetryFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
