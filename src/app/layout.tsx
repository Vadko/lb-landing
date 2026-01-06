import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lblauncher.com"),
  title: {
    default: "LB Launcher — Ігри українською мовою | Українізатор ігор",
    template: "%s | LB Launcher — Українізатор ігор",
  },
  description:
    "Безкоштовний українізатор ігор. Встановлюйте українську локалізацію для ігор в один клац. Грайте українською — понад 80+ ігор з українським перекладом.",
  keywords: [
    "українізатор",
    "українізатор ігор",
    "українська локалізація",
    "грати українською",
    "ігри українською",
    "український переклад ігор",
    "LB Launcher",
    "локалізація ігор",
    "переклад ігор українською",
    "українізація ігор",
    "ігри на українській",
    "українська мова в іграх",
  ],
  authors: [{ name: "Little Bit" }],
  creator: "Little Bit",
  publisher: "Little Bit",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://lblauncher.com",
    siteName: "LB Launcher — Українізатор ігор",
    title: "LB Launcher — Ігри українською мовою",
    description:
      "Безкоштовний українізатор ігор. Встановлюйте українську локалізацію для ігор в один клац.",
    images: [
      {
        url: "/assets/og-image.webp",
        width: 1200,
        height: 630,
        alt: "LB Launcher — Українізатор ігор",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LB Launcher — Ігри українською мовою",
    description:
      "Безкоштовний українізатор ігор. Встановлюйте українську локалізацію для ігор в один клац.",
    images: ["/assets/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "LB Launcher",
              description:
                "Безкоштовний українізатор ігор. Встановлюйте українську локалізацію для ігор в один клац.",
              url: "https://lblauncher.com",
              downloadUrl:
                "https://github.com/Vadko/littlebit-launcher/releases/latest",
              operatingSystem: "Windows, macOS, Linux",
              applicationCategory: "GameApplication",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "UAH",
              },
              author: {
                "@type": "Organization",
                name: "Little Bit",
                url: "https://t.me/LittleBitUA",
              },
              inLanguage: "uk",
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <QueryProvider>
            <BackgroundEffects />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
            <ScrollToTop />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
