import type { Metadata } from "next";
import { Nunito_Sans, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Nunito_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Robot LED Eventos | Animación para fiestas",
  description:
    "Robots LED, personajes y experiencias inolvidables para fiestas en Tucumán y Santiago del Estero.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Robot LED Eventos | Número 1 en fiestas",
    description: "Robots LED, personajes y experiencias inolvidables para tu fiesta.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Número 1 en fiestas · Robot LED Eventos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robot LED Eventos | Número 1 en fiestas",
    description: "Robots LED, personajes y experiencias inolvidables para tu fiesta.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
