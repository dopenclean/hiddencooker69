import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hidden Cooker",
  description: "Secure password entry",
  icons: {
    icon: [
      { url: '/white.png', sizes: 'any' }
    ],
    apple: '/white.png',
    shortcut: '/white.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
