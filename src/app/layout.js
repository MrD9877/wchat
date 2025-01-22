import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/StoreProvider";
import SetUser from "./components/SetUser";
import GetMessages from "./components/GetMessages";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StoreProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SetUser />
          <GetMessages />
          {children}
        </body>
      </StoreProvider>
    </html>
  );
}
