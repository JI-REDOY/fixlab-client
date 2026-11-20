import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomToastProvider } from "@/components/ui/CustomToast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FixLab",
  description: "Repair services & dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <CustomToastProvider>{children}</CustomToastProvider>
      </body>
    </html>
  );
}