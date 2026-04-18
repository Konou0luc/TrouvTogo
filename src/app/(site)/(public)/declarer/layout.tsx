import { RequireAuth } from "@/components/auth/RequireAuth";

export default function DeclarerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
