import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayoutWrapper from "./conditional-layout-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Formula IHU - Engineering the future, one lap at a time!",
  description: "Formula IHU is the official Formula Student Competition held in Greece, part of Formula Student World Series.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}
        suppressHydrationWarning
      >
        <ConditionalLayoutWrapper>{children}</ConditionalLayoutWrapper>
      </body>
    </html>
  );
}
