import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LayoutWrapper from "./layoutWrapper"

const outfit = Outfit({
  display: "swap",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "BookKart",
  description: "This is e-commerce platform where you can buy or sell your used books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <LayoutWrapper>
          
        <Header/>
        {children}
        <Footer/>
        
        </LayoutWrapper>

      </body>
    </html>
  );
}
