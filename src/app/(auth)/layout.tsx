import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compte | TrouvTogo",
  description: "Connexion et inscription à TrouvTogo.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh max-h-dvh min-h-0 overflow-hidden">{children}</div>
  );
}
