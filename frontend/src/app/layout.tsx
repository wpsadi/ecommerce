import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Ecomm",
  description: "Ecomm by Aditya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col bg-canvas">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
