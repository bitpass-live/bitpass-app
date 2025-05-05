import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth-provider';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata: Metadata = {
  title: {
    default: 'NotPass – Venta de Entradas con Bitcoin y Nostr',
    template: '%s | NotPass',
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
    title: 'NotPass – Eventos con Lightning y Nostr',
    description: 'La nueva forma de crear, cobrar y validar entradas usando Bitcoin y tecnología descentralizada.',
    url: 'https://notpass.io',
    siteName: 'NotPass',
    images: [
      {
        url: 'https://notpass.io/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NotPass Preview',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NotPass – Venta de Entradas con Bitcoin y Nostr',
    description: 'Gestioná eventos y cobrá en SATs con Nostr y Lightning.',
    site: '@notpass_io',
    creator: '@notpass_io',
    images: ['https://notpass.io/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: 'https://notpass.io',
    languages: {
      'es-AR': 'https://notpass.io',
      'en-US': 'https://notpass.io/en',
    },
  },
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className='scroll-smooth dark'>
      <body className='bg-[#0A0A0A] font-sans'>
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
