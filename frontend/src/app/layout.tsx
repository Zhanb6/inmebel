/*
 * Copyright (c) 2025. Sayat Raykul
 */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/core/styles/globals.css";
import { ToastContainer } from "react-toastify";
import { ClientProvidersWrapper } from "@/core";
import { ReactNode } from "react";
import { getUserLanguage } from "@/i18n/server";
import { SearchProvider } from "@/shared/components/layout/SearchContext";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const libreFranklin = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mebelapp",
    template: `%s - Mebelapp`,
  },
  metadataBase: new URL("https://github.com/Sayyat/logoped_frontend"),
  description: "Mebelapp",
  keywords: ["Mebelapp"],
  authors: [
    {
      name: "ZIZ INC.",
      url: "https://web.ziz.kz/",
    },
  ],
  creator: "ZIZ INC.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://logoped-frontend.vercel.app/",
    title: 'Mebelapp"',
    description: "Mebelapp",
    siteName: 'Mebelapp"',
    images: [
      {
        url: "https://logoped-frontend.vercel.app//assets/logo.png",
        width: 1200,
        height: 630,
        alt: 'Mebelapp"',
      },
    ],
  },
  generator: "Next js",
  icons: {
    icon: "/assets/android-chrome-192x192.png",
    shortcut: "/assets/android-chrome-512x512.png",
    apple: "/assets/apple-touch-icon.png",
  },
  manifest: "https://logoped-frontend.vercel.app/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const lang = await getUserLanguage();

  return (
    <html lang={lang}>
      <head>
        <title>Mebelapp</title>
      </head>
      <body className={`${libreFranklin.variable} antialiased bg-[#f5f5f5]`}>
        <ClientProvidersWrapper>
          <SearchProvider>{children}</SearchProvider>
          <ToastContainer
            limit={3}
            toastClassName={
              "font-bold bg-accent text-accent-foreground flex items-center p-4 z-1002"
            }
          />
        </ClientProvidersWrapper>
      </body>
    </html>
  );
}
