import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {Header} from "@/components/common/Header";
import {Footer} from "@/components/common/Footer";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "News Aggregator",
  description: "Get (news) from different portals",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <Header/>
      <div>{children}</div>
      <Toaster />
      <Footer/>
    </body>
    </html>
  );
}
