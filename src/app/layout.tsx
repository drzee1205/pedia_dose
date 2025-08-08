import type { Metadata } from "next";
import { Lexend, Noto_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Pedia-Dose - Pediatric Dosage Calculator",
  description: "A modern pediatric dosage calculator for healthcare professionals and parents. Calculate accurate medication dosages for children based on weight and age.",
  keywords: ["pediatric", "dosage", "calculator", "medication", "children", "healthcare", "medical"],
  authors: [{ name: "Pedia-Dose Team" }],
  openGraph: {
    title: "Pedia-Dose - Pediatric Dosage Calculator",
    description: "Calculate accurate medication dosages for children based on weight and age",
    url: "https://pedia-dose.vercel.app",
    siteName: "Pedia-Dose",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pedia-Dose - Pediatric Dosage Calculator",
    description: "Calculate accurate medication dosages for children based on weight and age",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lexend.variable} ${notoSans.variable} antialiased bg-white text-[#111518] font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
