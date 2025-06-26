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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* meta tags for opengraph and twtiter */}
        <meta property="og:site_name" content="GPA Calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AISD GPA Calculator" />
        <meta property="og:description" content="GPA Calculator for Allen ISD!" />
        <meta property="og:url" content="https://gpa-calculator-andrxwwxng.vercel.app" />
        <meta property="og:image" content="https://gpa-calculator-andrxwwxng.vercel.app/images/gpalogo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AISD GPA Calculator" />
        <meta name="twitter:description" content="GPA Calculator for Allen ISD!" />
        <meta name="twitter:image" content="https://gpa-calculator-andrxwwxng.vercel.app/images/gpalogo.png" />

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
