import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";
import Preloader from "@/components/Preloader";
import WelcomeSound from "@/components/WelcomeSound";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi",
    template: "%s | Lena Promoters Private Limited"
  },
  description: "Premium DTCP approved land layouts and plot sales in Karaikudi, Tamil Nadu. Trusted land promoter with 18+ years experience, 1200+ happy customers. Buy residential and commercial plots with clear titles.",
  keywords: "DTCP approved plots, land promoter Karaikudi, plot sales Tamil Nadu, real estate Karaikudi, Lena Promoters, residential plots, commercial land, DTCP layouts, Karaikudi real estate",
  authors: [{ name: "Lena Promoters Private Limited" }],
  creator: "Lena Promoters Private Limited",
  publisher: "Lena Promoters Private Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://lenapromoters.com',
    title: 'Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi',
    description: 'Premium DTCP approved land layouts and plot sales in Karaikudi, Tamil Nadu. Trusted land promoter with 18+ years experience.',
    siteName: 'Lena Promoters Private Limited',
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Lena Promoters Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi',
    description: 'Premium DTCP approved land layouts and plot sales in Karaikudi, Tamil Nadu.',
    images: ['/images/logo.png'],
    creator: '@lenapromoters',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans pb-16 md:pb-0 pt-16">
        <WelcomeSound />
        <Preloader />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
