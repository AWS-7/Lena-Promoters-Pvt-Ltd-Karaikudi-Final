import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";
import Preloader from "@/components/Preloader";
import VisitorTracker from "@/components/VisitorTracker";
import { GeoAeoJsonLd, LocalBusinessJsonLd, WebsiteJsonLd } from "@/components/SeoJsonLd";
import { DEFAULT_OG_IMAGE, SITE_URL, localKeywords } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DTCP Approved Plots Karaikudi | Lena Promoters",
    template: "%s | Lena Promoters",
  },
  description: "Buy DTCP approved plots in Karaikudi from Lena Promoters. Clear titles, 18+ years experience, bank loan help and free site visit.",
  keywords: [
    ...localKeywords,
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
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    title: 'Lena Promoters Private Limited | DTCP Approved Plots in Karaikudi',
    description: 'Buy DTCP approved plots in Karaikudi, Tamil Nadu. Trusted land promoter with 18+ years experience, 1200+ happy customers, clear titles & bank loan support.',
    siteName: 'Lena Promoters Private Limited',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
    creator: '@lenapromoters',
    site: '@lenapromoters',
  },
  verification: {
    google: '5DX8KNlqJsxw14QkpWWKITb5wStKlL23-aCMtARDQ5o',
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.png",
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
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="5DX8KNlqJsxw14QkpWWKITb5wStKlL23-aCMtARDQ5o" />

        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
        <GeoAeoJsonLd />
        <link rel="preconnect" href="https://rjeydmqspxklsrtohumn.supabase.co" />
        <link rel="dns-prefetch" href="https://rjeydmqspxklsrtohumn.supabase.co" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} min-h-full flex flex-col pb-[88px] md:pb-0`}>
        {/* Google Tag Manager (noscript) — immediately after opening <body> */}
        <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PLGH5S42" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
        <Script id="gtm-init" strategy="lazyOnload">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PLGH5S42');`}</Script>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-ZMW2XTPPBD" strategy="lazyOnload" />
        <Script id="gtag-init" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZMW2XTPPBD');
          gtag('config', 'AW-18145943083');`}
        </Script>
        <VisitorTracker />
        <Preloader />
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
