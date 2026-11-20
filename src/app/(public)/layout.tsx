import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingIcons from "@/components/ui/FloatingIcons";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <FloatingIcons /> {/* ব্যাকগ্রাউন্ড আইকন */}
      <Navbar />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
}