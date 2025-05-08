// 'use client';

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navbar";
// import Footer from "./components/footer";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import GoogleTranslate from "./components/GoogleTranslate";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Lanna | Koyori ",
  description: "",
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
        className={`scroll-smooth ${kanit.className}`}
      >
        <GoogleTranslate />
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
