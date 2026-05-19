import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";
import Preloader from "@/components/Preloader";
import WelcomeSound from "@/components/WelcomeSound";
import VisitorTracker from "@/components/VisitorTracker";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://rjeydmqspxklsrtohumn.supabase.co" />
        <link rel="dns-prefetch" href="https://rjeydmqspxklsrtohumn.supabase.co" />
        {/* Google tag (gtag.js) - AW-18145943083 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18145943083"></script>
        <script id="gtag-init">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-18145943083');`}
        </script>
        {/* Google Tag Manager */}
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P8LR9ZRP');`}</script>
      </head>
      <body className={`${poppins.variable} ${inter.variable} min-h-full flex flex-col pb-[88px] md:pb-0`}>
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P8LR9ZRP" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        {/* End Google Tag Manager (noscript) */}
        <VisitorTracker />
        <WelcomeSound />
        <Preloader />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
