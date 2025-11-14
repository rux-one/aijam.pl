import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "AI Jam Łódź - Społeczność AI w Łodzi",
  description: "Dołącz do społeczności entuzjastów sztucznej inteligencji w Łodzi. Regularne meetupy, warsztaty i networking.",
  keywords: ["AI", "Artificial Intelligence", "Łódź", "Meetup", "Machine Learning", "Deep Learning"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
