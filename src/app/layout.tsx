import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Predicted — Where reality lands",
  description:
    "Continuous prediction markets on Solana. Forecast ranges and trade against a shared probability distribution.",
  openGraph: {
    title: "Predicted — Where reality lands",
    description:
      "Continuous prediction markets on Solana. Forecast ranges, not yes/no bets.",
    url: "https://predicted.wtf",
    siteName: "Predicted",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  );
}
