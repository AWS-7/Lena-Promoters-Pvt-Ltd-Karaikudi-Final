import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";
import Preloader from "@/components/Preloader";
import WelcomeSound from "@/components/WelcomeSound";
import VisitorTracker from "@/components/VisitorTracker";
import { GeoAeoJsonLd, LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/SeoJsonLd";
import { geoAeoKeywords } from "@/lib/seo/geo-aeo";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1195db",
};

export const metadata: Metadata = {
  title: {
    default: "Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi, Tamil Nadu",
    template: "%s | Lena Promoters Private Limited"
  },
  description: "Buy DTCP approved residential & commercial plots in Karaikudi, Tamil Nadu from Lena Promoters — a trusted real estate company with 18+ years experience, 1200+ happy customers, clear legal titles, and bank loan assistance.",
  keywords: [
    "DTCP approved plots Karaikudi",
    "land promoter Karaikudi",
    "plot sales Tamil Nadu",
    "real estate Karaikudi",
    "Lena Promoters",
    "residential plots Sivaganga",
    "commercial land Karaikudi",
    "DTCP layouts Tamil Nadu",
    "Karaikudi real estate",
    "buy plot Karaikudi",
    "land for sale Karaikudi",
    "property dealer Karaikudi",
    "house site Karaikudi",
    "villament plots",
    " CMDA approved plots",
    "RERA approved plots",
    "land investment Karaikudi",
    "Chettinad plots",
    "Sivaganga district plots",
    "plot with patta Karaikudi",
    "clear title plots",
    "bank loan for plot purchase",
    "real estate company Karaikudi",
    "land developers Tamil Nadu",
    "affordable plots Karaikudi",
    "premium land layouts",
    ...geoAeoKeywords,
  ].join(", "),
  authors: [{ name: "Lena Promoters Private Limited", url: "https://www.lenapromoterspvtltd.com" }],
  creator: "Lena Promoters Private Limited",
  publisher: "Lena Promoters Private Limited",
  category: "Real Estate",
  classification: "Business",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://www.lenapromoterspvtltd.com",
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.lenapromoterspvtltd.com',
    title: 'Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi',
    description: 'Buy DTCP approved plots in Karaikudi, Tamil Nadu. Trusted land promoter with 18+ years experience, 1200+ happy customers, clear titles & bank loan support.',
    siteName: 'Lena Promoters Private Limited',
    images: [
      {
        url: 'https://www.lenapromoterspvtltd.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lena Promoters Private Limited - DTCP Approved Plots in Karaikudi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi',
    description: 'Buy DTCP approved plots in Karaikudi, Tamil Nadu. 18+ years experience, 1200+ happy customers.',
    images: ['https://www.lenapromoterspvtltd.com/og-image.jpg'],
    creator: '@lenapromoters',
    site: '@lenapromoters',
  },
  verification: {
    google: '5DX8KNlqJsxw14QkpWWKITb5wStKlL23-aCMtARDQ5o',
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/logo.png",
    apple: "/android-chrome-192x192.png",
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
        {/* Google Tag Manager — as high in <head> as possible */}
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PLGH5S42');`}</script>

        {/* Favicons */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="5DX8KNlqJsxw14QkpWWKITb5wStKlL23-aCMtARDQ5o" />

        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
        <GeoAeoJsonLd />
        <link rel="preconnect" href="https://rjeydmqspxklsrtohumn.supabase.co" />
        <link rel="dns-prefetch" href="https://rjeydmqspxklsrtohumn.supabase.co" />

        {/* Google Analytics (GA4) + Google Ads conversion tracking */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZMW2XTPPBD" />
        <script id="gtag-init">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZMW2XTPPBD');
          gtag('config', 'AW-18145943083');`}
        </script>
      </head>
      <body className={`${poppins.variable} ${inter.variable} min-h-full flex flex-col pb-[88px] md:pb-0`}>
        {/* Google Tag Manager (noscript) — immediately after opening <body> */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PLGH5S42" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        <VisitorTracker />
        <WelcomeSound />
        <Preloader />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
