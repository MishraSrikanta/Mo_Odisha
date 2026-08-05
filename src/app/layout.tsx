import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_Oriya, Outfit } from "next/font/google";
import "./globals.css";

import { ThemeProvider, themeBootstrapScript } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { LocaleProvider } from "@/lib/i18n/provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SITE } from "@/lib/data/site";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const odia = Noto_Sans_Oriya({
  subsets: ["oriya"],
  weight: ["400", "500", "600"],
  variable: "--font-odia",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Odisha", "Odia", "ଓଡ଼ିଶା", "Odisha tourism", "Jagannath", "Konark",
    "Puri", "Chilika", "Similipal", "Odissi", "Pattachitra", "Rath Yatra",
    "Bhubaneswar", "Kalinga", "Bande Utkala Janani",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    alternateLocale: ["or_IN"],
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/", "or-IN": "/" },
  },
  category: "travel",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050e1e" },
    { media: "(prefers-color-scheme: light)", color: "#fbf6ee" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Structured data so search engines understand what this site is. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  alternateName: SITE.nameOdia,
  url: SITE.url,
  description: SITE.description,
  inLanguage: ["en-IN", "or-IN"],
  about: {
    "@type": "AdministrativeArea",
    name: "Odisha",
    alternateName: "ଓଡ଼ିଶା",
    containedInPlace: { "@type": "Country", name: "India" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${odia.variable}`}>
      <head>
        {/* Applies the stored theme before first paint — no flash on reload. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="grain antialiased">
        <ThemeProvider>
          <LocaleProvider>
            <SmoothScroll />
            <ScrollProgress />
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
