import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Clalink",
  description: "Created with Nexfron",
  generator: "Nexfron",
  icons: "/nexfron_favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
