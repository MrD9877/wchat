import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import StoreProvider from "@/redux/StoreProvider";
import SetUser from "../components/SetUser";
import { Toaster } from "@/components/ui/sonner";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { ReactNode, Suspense } from "react";
import Loading from "@/components/Loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HindsApp",
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>

      <StoreProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* <PwaCustumServicePush /> */}
          <Loading />
          <Suspense>
            <SetUser />
            <main className="w-screen h-svh flex overflow-clip ">
              <div className="max-w-viewWidth vw:min-w-viewWidth w-full h-svh overflow-y-scroll">{children}</div>
              <div className="hidden w-full h-svh overflow-clip vw:flex justify-center items-center bg-[#e8e8e3]">
                <div>
                  <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M29 56V26C29 25.4477 28.5523 25 28 25H10C4.5 25 0 29.5 0 35V65C0 70.5 4.5 75 10 75H14C14.5523 75 15 75.4477 15 76V87.5858C15 88.4767 16.0771 88.9229 16.7071 88.2929L29.7071 75.2929C29.8946 75.1054 30.149 75 30.4142 75H55C60.5 75 65 70.5 65 65V56.9074C65 56.389 64.5184 56.0061 64 56.005H29.005C29.0022 56.005 29 56.0028 29 56ZM90 0H45C39.5 0 35 4.5 35 10V49C35 49.5523 35.4477 50 36 50H69.5858C69.851 50 70.1054 50.1054 70.2929 50.2929L83.2929 63.2929C83.9229 63.9229 85 63.4767 85 62.5858V51C85 50.4477 85.4477 50 86 50H90C95.5 50 100 45.505 100 40V10C100 4.5 95.5 0 90 0Z"
                      fill="#27B1B2"
                    />
                    <circle cx="53.8699" cy="25.2858" r="4.39754" fill="white" />
                    <circle cx="67.0632" cy="25.2858" r="4.39754" fill="white" />
                    <circle cx="80.2554" cy="25.2858" r="4.39754" fill="white" />
                  </svg>
                </div>
              </div>
            </main>

            <Toaster />
          </Suspense>
        </body>
      </StoreProvider>
    </html>
  );
}
