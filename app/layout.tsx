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
    default: 'BitPass - Ticket Sales with Bitcoin and Nostr',
    template: '%s | BitPass',
  },
  description: 'Manage events, sell tickets, and get paid with Lightning Network and Nostr.',
  keywords: ['events', 'tickets', 'Bitcoin', 'Lightning Network', 'Nostr'],
  openGraph: {
    title: 'BitPass - Ticket Sales with Bitcoin and Nostr',
    description: 'Manage events, sell tickets, and get paid with Lightning Network and Nostr.',
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
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BitPass - Ticket Sales with Bitcoin and Nostr',
    description: 'Manage events, sell tickets, and get paid with Lightning Network and Nostr.',
    site: '@bitpasslive',
    creator: '@bitpasslive',
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
      'en-US': 'https://bitpass.live',
      'es-AR': 'https://bitpass.live/es',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='scroll-smooth dark bg-background'>
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
