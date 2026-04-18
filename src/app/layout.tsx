import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "TrouvTogo | Retrouvez vos objets perdus au Togo",
  description: "La première plateforme citoyenne de signalement et de récupération d'objets perdus au Togo. Matching intelligent et sécurisé.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full overflow-x-hidden antialiased`}>
      <body className="min-h-dvh flex min-w-0 flex-col overflow-x-hidden bg-background font-sans text-foreground antialiased selection:bg-primary/15 selection:text-primary-dark dark:selection:bg-primary/25 dark:selection:text-neutral-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
