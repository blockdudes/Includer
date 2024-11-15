import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/lib/ReduxProvider";
import { Toaster } from "react-hot-toast";
import VerifyAuth from "@/lib/verifyAuth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Includer",
  description: "Includer - A Web3 Banking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen bg-[url('/background.svg')] bg-cover text-white overflow-hidden`}
      >
        <ReduxProvider>
          <VerifyAuth>
            <Navbar />
            <main className="h-[calc(100%-6rem)]">{children}</main>
            <Toaster containerStyle={{ zIndex: 9999 }} />
          </VerifyAuth>
        </ReduxProvider>
      </body>
    </html>
  );
}
