import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[4.25rem]">{children}</main>
      <Footer />
    </>
  );
}
