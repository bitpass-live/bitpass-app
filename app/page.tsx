'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useDraftEventContext } from '@/lib/draft-event-context';
import { useAuth } from '@/lib/auth-provider';

import CheckoutPage from '@/components/checkout/checkout-page';
import { LoaderView } from '@/components/loader-view';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();
  const { draftEvent } = useDraftEventContext();

  console.log('draftEvent', draftEvent);

  // Redirect to onboarding
  useEffect(() => {
    if (!draftEvent || !draftEvent.id || draftEvent.status === 'DRAFT') {
      router.push('/onboarding');
    }
  }, [user.loaded, isAuthenticated, draftEvent, router]);

  // Redirect to login if user is not authenticated and no draft event exists
  useEffect(() => {
    if (!isAuthenticated && (!draftEvent || !draftEvent.id)) {
      router.push('/login');
    }
  }, [user.loaded, isAuthenticated, draftEvent, router]);

  if (!draftEvent) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading event...</p>
      </div>
    );
  }

  return <CheckoutPage />;
}
