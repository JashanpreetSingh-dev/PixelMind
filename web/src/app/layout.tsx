import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { RegisterSW } from "./RegisterSW";
import { clerkAppearance } from "@/lib/clerk-theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelMind",
  description:
    "PixelMind – pixel habit tracking, night journaling, and AI memory in one place.",
  manifest: "/manifest.webmanifest",
  themeColor: "#161c24",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PixelMind",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RegisterSW />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
