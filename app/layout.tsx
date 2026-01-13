import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayoutWrapper from "./conditional-layout-wrapper";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { generateStructuredData } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = generateSEOMetadata({
  title: undefined, // Will use default title
  description: "Formula IHU is the official Formula Student Competition held in Greece, part of Formula Student World Series. Engineering the future, one lap at a time!",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationStructuredData = generateStructuredData({
    type: 'Organization',
    data: {},
  });

  const websiteStructuredData = generateStructuredData({
    type: 'WebSite',
    data: {},
  });

  return (
    <html lang="en">
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
      </head>
      <body 
        className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
      </body>
    </html>
  );
}
