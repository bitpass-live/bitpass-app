import type React from 'react';
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-provider';
import { AuthGuard } from '@/components/auth/auth-guard';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'BitPass – Venta de Entradas con Bitcoin y Nostr',
    template: '%s | BitPass',
  },
  description:
    'Organizá eventos descentralizados, vendé entradas verificables y cobrá con Lightning Network. 100% open source.',
  keywords: [
    'eventos',
    'entradas',
    'Bitcoin',
    'Lightning Network',
    'Nostr',
    'NFT tickets',
    'ticketing descentralizado',
  ],
  openGraph: {
    title: 'BitPass – Eventos con Lightning y Nostr',
    description: 'La nueva forma de crear, cobrar y validar entradas usando Bitcoin y tecnología descentralizada.',
    url: 'https://BitPass.io',
    siteName: 'BitPass',
    images: [
      {
        url: 'https://BitPass.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BitPass Preview',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BitPass – Venta de Entradas con Bitcoin y Nostr',
    description: 'Gestioná eventos y cobrá en SATs con Nostr y Lightning.',
    site: '@BitPass_io',
    creator: '@BitPass_io',
    images: ['https://BitPass.io/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: 'https://BitPass.io',
    languages: {
      'es-AR': 'https://BitPass.io',
      'en-US': 'https://BitPass.io/en',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className='scroll-smooth dark'>
      <body>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
          <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
