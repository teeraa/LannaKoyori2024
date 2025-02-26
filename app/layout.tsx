// 'use client';

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar";
// import Footer from "./components/footer";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

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
  title: "Lanna | Koyori ",
  description: "",
  icons: {
    icon: "/images/koyori-meta-logo3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth no-scrollbar">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Navbar />
          {/* <QueryClientProvider client={queryClient}> */}
            {children}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          {/* </QueryClientProvider> */}
        {/* <Footer/>         */}
      </body>
    </html>
  );
}
