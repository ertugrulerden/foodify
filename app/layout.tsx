import type { Metadata } from "next";
import { Work_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AddressProvider } from "@/components/AddressContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Foodify - Compare Food Prices Across Platforms",
  description:
    "Find the best price for your favorite food. Compare all the platforms in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        inter.variable,
        workSans.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        {/* AddressProvider: Adres bilgisini tüm uygulamaya sağlayan context */}
        <AddressProvider>{children}</AddressProvider>
      </body>
    </html>
  );
}
