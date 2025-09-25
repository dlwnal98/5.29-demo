import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import Providers from '@/components/providers';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Clalink',
  description: 'Created with Nexfron',
  generator: 'Nexfron',
  icons: '/nexfron_favicon.png',
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
          href="https://unpkg.com/pretendard@1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {/* <Providers>
          <AuthGuard>{children}</AuthGuard>
        </Providers> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
