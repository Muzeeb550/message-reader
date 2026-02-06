import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Message Reader",
  description: "Read messages in multiple languages",
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
