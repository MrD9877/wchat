import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "@/redux/StoreProvider";
import SetUser from "../components/SetUser";
import GetMessages from "../components/GetMessages";
import { Toaster } from "@/components/ui/sonner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import PwaCustumServicePush from "../components/AddserviceWorker";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WChat",
  description: "Text app for the web",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next15", "pwa", "next-pwa"],
  authors: [
    {
      name: "Dhuruv Bansal",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <StoreProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* <PwaCustumServicePush /> */}
          <SetUser />
          <GetMessages />
          {children}
          <Toaster />
        </body>
      </StoreProvider>
    </html>
  );
}
