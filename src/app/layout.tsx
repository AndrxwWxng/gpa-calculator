import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "AISD GPA Calculator",
  description: "GPA Calculator for Allen ISD!",
  keywords: ["GPA", "Calculator", "Allen", "ISD", "GPA Calculator", "GPA Calculator for Allen ISD"],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/images/logo.png', type: 'image/png' }
    ],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: [{ url: '/images/logo.png', type: 'image/png' }],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/images/logo.png' }
    ]
  },
  openGraph: {
    type: "website",
    siteName: "GPA Calculator",
    title: undefined,
    description: "GPA Calculator for Allen ISD!",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 800,
        alt: "GPA Calculator Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: undefined,
    description: "GPA Calculator for Allen ISD!",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5MBD543C26"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5MBD543C26');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
