import type { Metadata } from "next";
import "./globals.css";
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import localFont from 'next/font/local';

const ceraProRegular = localFont({
  src: '../public/fonts/cerapro-regular.woff2',
  variable: "--font-cera-pro",
});

export const metadata: Metadata = {
  title: "UniCompass",
  description: "Made by the best devs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={ceraProRegular.variable}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
      </head>
      <body style={{ fontFamily: 'var(--font-cera-pro)'}}>
        <Header />
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}