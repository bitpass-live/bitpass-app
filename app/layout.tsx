import type React from 'react';
import type { Metadata } from 'next';

import { AuthProvider } from '@/lib/auth-provider';
import { DraftEventProvider } from '@/lib/draft-event-context';
import { INSTANCE_ID } from '@/lib/instance-id';
import { YadioProvider } from '@/lib/yadio-context';

import { Toaster } from '@/components/ui/toaster';
import { AuthGuard } from '@/components/auth/auth-guard';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'BitPass - Venta de Entradas con Bitcoin y Nostr',
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
    title: 'BitPass - Eventos con Lightning y Nostr',
    description: 'La nueva forma de crear, cobrar y validar entradas usando Bitcoin y tecnología descentralizada.',
    url: 'https://bitpass.live',
    siteName: 'BitPass',
    images: [
      {
        url: 'https://bitpass.live/og-image.jpg',
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
    title: 'BitPass - Venta de Entradas con Bitcoin y Nostr',
    description: 'Gestioná eventos y cobrá en SATs con Nostr y Lightning.',
    site: '@BitPass_io',
    creator: '@BitPass_io',
    images: ['https://bitpass.live/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: 'https://bitpass.live',
    languages: {
      'es-AR': 'https://bitpass.live',
      'en-US': 'https://bitpass.live/en',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es' className='scroll-smooth dark bg-background'>
      <body>
        <AuthProvider>
          <DraftEventProvider instanceId={INSTANCE_ID}>
            <YadioProvider>
              <AuthGuard>{children}</AuthGuard>
              <Toaster />
            </YadioProvider>
          </DraftEventProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
