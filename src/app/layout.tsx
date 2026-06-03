import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://predicted.wtf"),
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
      <body className="h-full overflow-x-hidden font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
